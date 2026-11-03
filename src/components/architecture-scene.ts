import * as THREE from "three";

export type SceneParameters = { finish: "arena" | "oliva" | "terracota"; exploded: number; rotating: boolean };
export type ArchitectureController = { update: (parameters: SceneParameters) => void; reset: () => void; zoom: (direction: number) => void; dispose: () => void };

export function createArchitectureScene(canvas: HTMLCanvasElement, initial: SceneParameters, onUnavailable: () => void): ArchitectureController {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e9e7de");
  scene.fog = new THREE.Fog("#e9e7de", 28, 65);
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
  let parameters = { ...initial };
  let theta = .75, phi = 1.02, distance = 24, targetDistance = 24;
  let isVisible = false, disposed = false, frame = 0, lastTime = 0;
  let dragging = false, pointerX = 0, pointerY = 0, needsRender = true;
  let separation = initial.exploded / 100;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const stone = new THREE.MeshStandardMaterial({ color: "#d8c7a8", roughness: .92 });
  const concrete = new THREE.MeshStandardMaterial({ color: "#e5dcc6", roughness: .84 });
  const wood = new THREE.MeshStandardMaterial({ color: "#765139", roughness: .72 });
  const metal = new THREE.MeshStandardMaterial({ color: "#343b32", roughness: .6, metalness: .4 });
  const glass = new THREE.MeshStandardMaterial({ color: "#8daba4", transparent: true, opacity: .33, metalness: .3, roughness: .2, depthWrite: false });
  const green = new THREE.MeshStandardMaterial({ color: "#747e50", roughness: 1, flatShading: true });
  const darkGreen = new THREE.MeshStandardMaterial({ color: "#536443", roughness: 1, flatShading: true });
  const fabric = new THREE.MeshStandardMaterial({ color: "#eee4d0", roughness: 1 });
  const earth = new THREE.MeshStandardMaterial({ color: "#414934", roughness: 1 });
  const water = new THREE.MeshStandardMaterial({ color: "#567e78", roughness: .14, metalness: .42 });
  const model = new THREE.Group(); scene.add(model);
  const upper = new THREE.Group(); upper.position.y = 3.05; model.add(upper);
  const roof = new THREE.Group(); roof.position.y = 5.54; model.add(roof);

  function box(parent: THREE.Object3D, size: number[], at: number[], material: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.position.set(at[0], at[1], at[2]); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function sphere(parent: THREE.Object3D, radius: number, at: number[], material: THREE.Material, scale = [1, 1, 1]) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), material);
    mesh.position.set(at[0], at[1], at[2]); mesh.scale.set(scale[0], scale[1], scale[2]); mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function plant(parent: THREE.Object3D, x: number, y: number, z: number, scale = 1) {
    box(parent, [.1, 1.9 * scale, .1], [x, y + .95 * scale, z], wood);
    sphere(parent, .75 * scale, [x, y + 2.15 * scale, z], green, [1, .78, 1]);
    sphere(parent, .49 * scale, [x - .35 * scale, y + 1.85 * scale, z + .18], darkGreen);
    sphere(parent, .48 * scale, [x + .4 * scale, y + 2.02 * scale, z - .12], green);
  }
  function glazing(parent: THREE.Object3D, x: number, y: number, z: number, width: number, height: number) {
    box(parent, [width, height, .035], [x, y, z], glass);
    for (let i = 0; i <= 4; i++) box(parent, [.045, height, .065], [x - width / 2 + width * i / 4, y, z], metal);
    box(parent, [width, .045, .065], [x, y + height / 2, z], metal);
    box(parent, [width, .045, .065], [x, y - height / 2, z], metal);
  }

  // An original, buildable-looking concept maquette made entirely from local geometry.
  box(model, [13.6, .32, 10.3], [0, -.02, 0], concrete);
  box(model, [9.8, .22, 5.65], [0, .3, -.8], stone);
  box(model, [8, .18, 4.6], [0, .51, -1.15], concrete);
  box(model, [8, 2.45, .2], [0, 1.8, -3.35], stone);
  box(model, [.22, 2.45, 4.6], [-3.9, 1.8, -1.15], stone);
  box(model, [2.1, 2.45, .2], [-2.75, 1.8, 1.02], stone);
  box(model, [.18, 2.45, 4.2], [3.9, 1.8, -1.15], glass);
  glazing(model, 1.1, 1.8, 1.08, 5.6, 2.44);
  for (let i = 0; i < 5; i++) box(model, [.055, 2.46, .055], [3.92, 1.8, -3.25 + i * 1.06], metal);
  box(model, [1.7, .36, .78], [.4, .88, -.7], fabric);
  box(model, [1.7, .49, .18], [.4, 1.08, -1.04], fabric);
  box(model, [.76, .19, .62], [.4, .75, .22], wood);
  box(model, [.52, .44, .6], [2, .91, -.35], wood);
  box(model, [.43, .1, .52], [2, 1.13, -.35], fabric);
  box(model, [2.3, 1.02, .68], [-1.7, 1.1, -2.7], wood);
  box(model, [2.36, .08, .74], [-1.7, 1.63, -2.7], concrete);

  box(upper, [9.3, .23, 5.6], [.45, .03, -.65], concrete);
  box(upper, [6.55, .1, 4.1], [.9, .18, -1.18], wood);
  box(upper, [6.55, 2.12, .21], [.9, 1.23, -3.15], stone);
  box(upper, [.2, 2.12, 4.1], [-2.3, 1.23, -1.18], stone);
  box(upper, [.19, 2.12, 4.1], [4.08, 1.23, -1.18], stone);
  glazing(upper, .9, 1.23, .84, 6.35, 2.1);
  for (let i = 0; i < 15; i++) box(upper, [.074, 2.25, .18], [1.55 + i * .175, 1.27, 1.12], wood);
  box(upper, [1.7, .23, 1.8], [-.7, .4, -1.15], wood);
  box(upper, [1.64, .19, 1.75], [-.7, .6, -1.15], fabric);
  box(upper, [8.9, .63, .035], [.45, .48, 2.08], glass);
  for (const x of [-4, -1, 2, 4.88]) box(upper, [.045, .8, .045], [x, .57, 2.08], metal);
  box(upper, [8.9, .04, .04], [.45, .98, 2.08], metal);
  box(upper, [1.15, .43, 3.5], [-3.38, .36, -.25], stone);
  for (let i = 0; i < 8; i++) sphere(upper, .27, [-3.4, .71, -1.65 + i * .42], i % 2 ? green : darkGreen, [1, .9, 1]);

  box(roof, [7.25, .23, 4.85], [.9, 0, -1.15], concrete);
  box(roof, [6.8, .08, 4.4], [.9, .15, -1.15], stone);
  for (const [x, z, w, d] of [[.9, -3.55, 7.25, .1], [.9, 1.23, 7.25, .1], [-2.67, -1.15, .1, 4.85], [4.47, -1.15, .1, 4.85]]) box(roof, [w, .22, d], [x, .15, z], concrete);

  // Terrace, pool, stepping stones and planted edges give the model a human scale.
  box(model, [7.8, .2, 2.1], [.8, .21, 3.05], stone);
  box(model, [6.75, .05, 1.38], [1, .33, 3.12], water);
  for (let i = 0; i < 6; i++) box(model, [.58, .06, .71], [-5.32 + i * .83, .21, 4.34], concrete);
  for (let i = 0; i < 4; i++) box(model, [2.3, .12 * (i + 1), .42], [-2.6, .08 + .06 * i, 1.82 - i * .39], concrete);
  box(model, [1.6, .2, 6.7], [-5.6, .18, -.45], earth);
  box(model, [1.1, .2, 8.6], [5.98, .18, -.25], earth);
  plant(model, -5.55, .28, -2.35, 1.25); plant(model, -5.4, .28, 1.9, .85); plant(model, 5.88, .28, -2, 1.13);
  for (let i = 0; i < 15; i++) sphere(model, .25 + (i % 3) * .08, [5.98, .5, -4 + i * .53], i % 2 ? green : darkGreen, [.9, .75, 1]);
  for (let i = 0; i < 8; i++) sphere(model, .29, [-5.7, .5, -4.3 + i * .49], darkGreen);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: "#e9e7de", roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.2; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(55, 55, "#c8cabc", "#d4d5c9"); grid.position.y = -.19; scene.add(grid);
  scene.add(new THREE.HemisphereLight("#fff8e7", "#a3aa96", 3));
  const sun = new THREE.DirectionalLight("#fff0d7", 4.2); sun.position.set(-8, 15, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(1536, 1536); sun.shadow.camera.left = -12; sun.shadow.camera.right = 12; sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12; sun.shadow.normalBias = .035; sun.shadow.bias = -.0002; sun.shadow.radius = 4; scene.add(sun);
  const fill = new THREE.DirectionalLight("#dce9ee", 1.4); fill.position.set(10, 6, -8); scene.add(fill);

  function draw(time: number) {
    frame = 0;
    if (disposed || !isVisible || document.hidden) return;
    const dt = Math.min((time - lastTime) / 1000 || .016, .05); lastTime = time;
    const target = parameters.exploded / 100;
    const moving = Math.abs(separation - target) > .001 || Math.abs(distance - targetDistance) > .01;
    separation = reduced.matches ? target : THREE.MathUtils.damp(separation, target, 5, dt);
    distance = reduced.matches ? targetDistance : THREE.MathUtils.damp(distance, targetDistance, 6, dt);
    upper.position.y = 3.05 + separation * 2;
    roof.position.y = 5.54 + separation * 4.1;
    const rotate = parameters.rotating && !reduced.matches && !dragging;
    if (rotate) theta += dt * .075;
    const centerY = 1.6 + separation * 1.5;
    const responsiveDistance = distance * (camera.aspect < 1 ? 1.35 : 1);
    camera.position.set(Math.sin(theta) * responsiveDistance * Math.sin(phi), centerY + responsiveDistance * Math.cos(phi), Math.cos(theta) * responsiveDistance * Math.sin(phi));
    camera.lookAt(0, centerY, 0);
    if (rotate || moving || needsRender) {
      renderer.render(scene, camera);
      canvas.dataset.rotation = theta.toFixed(3);
      canvas.dataset.separation = separation.toFixed(2);
      canvas.dataset.finish = parameters.finish;
      needsRender = false;
    }
    if (rotate || moving) frame = requestAnimationFrame(draw);
  }
  function schedule() { needsRender = true; if (!frame && !disposed && isVisible && !document.hidden) frame = requestAnimationFrame(draw); }
  const resize = new ResizeObserver(() => {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); schedule();
  }); resize.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; if (isVisible) { lastTime = performance.now(); schedule(); } else { cancelAnimationFrame(frame); frame = 0; } }); observer.observe(canvas);
  const visibility = () => { if (!document.hidden) { lastTime = performance.now(); schedule(); } else { cancelAnimationFrame(frame); frame = 0; } };
  document.addEventListener("visibilitychange", visibility);
  const pointerDown = (event: PointerEvent) => { dragging = true; pointerX = event.clientX; pointerY = event.clientY; canvas.setPointerCapture(event.pointerId); canvas.focus({ preventScroll: true }); };
  const pointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    theta -= (event.clientX - pointerX) * .008;
    if (event.pointerType !== "touch") phi = THREE.MathUtils.clamp(phi + (event.clientY - pointerY) * .006, .48, 1.42);
    pointerX = event.clientX; pointerY = event.clientY; schedule();
  };
  const pointerUp = () => { dragging = false; schedule(); };
  const keydown = (event: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") theta -= .15;
    if (event.key === "ArrowRight") theta += .15;
    if (event.key === "ArrowUp") phi = Math.max(.48, phi - .1);
    if (event.key === "ArrowDown") phi = Math.min(1.42, phi + .1);
    if (event.key === "+") targetDistance = Math.max(17, targetDistance - 2);
    if (event.key === "-") targetDistance = Math.min(34, targetDistance + 2);
    if (event.key === "Home") { theta = .75; phi = 1.02; targetDistance = 24; }
    schedule();
  };
  const contextLost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); frame = 0; onUnavailable(); };
  const motionChange = () => schedule(); reduced.addEventListener("change", motionChange);
  canvas.addEventListener("pointerdown", pointerDown); canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp); canvas.addEventListener("pointercancel", pointerUp);
  canvas.addEventListener("lostpointercapture", pointerUp); canvas.addEventListener("keydown", keydown);
  canvas.addEventListener("webglcontextlost", contextLost);

  const update = (next: SceneParameters) => {
    parameters = { ...next };
    stone.color.set({ arena: "#d8c7a8", oliva: "#879073", terracota: "#b87551" }[parameters.finish]);
    schedule();
  };
  update(initial);

  return {
    update,
    reset: () => { theta = .75; phi = 1.02; targetDistance = 24; schedule(); },
    zoom: direction => { targetDistance = THREE.MathUtils.clamp(targetDistance - direction * 2, 17, 34); schedule(); },
    dispose: () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", motionChange);
      canvas.removeEventListener("pointerdown", pointerDown); canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp); canvas.removeEventListener("pointercancel", pointerUp);
      canvas.removeEventListener("lostpointercapture", pointerUp); canvas.removeEventListener("keydown", keydown); canvas.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) { geometries.add(object.geometry); for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material); } });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); renderer.dispose();
    },
  };
}
