/* PYXON 3D: a royal-blue silk ribbon that threads through the site, and a porcelain globe. */
import * as THREE from 'three';
import { RoomEnvironment } from '../lib/RoomEnvironment.js';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROYAL = new THREE.Color('#1B4FAE');
const SHEEN = new THREE.Color('#7FA8FF');

function silk(extra = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: ROYAL, roughness: .34, metalness: 0, sheen: 1, sheenRoughness: .32, sheenColor: SHEEN,
    clearcoat: .35, clearcoatRoughness: .4, side: THREE.DoubleSide, ...extra
  });
}

/* Ribbon strip geometry along a function center(t) with twist(t). */
class Ribbon {
  constructor(segs = 360, width = .5) {
    this.segs = segs; this.width = width;
    const g = new THREE.BufferGeometry();
    this.pos = new Float32Array((segs + 1) * 2 * 3);
    const uv = new Float32Array((segs + 1) * 2 * 2), idx = [];
    for (let i = 0; i <= segs; i++) {
      uv.set([i / segs, 0, i / segs, 1], i * 4);
      if (i < segs) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setIndex(idx);
    this.geo = g;
    this._c = new THREE.Vector3(); this._n = new THREE.Vector3(); this._tan = new THREE.Vector3(); this._side = new THREE.Vector3(); this._up = new THREE.Vector3(0, 1, 0);
  }
  update(center, twist, widthFn) {
    const { segs, pos } = this; const prev = new THREE.Vector3(); const next = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      center(Math.max(0, t - .002), prev); center(Math.min(1, t + .002), next); center(t, this._c);
      this._tan.subVectors(next, prev).normalize();
      this._side.crossVectors(this._tan, this._up).normalize();
      const n = this._n.crossVectors(this._side, this._tan).normalize();
      const a = twist(t);
      const s = this._side.multiplyScalar(Math.cos(a)).addScaledVector(n, Math.sin(a));
      const w = (widthFn ? widthFn(t) : 1) * this.width * .5;
      pos[i * 6] = this._c.x - s.x * w; pos[i * 6 + 1] = this._c.y - s.y * w; pos[i * 6 + 2] = this._c.z - s.z * w;
      pos[i * 6 + 3] = this._c.x + s.x * w; pos[i * 6 + 4] = this._c.y + s.y * w; pos[i * 6 + 5] = this._c.z + s.z * w;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  return r;
}
function envFor(renderer, scene) {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  pm.dispose();
}

/* ================= Site ribbon ================= */
(function siteRibbon() {
  const canvas = document.getElementById('ribbon');
  let renderer;
  try { renderer = makeRenderer(canvas); } catch (e) { return; }
  const scene = new THREE.Scene();
  envFor(renderer, scene);
  const cam = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, .1, 100);
  cam.position.set(0, 0, 10);
  const key = new THREE.DirectionalLight('#FFF1DC', 2.2); key.position.set(-4, 6, 6); scene.add(key);
  const fill = new THREE.DirectionalLight('#CFE0FF', .8); fill.position.set(5, -2, 4); scene.add(fill);
  const rib = new Ribbon(420, innerWidth < 700 ? .38 : .62);
  const mesh = new THREE.Mesh(rib.geo, silk());
  scene.add(mesh);
  const thin = new Ribbon(300, .05);
  const thinMesh = new THREE.Mesh(thin.geo, new THREE.MeshPhysicalMaterial({ color: '#0E6FD6', roughness: .4, sheen: 1, sheenColor: '#9FD8FF', side: THREE.DoubleSide, transparent: true, opacity: .7 }));
  scene.add(thinMesh);

  let scroll = 0, vel = 0, sm = 0, mx = 0, my = 0, visible = 0, target = 0, time = 0, W = innerWidth, H = innerHeight;
  const resize = () => { W = innerWidth; H = innerHeight; renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); };
  resize(); addEventListener('resize', resize);
  addEventListener('pointermove', e => { mx = e.clientX / W - .5; my = e.clientY / H - .5; });
  addEventListener('pyx:scroll', e => { scroll = e.detail.y; vel = e.detail.v || 0; });
  let zones = [];
  addEventListener('pyx:page', () => { zones = [...document.querySelectorAll('[data-ribbon]')]; });
  const zoneTarget = () => { let best = 0; const mid = H * .5; for (const z of zones) { const r = z.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) continue; const c = (r.top + r.bottom) / 2; const inside = r.top <= mid && r.bottom >= mid; const d = inside ? Math.max(0, (Math.abs(c - mid) - r.height * .3) / (H * .5)) : 1 + Math.min(r.top - mid, mid - r.bottom) / H; best = Math.max(best, inside ? 1 - Math.min(1, d) : 0);  } return Math.min(1, best * 1.4); };

