/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Modal({ color, rotating, resetKey }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rotationRef = useRef(rotating);
  const colorRef = useRef(color);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("aria-label", "Interactive chair preview. Drag to rotate, or use arrow keys when focused.");
    renderer.domElement.setAttribute("tabindex", "0");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 1000);
    const initialDirection = new THREE.Vector3(2.7, 1.4, 4).normalize();
    camera.position.copy(initialDirection);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb1a48c, 2.8));
    const key = new THREE.DirectionalLight(0xfff5e5, 4);
    key.position.set(4, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 2);
    fill.position.set(-4, 3, -2);
    scene.add(fill);
    const material = new THREE.MeshStandardMaterial({ color: colorRef.current, roughness: 0.72, metalness: 0.06 });
    const pivot = new THREE.Group();
    scene.add(pivot);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 1.8;
    let dragging = false;
    let lastInteraction = -Infinity;
    controls.addEventListener("start", () => { dragging = true; });
    controls.addEventListener("end", () => { dragging = false; lastInteraction = performance.now(); });
    let radius = 0;
    let disposed = false;
    const originals = new Set();
    const textures = new Set();
    const fit = () => {
      const { clientWidth: width, clientHeight: height } = mount;
      if (!width || !height) return;
      camera.aspect = width / height;
      if (radius) {
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        const distance = radius * 1.08 / Math.sin(Math.min(halfFov, Math.atan(Math.tan(halfFov) * camera.aspect)));
        camera.position.normalize().multiplyScalar(distance);
        camera.near = Math.max(0.01, radius / 100);
        camera.far = distance + radius * 5;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      controls.update();
    };
    const reset = () => {
      pivot.rotation.set(0, 0, 0);
      camera.position.copy(initialDirection);
      controls.target.set(0, 0, 0);
      fit();
    };
    sceneRef.current = { material, reset };
    const onKey = (event) => {
      const amounts = { ArrowLeft: -0.15, ArrowRight: 0.15, ArrowUp: -0.15, ArrowDown: 0.15 };
      if (!(event.key in amounts)) return;
      event.preventDefault();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") pivot.rotation.y += amounts[event.key];
      else pivot.rotation.x = THREE.MathUtils.clamp(pivot.rotation.x + amounts[event.key], -0.4, 0.4);
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
      });
      const box = new THREE.Box3().setFromObject(model);
      model.position.sub(box.getCenter(new THREE.Vector3()));
      pivot.add(model);
      radius = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere()).radius;
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
      renderer.render(scene, camera);
    });
    return () => {
      disposed = true;
      sceneRef.current = null;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      renderer.domElement.removeEventListener("keydown", onKey);
      controls.dispose();
      disposeObject(pivot);
      originals.forEach((entry) => entry.dispose());
      textures.forEach((entry) => entry.dispose());
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [attempt]);

  return <div className="chair-viewport" ref={mountRef}>
    {status !== "ready" && <div className="viewer-message" role="status"><div>{status === "loading" ? "Preparing your new perspective…" : <>The 3D preview couldn’t load.<br /><button onClick={() => setAttempt(attempt + 1)}>Try again</button></>}</div></div>}
  </div>;
}
