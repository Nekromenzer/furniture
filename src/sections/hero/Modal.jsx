/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// eslint-disable-next-line react/prop-types
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
    renderer.setSize(mount?.clientWidth, mount?.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
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

    // Load Furniture Model
    const loader = new GLTFLoader();
    loader.load("/assets/modal/Kitchen Cabinet.glb", (gltf) => {
      console.log(gltf.scene, "Debug: Component is mounting");
      const furniture = gltf.scene;
      furniture.rotation.y = THREE.MathUtils.degToRad(145);
      furniture.scale.set(1.5, 1.5, 1.5);

      const box = new THREE.Box3().setFromObject(furniture);
      const center = box.getCenter(new THREE.Vector3());
      furniture.position.sub(center);

      scene.add(furniture);

      const pivot = new THREE.Object3D();
      pivot.add(furniture);
      scene.add(pivot);

      // Auto-Rotate Animation
      const animate = () => {
        requestAnimationFrame(animate);
        pivot.rotation.y += 0.005; // Rotate around Y axis
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    });

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    controls.enableRotate = true;

    camera.position.set(0, 1, 3);
    controls.update();

    // Handle window resize
    // const handleResize = () => {
    //   camera.aspect = mount.clientWidth / mount.clientHeight;
    //   camera.updateProjectionMatrix();
    //   renderer.setSize(mount.clientWidth, mount.clientHeight);
    // };
    // window.addEventListener("resize", handleResize);

    return () => {
      mount.removeChild(renderer.domElement);
      //   window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      ref={modalRef}
      id={id}
      className="pt-[2rem] w-1/2 h-screen bg-blur-400 right-5 ml-auto absolute z-10"
    />
  );
};

export default Modal;