  const halfW = () => Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z * cam.aspect;
  const center = (t, out) => {
    const hw = halfW() * 1.35, ph = sm * .0012 + time * .18;
    const x = -hw + t * hw * 2;
    const y = Math.sin(t * 5.2 + ph) * .9 + Math.sin(t * 11.0 - ph * 1.3) * .22 + (my * -.6);
    const z = Math.cos(t * 4.1 + ph * .8) * 1.2 - .8;
    return out.set(x, y + Math.sin(ph * .5) * .3, z);
  };
  const twist = t => Math.sin(t * 6.0 + sm * .0018 + time * .3) * 1.1 + t * 2.4 + mx * .8;
  const centerThin = (t, out) => { center(t, out); out.y += Math.sin(t * 17 + time) * .18 - .35; out.z += .4; return out; };

  function frame() {
    requestAnimationFrame(frame);
    target = zoneTarget();
    visible += (target - visible) * .08;
    canvas.style.opacity = visible.toFixed(3);
    if (visible < .01) return;
    time += REDUCE ? 0 : .006 + Math.min(.04, Math.abs(vel) * .0006);
    sm += (scroll - sm) * .08;
    rib.update(center, twist, t => .75 + .25 * Math.sin(t * Math.PI));
    thin.update(centerThin, t => t * 8 + time);
    mesh.rotation.x = my * .15; mesh.rotation.y = mx * .2;
    thinMesh.rotation.copy(mesh.rotation);
    renderer.render(scene, cam);
  }
  frame();
})();

/* ================= Globe ================= */
let globeCtl = null;
function latLon(lat, lon, r = 1) {
  const phi = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}
