import * as THREE from "three";

export const roomPalettes = {
  sand: { wall: "#e7dfcf", floor: "#b7a58b", rug: "#ded2ba", accent: "#a9724e" },
  sage: { wall: "#aeb6a2", floor: "#b5a58f", rug: "#e0dbc9", accent: "#4f6551" },
  gallery: { wall: "#d9d7d1", floor: "#98948b", rug: "#c7c2b6", accent: "#383e42" },
};

export function createRoom(scene, radius, floorY) {
  const room = new THREE.Group();
  const materials = {};
  const backWall = [];
  const sideWall = [];
  const plant = [];
  const makeMaterial = (name, color) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
    materials[name] = material;
    return material;
  };
  const palette = roomPalettes.sand;
  const wall = makeMaterial("wall", palette.wall);
  const floor = makeMaterial("floor", palette.floor);
  const rug = makeMaterial("rug", palette.rug);
  const accent = makeMaterial("accent", palette.accent);
  const cream = new THREE.MeshStandardMaterial({ color: "#eee9db", roughness: 0.85 });
  const leaf = new THREE.MeshStandardMaterial({ color: "#536445", roughness: 1 });
  const add = (geometry, material, x, y, z) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x * radius, floorY + y * radius, z * radius);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    room.add(mesh);
    return mesh;
  };
  add(new THREE.BoxGeometry(radius * 24, radius * 0.08, radius * 24), floor, 0, -0.05, 0);
  backWall.push(add(new THREE.BoxGeometry(radius * 24, radius * 9, radius * 0.12), wall, 0, 4.45, -3.5));
  sideWall.push(add(new THREE.BoxGeometry(radius * 0.12, radius * 9, radius * 24), wall, -4.5, 4.45, 0));
  add(new THREE.BoxGeometry(radius * 3.9, radius * 0.025, radius * 3), rug, 0, 0.008, 0);
  // Floor seams and wall battens give the room depth without downloaded assets.
  for (let x = -7; x <= 7; x++) {
    add(new THREE.BoxGeometry(radius * 0.008, radius * 0.005, radius * 20), cream, x * 0.55, -0.006, 0);
  }
  for (let x = -5; x <= 6; x++) backWall.push(add(new THREE.BoxGeometry(radius * 0.025, radius * 5, radius * 0.04), cream, x * 0.55, 2.5, -3.41));
  backWall.push(add(new THREE.BoxGeometry(radius * 1.1, radius * 1.6, radius * 0.07), accent, -1.8, 2.1, -3.35));
  backWall.push(add(new THREE.BoxGeometry(radius * 0.93, radius * 1.43, radius * 0.08), cream, -1.8, 2.1, -3.29));
  const art = add(new THREE.CircleGeometry(radius * 0.33, 40), accent, -1.8, 2.25, -3.23);
  art.scale.y = 1.4;
  backWall.push(art);
  plant.push(add(new THREE.CylinderGeometry(radius * 0.31, radius * 0.23, radius * 0.55, 28), accent, -2.65, 0.28, -1.7));
  for (let i = 0; i < 7; i++) {
    const angle = i * Math.PI * 2 / 7;
    const mesh = add(new THREE.SphereGeometry(radius * 0.2, 12, 12), leaf, -2.65 + Math.cos(angle) * 0.24, 1 + (i % 3) * 0.18, -1.7 + Math.sin(angle) * 0.24);
    plant.push(mesh);
    mesh.scale.set(0.6, 2.1, 0.5);
    mesh.rotation.z = Math.cos(angle) * 0.7;
  }
  scene.add(room);
  return {
    apply(name) {
      const colors = roomPalettes[name] || palette;
      Object.entries(colors).forEach(([key, value]) => materials[key].color.set(value));
      scene.background = new THREE.Color(colors.wall);
    },
    update(camera) {
      // Cutaway walls: a wall between the viewer and furniture must never obscure the chair.
      backWall.forEach((mesh) => { mesh.visible = camera.position.z > -radius * 3.15; });
      sideWall.forEach((mesh) => { mesh.visible = camera.position.x > -radius * 4.15; });
      plant.forEach((mesh) => { mesh.visible = !(camera.position.x < -radius && camera.position.z < -radius); });
    },
    dispose() { room.traverse((mesh) => mesh.geometry?.dispose()); new Set([...Object.values(materials), cream, leaf]).forEach((material) => material.dispose()); scene.remove(room); },
  };
}
