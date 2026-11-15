/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createRoom } from "../../utils/createRoom";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Modal({ color, rotating, resetKey, interaction, roomStyle }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const interactionRef = useRef(interaction);
  const roomStyleRef = useRef(roomStyle);
  const [moving, setMoving] = useState(false);
  const rotationRef = useRef(rotating);
  const colorRef = useRef(color);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    interactionRef.current = interaction;
    if (sceneRef.current) sceneRef.current.controls.enabled = interaction === "orbit";
  }, [interaction]);
  useEffect(() => {
    roomStyleRef.current = roomStyle;
    sceneRef.current?.room?.apply(roomStyle);
  }, [roomStyle]);
  useEffect(() => { rotationRef.current = rotating; }, [rotating]);
  useEffect(() => {
    colorRef.current = color;
    sceneRef.current?.material.color.set(color);
  }, [color]);
  useEffect(() => { sceneRef.current?.reset(); }, [resetKey]);

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("error");
      return;
    }
    setStatus("loading");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-label", "Interactive 3D room. In Place chair mode, drag the chair or use arrow keys to move it. In Orbit view mode, drag to look around.");
    renderer.domElement.setAttribute("tabindex", "0");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 1000);
    const initialDirection = new THREE.Vector3(2.7, 1.4, 4).normalize();
    camera.position.copy(initialDirection);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb1a48c, 1.8));
    const key = new THREE.DirectionalLight(0xfff5e5, 3);
    key.position.set(4, 6, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.normalBias = 0.02;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.4);
    fill.position.set(-4, 3, -2);
    scene.add(fill);
    const material = new THREE.MeshStandardMaterial({ color: colorRef.current, roughness: 0.72, metalness: 0.06 });
    const pivot = new THREE.Group();
    scene.add(pivot);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.enabled = interactionRef.current === "orbit";
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.1;
    // Full horizontal orbit; room walls cut away when the camera moves behind them.
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    let dragging = false;
    let lastInteraction = -Infinity;
    controls.addEventListener("start", () => { dragging = true; });
    controls.addEventListener("end", () => { dragging = false; lastInteraction = performance.now(); });
    let radius = 0;
    let room;
    let floorY = 0;
    const raycaster = new THREE.Raycaster();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const pointer = new THREE.Vector2();
    const grabOffset = new THREE.Vector3();
    let grabbedPointer = null;
    let disposed = false;
    const originals = new Set();
    const textures = new Set();
    const fit = () => {
      const { clientWidth: width, clientHeight: height } = mount;
      if (!width || !height) return;
      camera.aspect = width / height;
      if (radius) {
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        const distance = radius * 1.12 / Math.sin(Math.min(halfFov, Math.atan(Math.tan(halfFov) * camera.aspect)));
        camera.position.sub(controls.target).normalize().multiplyScalar(distance).add(controls.target);
        camera.near = Math.max(0.01, radius / 100);
        camera.far = distance + radius * 30;
        controls.minDistance = distance;
        controls.maxDistance = distance * 1.35;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      controls.update();
    };
    const reset = () => {
      pivot.rotation.set(0, 0, 0);
      pivot.position.set(0, 0, 0);
      camera.position.copy(initialDirection);
      controls.target.set(0, 0, 0);
      fit();
    };
    sceneRef.current = { material, reset, controls };
    const clampPosition = () => {
      pivot.position.x = THREE.MathUtils.clamp(pivot.position.x, -radius * 0.65, radius * 0.65);
      pivot.position.z = THREE.MathUtils.clamp(pivot.position.z, -radius * 0.55, radius * 0.55);
      // Keep the full chair inside the camera framing at every allowed position.
      const distance = Math.hypot(pivot.position.x, pivot.position.z);
      if (distance > radius * 0.65) {
        pivot.position.multiplyScalar(radius * 0.65 / distance);
      }
      // Follow placement so the chair remains centered instead of shrinking the entire scene.
      const shift = pivot.position.clone().sub(controls.target);
      camera.position.add(shift);
      controls.target.copy(pivot.position);
      controls.update();
    };
    const castPointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
    };
    const onPointerDown = (event) => {
      if (interactionRef.current !== "move" || !radius || event.button !== 0 || grabbedPointer !== null) return;
      castPointer(event);
      if (!raycaster.intersectObject(pivot, true).length) return;
      const point = raycaster.ray.intersectPlane(floorPlane, new THREE.Vector3());
      if (!point) return;
      grabbedPointer = event.pointerId;
      grabOffset.copy(point).sub(pivot.position);
      dragging = true;
      setMoving(true);
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (grabbedPointer !== event.pointerId) return;
      castPointer(event);
      const point = raycaster.ray.intersectPlane(floorPlane, new THREE.Vector3());
      if (point) {
        pivot.position.copy(point.sub(grabOffset));
        pivot.position.y = 0;
        clampPosition();
      }
    };
    const onPointerUp = (event) => {
      if (grabbedPointer !== event.pointerId) return;
      grabbedPointer = null;
      dragging = false;
      lastInteraction = performance.now();
      setMoving(false);
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    const onKey = (event) => {
      const amounts = { ArrowLeft: -0.15, ArrowRight: 0.15, ArrowUp: -0.15, ArrowDown: 0.15 };
      if (!(event.key in amounts)) return;
      event.preventDefault();
      if (interactionRef.current === "move") {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") pivot.position.x += amounts[event.key] * radius;
        else pivot.position.z += amounts[event.key] * radius;
        clampPosition();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") pivot.rotation.y += amounts[event.key];
      else pivot.rotation.y += amounts[event.key];
      lastInteraction = performance.now();
    };
    renderer.domElement.addEventListener("keydown", onKey);
    const observer = new ResizeObserver(fit);
    observer.observe(mount);
    const disposeObject = (object) => object.traverse((child) => {
      child.geometry?.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.filter(Boolean).forEach((entry) => {
        Object.values(entry).forEach((value) => { if (value?.isTexture) value.dispose(); });
        entry.dispose();
      });
    });
    new GLTFLoader().load("/assets/modal/real-chair.gltf", ({ scene: model }) => {
      if (disposed) { disposeObject(model); return; }
      model.rotation.y = -Math.PI / 7;
      model.traverse((child) => {
        if (!child.isMesh) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((entry) => {
          originals.add(entry);
          Object.values(entry).forEach((value) => { if (value?.isTexture) textures.add(value); });
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      });
      const box = new THREE.Box3().setFromObject(model);
      model.position.sub(box.getCenter(new THREE.Vector3()));
      pivot.add(model);
      radius = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere()).radius;
      floorY = new THREE.Box3().setFromObject(model).min.y;
      floorPlane.constant = -floorY;
      room = createRoom(scene, radius, floorY);
      room.apply(roomStyleRef.current);
      sceneRef.current.room = room;
      key.position.set(radius * 3, radius * 6, radius * 4);
      key.shadow.camera.left = -radius * 4;
      key.shadow.camera.right = radius * 4;
      key.shadow.camera.top = radius * 4;
      key.shadow.camera.bottom = -radius * 4;
      key.shadow.camera.far = radius * 20;
      key.shadow.camera.updateProjectionMatrix();
      fit();
      setStatus("ready");
    }, undefined, () => { if (!disposed) setStatus("error"); });
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previous;
    renderer.setAnimationLoop((time) => {
      const delta = previous === undefined ? 0 : Math.min((time - previous) / 1000, 0.1);
      previous = time;
      if (rotationRef.current && !motionQuery.matches && !dragging && performance.now() - lastInteraction > 1800) pivot.rotation.y += delta * 0.22;
      controls.update();
      room?.update(camera);
      renderer.render(scene, camera);
    });
    return () => {
      disposed = true;
      sceneRef.current = null;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      renderer.domElement.removeEventListener("keydown", onKey);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      room?.dispose();
      key.shadow.dispose();
      controls.dispose();
      disposeObject(pivot);
      originals.forEach((entry) => entry.dispose());
      textures.forEach((entry) => entry.dispose());
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [attempt]);

  return <div className={`chair-viewport room-viewport ${moving ? "is-moving" : ""} ${interaction === "move" ? "move-mode" : "orbit-mode"}`} ref={mountRef}>
    <span className="placement-status" role="status">{moving ? "Placing chair… release to drop" : ""}</span>
    {status !== "ready" && <div className="viewer-message" role="status"><div>{status === "loading" ? "Preparing your new perspective…" : <>The 3D preview couldn’t load.<br /><button onClick={() => setAttempt(attempt + 1)}>Try again</button></>}</div></div>}
  </div>;
}
