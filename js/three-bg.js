(function () {
  'use strict';

  /* ─── THREE.JS BACKGROUND SCENE ─── */
  const canvas   = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // Particles
  const pN = 1800, pos = new Float32Array(pN * 3);
  for (let i = 0; i < pN; i++) {
    pos[i*3]   = (Math.random()-.5)*18;
    pos[i*3+1] = (Math.random()-.5)*18;
    pos[i*3+2] = (Math.random()-.5)*12;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color:0x4fffb0, size:0.035, opacity:0.45, transparent:true, sizeAttenuation:true
  }));
  scene.add(particles);

  // Icosahedron
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6,1),
    new THREE.MeshBasicMaterial({color:0x4fffb0, wireframe:true, transparent:true, opacity:0.08})
  );
  ico.position.set(3.5,-0.5,-1);
  scene.add(ico);

  // Torus knot
  const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7,0.18,100,16),
    new THREE.MeshBasicMaterial({color:0x7b5ea7, wireframe:true, transparent:true, opacity:0.12})
  );
  torus.position.set(-4,2,-2);
  scene.add(torus);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX/window.innerWidth)*2-1;
    my = (e.clientY/window.innerHeight)*2-1;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  (function animate() {
    requestAnimationFrame(animate);
    const t = performance.now()*.001;
    particles.rotation.y = t*.025;
    particles.rotation.x = t*.01;
    ico.rotation.x = t*.18; ico.rotation.y = t*.22;
    torus.rotation.x = t*.15; torus.rotation.z = t*.1;
    camera.position.x += (mx*.4 - camera.position.x)*.04;
    camera.position.y += (-my*.3 - camera.position.y)*.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();

})();
