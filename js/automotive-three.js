/**
 * Advanced Automotive Three.js 3D Cyber-Highway Simulation
 * High frame rate, dynamic neon lighting, 3D sports car, speed warp particles
 */

(function () {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0f19, 0.015);

  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 4.5, 18);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Group for moving road objects
  const roadWorld = new THREE.Group();
  scene.add(roadWorld);

  // 1. TERRAIN / WIREFRAME CYBER GRID
  const gridWidth = 180;
  const gridLength = 400;
  const gridSegsX = 36;
  const gridSegsY = 80;
  const gridGeometry = new THREE.PlaneGeometry(gridWidth, gridLength, 24, 48);

  const posAttr = gridGeometry.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    // Center road is flat; sides have rolling futuristic hills
    if (Math.abs(x) > 12) {
      const distFromRoad = Math.abs(x) - 12;
      const elevation = (Math.sin(posAttr.getY(i) * 0.05) * 4) + (distFromRoad * 0.15) + (Math.random() * 0.8);
      posAttr.setZ(i, elevation);
    }
  }
  gridGeometry.computeVertexNormals();

  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x1d4ed8,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
  });

  const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
  gridMesh.rotation.x = -Math.PI / 2;
  gridMesh.position.y = -3;
  roadWorld.add(gridMesh);

  // 2. NEON ROAD LANE LINES
  const laneMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.75,
  });
  const centerDashes = [];
  const dashCount = 24;
  for (let i = 0; i < dashCount; i++) {
    const dashGeom = new THREE.PlaneGeometry(0.35, 6);
    const dash = new THREE.Mesh(dashGeom, laneMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, -2.9, -180 + (i * 18));
    roadWorld.add(dash);
    centerDashes.push(dash);
  }

  // Dual outer neon glow curbs
  const curbMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.5,
  });
  [-9, 9].forEach(xPos => {
    const curbGeom = new THREE.PlaneGeometry(0.5, 400);
    const curb = new THREE.Mesh(curbGeom, curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.position.set(xPos, -2.92, 0);
    roadWorld.add(curb);
  });

  // 3. OVERHEAD NEON SPEED ARCHES / GANTRIES
  const archGroup = new THREE.Group();
  scene.add(archGroup);
  const arches = [];
  const archCount = 8;

  for (let i = 0; i < archCount; i++) {
    const archGeom = new THREE.BufferGeometry();
    const w = 24, h = 9;
    const points = [
      new THREE.Vector3(-w/2, -3, 0),
      new THREE.Vector3(-w/2, h, 0),
      new THREE.Vector3(w/2, h, 0),
      new THREE.Vector3(w/2, -3, 0)
    ];
    archGeom.setFromPoints(points);
    const archMat = new THREE.LineBasicMaterial({
      color: (i % 2 === 0) ? 0x38bdf8 : 0xf43f5e,
      linewidth: 2,
      transparent: true,
      opacity: 0.4
    });
    const archLine = new THREE.Line(archGeom, archMat);
    archLine.position.z = -160 + (i * 45);
    archGroup.add(archLine);
    arches.push(archLine);
  }

  // 4. 3D WIREFRAME SPORTS CAR (Ahead of camera)
  const carGroup = new THREE.Group();
  
  // Sleek Aerodynamic Body
  const carBodyGeom = new THREE.BoxGeometry(2.4, 0.7, 5.2);
  const carBodyMat = new THREE.MeshBasicMaterial({
    color: 0x0284c7,
    wireframe: true,
    transparent: true,
    opacity: 0.55
  });
  const carBody = new THREE.Mesh(carBodyGeom, carBodyMat);
  carBody.position.y = 0.5;
  carGroup.add(carBody);

  // Cabin / Windshield
  const cabinGeom = new THREE.BoxGeometry(1.8, 0.6, 2.6);
  const cabinMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.7
  });
  const cabin = new THREE.Mesh(cabinGeom, cabinMat);
  cabin.position.set(0, 1.1, -0.3);
  carGroup.add(cabin);

  // Taillights (Neon Red Beams)
  const tailLightGeom = new THREE.PlaneGeometry(0.8, 0.15);
  const tailLightMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    side: THREE.DoubleSide
  });
  [-0.9, 0.9].forEach(x => {
    const tl = new THREE.Mesh(tailLightGeom, tailLightMat);
    tl.position.set(x, 0.5, 2.62);
    carGroup.add(tl);
  });

  // Dual Neon Light Exhaust Trails
  const trailMat = new THREE.MeshBasicMaterial({
    color: 0xf43f5e,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  const trailLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 12), trailMat);
  trailLeft.rotation.x = -Math.PI / 2;
  trailLeft.position.set(-0.9, -2.85, 8.6);
  scene.add(trailLeft);

  const trailRight = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 12), trailMat);
  trailRight.rotation.x = -Math.PI / 2;
  trailRight.position.set(0.9, -2.85, 8.6);
  scene.add(trailRight);

  carGroup.position.set(0, -2.8, 4);
  scene.add(carGroup);

  // 5. HIGH-SPEED WARP PARTICLES
  const particleCount = 180;
  const particleGeom = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSpeeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 80;
    particlePositions[i * 3 + 1] = (Math.random() * 15) - 2;
    particlePositions[i * 3 + 2] = -Math.random() * 250;
    particleSpeeds[i] = 40 + Math.random() * 60;
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.8,
    transparent: true,
    opacity: 0.65
  });
  const particleSystem = new THREE.Points(particleGeom, particleMat);
  scene.add(particleSystem);

  // State & Interactivity
  let mouseX = 0, mouseY = 0;
  let targetCamX = 0, targetCamY = 4.5;
  let baseSpeed = 45;
  let currentSpeed = baseSpeed;
  let isBoosted = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Accelerate on scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    currentSpeed = baseSpeed * 1.8;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      currentSpeed = baseSpeed;
    }, 200);
  }, { passive: true });

  // Public Boost Control
  window.setAutomotiveSpeedBoost = function (boostActive) {
    isBoosted = boostActive;
    currentSpeed = boostActive ? 95 : baseSpeed;
    camera.fov = boostActive ? 75 : 65;
    camera.updateProjectionMatrix();
  };

  // Clock & Render Loop with Performance Tab-Pausing and IntersectionObserver
  const clock = new THREE.Clock();
  let isSceneActive = true;
  let isIntersecting = true;

  document.addEventListener('visibilitychange', () => {
    isSceneActive = !document.hidden;
    if (isSceneActive && isIntersecting) {
      clock.getDelta(); // flush delta
      requestAnimationFrame(animate);
    }
  });

  // Pause Three.js render loop when hero is scrolled out of view to save GPU/CPU
  if ('IntersectionObserver' in window && container) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasRunning = isSceneActive && isIntersecting;
        isIntersecting = entry.isIntersecting;
        if (isSceneActive && isIntersecting && !wasRunning) {
          clock.getDelta();
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(container);
  }

  function animate() {
    if (!isSceneActive || !isIntersecting) return;
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.1);
    const effectiveSpeed = (isBoosted ? 95 : currentSpeed);

    // 1. Move Center Dashes
    centerDashes.forEach(dash => {
      dash.position.z += effectiveSpeed * delta;
      if (dash.position.z > 20) {
        dash.position.z = -180;
      }
    });

    // 2. Move Overhead Arches
    arches.forEach(arch => {
      arch.position.z += effectiveSpeed * delta * 0.9;
      if (arch.position.z > 25) {
        arch.position.z = -160;
      }
    });

    // 3. Move Warp Particles
    const pPositions = particleGeom.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3 + 2] += (particleSpeeds[i] + (isBoosted ? 50 : 0)) * delta;
      if (pPositions[i * 3 + 2] > 20) {
        pPositions[i * 3 + 2] = -220;
        pPositions[i * 3] = (Math.random() - 0.5) * 80;
      }
    }
    particleGeom.attributes.position.needsUpdate = true;

    // 4. Smooth Car Steering & Banking
    const targetCarX = mouseX * 7;
    carGroup.position.x += (targetCarX - carGroup.position.x) * 0.08;
    carGroup.rotation.y = (carGroup.position.x - targetCarX) * -0.04;
    carGroup.rotation.z = (carGroup.position.x - targetCarX) * 0.06; // Roll into turn

    // Update light trail positions behind car
    trailLeft.position.x = carGroup.position.x - 0.9;
    trailRight.position.x = carGroup.position.x + 0.9;

    // 5. Smooth Camera Movement
    targetCamX = mouseX * 5;
    targetCamY = 4.5 + (-mouseY * 2.5);
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.rotation.z = -camera.position.x * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  });
})();
