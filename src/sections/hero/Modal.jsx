/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Modal = ({ id }) => {
  const modalRef = useRef(null);
  useGSAP(() => {
    gsap.to("#header", {
      opacity: 1,
      duration: 2,
      x: 20,
      ease: "power4.out",
    });
  }, []);

  useEffect(() => {
    const mount = modalRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      30,
      mount.clientWidth / mount.clientHeight,
      0.7,
      1500
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Epic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Add showroom-style spotlights
    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(10, 20, 10);
    spotLight1.angle = Math.PI / 6;
    spotLight1.penumbra = 0.1;
    spotLight1.decay = 2;
    spotLight1.distance = 200;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 1);
    spotLight2.position.set(-10, 20, 10);
    spotLight2.angle = Math.PI / 6;
    spotLight2.penumbra = 0.1;
    spotLight2.decay = 2;
    spotLight2.distance = 200;
    scene.add(spotLight2);

    const spotLight3 = new THREE.SpotLight(0xffffff, 1);
    spotLight3.position.set(0, 20, -10);
    spotLight3.angle = Math.PI / 6;
    spotLight3.penumbra = 0.1;
    spotLight3.decay = 2;
    spotLight3.distance = 200;
    scene.add(spotLight3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    controls.enablePan = false;
    camera.position.set(2, 1, 3);
    controls.update();

    let modelRadius = 0;
    let disposed = false;
    const pivot = new THREE.Group();
    scene.add(pivot);

    // Fit the complete rotation inside the narrower dimension of the canvas.
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      if (modelRadius) {
        const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
        const distance = (modelRadius * 1.15) /
          Math.sin(Math.min(verticalHalfFov, horizontalHalfFov));
        const direction = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(direction.multiplyScalar(distance));
        camera.near = Math.max(modelRadius / 100, 0.01);
        camera.far = distance + modelRadius * 4;
        controls.target.set(0, 0, 0);
        controls.update();
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // Load Furniture Model
    const loader = new GLTFLoader();
    loader.load("/assets/modal/real-chair.gltf", (gltf) => {
      const furniture = gltf.scene;
      if (disposed) {
        disposeModel(furniture);
        return;
      }
      furniture.rotation.y = THREE.MathUtils.degToRad(-30);
      furniture.scale.set(1.2, 1.2, 1.2);

      const box = new THREE.Box3().setFromObject(furniture);
      const center = box.getCenter(new THREE.Vector3());
      furniture.position.sub(center);

      pivot.add(furniture);
      modelRadius = new THREE.Box3().setFromObject(furniture)
        .getBoundingSphere(new THREE.Sphere()).radius;
      resize();
    });

    const disposeModel = (model) => {
      model.traverse((object) => {
        object.geometry?.dispose();
        const materials = Array.isArray(object.material)
          ? object.material : [object.material];
        materials.filter(Boolean).forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value?.isTexture) value.dispose();
          });
          material.dispose();
        });
      });
    };
    let previousTime;
    renderer.setAnimationLoop((time) => {
      const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;
      pivot.rotation.y += delta * 0.3;
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      disposeModel(pivot);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div
      ref={modalRef}
      id={id}
      className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer"
    />
  );
};

export default Modal;