function mountGlobe(box) {
  const D = window.PYX;
  const canvas = document.createElement('canvas'); box.prepend(canvas);
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene(); envFor(renderer, scene);
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 50); cam.position.set(0, .15, 4.6);
  scene.add(new THREE.AmbientLight('#ffffff', .35));
  const key = new THREE.DirectionalLight('#FFF3E2', 2.3); key.position.set(-3, 3, 4); scene.add(key);
  const rim = new THREE.DirectionalLight('#BBD3FF', 1.4); rim.position.set(4, 1, -3); scene.add(rim);

  const world = new THREE.Group(); scene.add(world);
  // porcelain sphere
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), new THREE.MeshPhysicalMaterial({ color: '#F8F4EE', roughness: .55, clearcoat: .6, clearcoatRoughness: .35, sheen: .4, sheenColor: '#ffffff' }));
  world.add(sphere);
  // atmosphere rim
  const atm = new THREE.Mesh(new THREE.SphereGeometry(1.12, 64, 64), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false,
    uniforms: { c: { value: new THREE.Color('#5B8BE0') } },
    vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vec4 p=modelViewMatrix*vec4(position,1.); vP=p.xyz; gl_Position=projectionMatrix*p; }',
    fragmentShader: 'uniform vec3 c; varying vec3 vN; varying vec3 vP; void main(){ float f=pow(1.-abs(dot(normalize(-vP),vN)),3.2); gl_FragColor=vec4(c, f*.55); }'
  }));
  scene.add(atm);
  // land dots
  const raw = atob(window.PYX_LAND || ''); const n = raw.length / 4;
  const dv = new DataView(new Uint8Array([...raw].map(ch => ch.charCodeAt(0))).buffer);
  const dot = new THREE.CircleGeometry(.0068, 6);
  const inst = new THREE.InstancedMesh(dot, new THREE.MeshBasicMaterial({ color: '#1F55B5', transparent: true, opacity: .78 }), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), z = new THREE.Vector3(0, 0, 1), sc = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < n; i++) {
    const lat = dv.getInt16(i * 4, true) / 10, lon = dv.getInt16(i * 4 + 2, true) / 10;
    const p = latLon(lat, lon, 1.002); q.setFromUnitVectors(z, p.clone().normalize());
    m4.compose(p, q, sc); inst.setMatrixAt(i, m4);
  }
  world.add(inst);

  // arcs
  const arcMat = (color, speed, op) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { t: { value: 0 }, c: { value: new THREE.Color(color) }, s: { value: speed }, o: { value: op } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float t; uniform vec3 c; uniform float s; uniform float o; varying vec2 vUv; void main(){ float d=fract(vUv.x*1.0 - t*s); float pulse=smoothstep(.0,.2,d)*smoothstep(.45,.2,d); float base=.18; gl_FragColor=vec4(c, (base+pulse*.95)*o*smoothstep(0.,.04,vUv.x)*smoothstep(1.,.96,vUv.x)); }'
  });
  const arcs = [];
  const addArc = (a, b, color, r = .006, speed = .4, op = 1) => {
    const p1 = latLon(a.lat, a.lon, 1.003), p2 = latLon(b.lat, b.lon, 1.003);
    const dist = p1.distanceTo(p2); const mid = p1.clone().add(p2).multiplyScalar(.5).normalize().multiplyScalar(1 + dist * .42);
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const mat = arcMat(color, speed, op); mat.uniforms.t.value = Math.random() * 3;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, r, 6, false), mat);
    world.add(tube); arcs.push(mat);
  };
  /* a woven network: every city joins its nearest major city, and the major cities join in a ring around the world */
  const PRI = ['London', 'New York', 'Dubai', 'Riyadh', 'Cairo', 'Amman', 'Singapore', 'Hong Kong', 'Bangalore', 'Casablanca', 'Rabat', 'Texas', 'Paris', 'Tokyo', 'Beijing', 'Berlin', 'Washington, D.C.', 'Sydney', 'São Paulo', 'Johannesburg'];
  const C = D.cities, majors = C.filter(c => c.major);
  const gdist = (a, b) => latLon(a.lat, a.lon, 1).distanceTo(latLon(b.lat, b.lon, 1));
  C.filter(c => !c.major).forEach((c, i) => {
    const m = majors.reduce((best, x) => gdist(c, x) < gdist(c, best) ? x : best, majors[0]);
    addArc(m, c, '#1B4FAE', .0034, .25 + (i % 5) * .05, .7);
  });
  const ring = [...majors].sort((a, b) => a.lon - b.lon);
  ring.forEach((c, i) => addArc(c, ring[(i + 1) % ring.length], i % 3 ? '#1B4FAE' : '#00B4D8', i % 3 ? .0045 : .0065, .35 + (i % 4) * .05, .9));
  [['London', 'New York'], ['London', 'Dubai'], ['Dubai', 'Singapore'], ['Amman', 'Bangalore'], ['Cairo', 'Johannesburg'], ['New York', 'São Paulo'], ['Singapore', 'Sydney'], ['Riyadh', 'Hong Kong']].forEach(([a, b], i) => {
    const A = C.find(x => x.city === a), B = C.find(x => x.city === b); if (A && B) addArc(A, B, '#00B4D8', .006, .4 + i * .03, .85);
  });

  // markers
  const pulses = [];
  const marker = (c, office) => {
    const p = latLon(c.lat, c.lon, 1.004);
    const s = new THREE.Mesh(new THREE.SphereGeometry(office ? .015 : .008, 16, 16), new THREE.MeshBasicMaterial({ color: office ? '#00C6E0' : '#1B4FAE' }));
    s.position.copy(p); world.add(s);
    if (office) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(.022, .027, 48), new THREE.MeshBasicMaterial({ color: '#00C6E0', transparent: true, side: THREE.DoubleSide }));
      ring.position.copy(p); ring.lookAt(p.clone().multiplyScalar(2)); world.add(ring); pulses.push(ring);
    }
    return p;
  };
  // silk ribbon orbit around the globe
  const orbit = new Ribbon(360, .085);
  const orbitMesh = new THREE.Mesh(orbit.geo, silk({ roughness: .3 }));
  scene.add(orbitMesh);

  // labels
  const lab = box.querySelector('#glabels'); lab.innerHTML = '';
  const labels = [];
  const addLabel = (c, cls, html) => { const el = document.createElement('div'); el.className = 'glabel ' + cls; el.innerHTML = html; lab.appendChild(el); labels.push({ el, rank: (i => i < 0 ? 99 : i)(PRI.indexOf(c.city)) + (cls.includes('major') ? 0 : 200), major: cls.includes('major') ? 1 : 0, p: marker(c, cls.includes('major')), dx: cls.endsWith(' l') ? '-100%' : cls.endsWith(' r') ? '0%' : '-50%' }); };
  C.forEach(c => addLabel(c, c.major ? 'city major' : 'reach', `<div class="pin"><i></i>${c.city}</div>`));

  // orientation: Europe, Africa and Asia in view, tilted
  world.rotation.set(.38, -2.3, 0);
  let rotY = world.rotation.y, velY = REDUCE ? 0 : .0007, drag = false, lx = 0, rotX = .38;
  canvas.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - lx; lx = e.clientX; rotY += dx * .006; velY = dx * .0004; });
  canvas.addEventListener('pointerup', () => { drag = false; });

  let W = 0, H = 0, run = false, t = 0, intro = 0, last = performance.now();
  const resize = () => { W = box.clientWidth; H = box.clientHeight; renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); };
  resize(); const ro = new ResizeObserver(resize); ro.observe(box);
  const io = new IntersectionObserver(([en]) => { run = en.isIntersecting; if (run) loop(); }); io.observe(box);
  const v = new THREE.Vector3(), camDir = new THREE.Vector3();
  function loop() {
    if (!run) return; requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now; t += dt; intro = Math.min(1, intro + dt / 2.2);
    if (!drag) { rotY += velY; velY += ((REDUCE ? 0 : .0007) - velY) * .02; rotY += Math.sin(t * .15) * .0004; }
    world.rotation.y = rotY; world.rotation.x = rotX;
    const e = 1 - Math.pow(1 - intro, 3);
    cam.position.z = 6.2 - e * 1.6;
    arcs.forEach(m => { m.uniforms.t.value += dt * .6; });
    pulses.forEach((r, i) => { const k = (t * .8 + i * .5) % 1; r.scale.setScalar(1 + k * 2.2); r.material.opacity = 1 - k; });
    orbit.update((u, out) => { const a = u * Math.PI * 2; const R = 1.22 + Math.sin(a * 3 + t * .6) * .04; out.set(Math.cos(a) * R, Math.sin(a * 2 + t * .4) * .1 + Math.sin(a) * .25, Math.sin(a) * R); return out; }, u => u * Math.PI * 4 + t * .5);
    orbitMesh.rotation.set(.45, t * .05, -.25);
    renderer.render(scene, cam);
    cam.getWorldDirection(camDir);
    /* place labels: major cities first, then by how directly they face us; skip any that would overlap */
    const placed = [], items = labels.map(L => {
      v.copy(L.p).applyMatrix4(world.matrixWorld);
      const facing = v.clone().normalize().dot(cam.position.clone().normalize());
      const sp = v.project(cam);
      return { L, facing, x: (sp.x * .5 + .5) * W, y: (-sp.y * .5 + .5) * H };
    }).sort((a, b) => (a.L.rank - b.L.rank) || (b.facing - a.facing));
    items.forEach(({ L, facing, x, y }) => {
      const th = L.major ? .28 : .55;
      let op = facing > th ? Math.min(1, (facing - th) * 5) * e : 0;
      const w = (L.w || (L.w = L.el.offsetWidth || 80)) + 4, h = 24;
      const cand = [[x - w / 2, y - h * 1.45, '-50%', '-140%'], [x + 8, y - h / 2, '8px', '-50%'], [x - w - 8, y - h / 2, 'calc(-100% - 8px)', '-50%'], [x - w / 2, y + 8, '-50%', '35%']];
      let pick = cand[0];
      if (op > 0) {
        pick = cand.find(([cx, cy]) => !placed.some(q => cx < q.x + q.w && cx + w > q.x && cy < q.y + q.h && cy + h > q.y));
        if (!pick) { op = 0; pick = cand[0]; }
      }
      if (op > .05) placed.push({ x: pick[0], y: pick[1], w, h });
      L.el.style.transform = `translate(${x}px,${y}px) translate(${pick[2]},${pick[3]})`;
      L.el.style.opacity = op;
    });
  }
  return { destroy() { run = false; io.disconnect(); ro.disconnect(); renderer.dispose(); canvas.remove(); } };
}
function pageMounted() {
  if (globeCtl) { globeCtl.destroy(); globeCtl = null; }
  const box = document.getElementById('globeBox');
  if (box) { try { globeCtl = mountGlobe(box); } catch (e) { console.warn('globe', e); } }
}
addEventListener('pyx:page', pageMounted);
if (document.getElementById('globeBox')) pageMounted();
