/* PYXON deployment gap: one living drawing that changes with each problem.
   Dots travel between scenes as the visitor scrolls; each scene illustrates its text directly.
   Scenes: 0 doors, 1 silos, 2 tangled connectors, 3 models rebuilt from scratch,
   4 language and culture, 5 talent time and cost, 6 hardware and energy, 7 woven into PYXON-Eye. */
(function () {
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = t => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const INK = '20,71,153', CY = '0,198,224', OAK = '186,140,84', GREY = '140,150,170';
  const FONT = '"Myriad Variable Concept", Arial, sans-serif';

  // seeded random so every visitor sees the same composition
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ---------- geometry helpers: sample N points along shapes ---------- */
  function alongPolys(polys, n, R) {
    const segs = []; let tot = 0;
    polys.forEach(pl => { for (let i = 0; i < pl.length - 1; i++) { const a = pl[i], b = pl[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, l]); tot += l; } });
    const out = [];
    for (let k = 0; k < n; k++) {
      let d = R() * tot, i = 0; while (i < segs.length - 1 && d > segs[i][2]) { d -= segs[i][2]; i++; }
      const [a, b, l] = segs[i], t = l ? d / l : 0; out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), 0]);
    }
    return out;
  }
  const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

  /* ---------- static scene layouts in unit space (x, y in about -1..1) ---------- */
  // 0: corridor of closed doors
  const VP = [0, -0.06];
  function wallScale(x) { return (x - VP[0]) / (-1.05 - VP[0]); }
  function door(xa, xb, side) {
    const sa = wallScale(-Math.abs(xa)), sb = wallScale(-Math.abs(xb));
    const fl = s => VP[1] + .92 * s, tp = s => VP[1] - .5 * s, f = side;
    return [[f * xa, fl(sa)], [f * xa, tp(sa)], [f * xb, tp(sb)], [f * xb, fl(sb)]];
  }
  const DOORS = [[.94, .7], [.6, .45], [.39, .3]].flatMap(([a, b]) => [door(a, b, -1), door(a, b, 1)]);

  // 1 and 2: six silos around an empty centre
  const SILOS = [[-.64, -.46], [0, -.62], [.64, -.46], [-.64, .46], [0, .62], [.64, .46]];
  const SILO_W = .44, SILO_H = .3, SILO_TAG = ['PDF', 'SQL', 'XLS', 'CSV', 'JPG', 'IoT'];
  function siloFill(k, R, tight) {
    const [cx, cy] = SILOS[k], w = SILO_W * (tight ? .8 : 1), h = SILO_H * (tight ? .8 : 1), m = k % 3;
    if (m === 0) { const c = Math.floor(R() * 6), r = Math.floor(R() * 4); return [cx - w / 2 + .05 + c * (w - .1) / 5, cy - h / 2 + .06 + r * (h - .12) / 3]; }
    if (m === 1) { const r = Math.floor(R() * 4), len = [1, .8, .95, .55][r]; return [cx - w / 2 + .05 + R() * (w - .1) * len, cy - h / 2 + .07 + r * (h - .14) / 3]; }
    return [cx + (R() - .5) * (w - .08), cy + (R() - .5) * (h - .08)];
  }
  // tangled connectors between silos (fixed curves)
  const TANGLE = (() => {
    const R = rng(7), out = [];
    const pairs = [[0, 1], [1, 2], [0, 4], [2, 3], [3, 4], [4, 5], [0, 5], [1, 3], [2, 5], [1, 5], [0, 2], [3, 5], [1, 4]];
    pairs.forEach(([a, b]) => {
      const A = SILOS[a], B = SILOS[b], pts = [];
      const c1 = [lerp(A[0], B[0], .3) + (R() - .5) * .9, lerp(A[1], B[1], .3) + (R() - .5) * .9];
      const c2 = [lerp(A[0], B[0], .7) + (R() - .5) * .9, lerp(A[1], B[1], .7) + (R() - .5) * .9];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40, u = 1 - t;
        pts.push([u * u * u * A[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * B[0], u * u * u * A[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * B[1]]);
      }
      out.push({ pts, knot: .3 + R() * .4, ph: R() * TAU });
    });
    return out;
  })();

  // 3: three models, each built from scratch
  const MODELS = [-.62, 0, .62].map(y => ({ y }));
  function cubeEdges(cx, cy, s) {
    const dx = s * .87, dy = s * .5;
    const T = [cx, cy - s], L = [cx - dx, cy - s + dy], Rr = [cx + dx, cy - s + dy], C = [cx, cy - s + 2 * dy];
    const Lb = [L[0], L[1] + s], Rb = [Rr[0], Rr[1] + s], Cb = [C[0], C[1] + s];
    return [[T, L], [T, Rr], [L, C], [Rr, C], [L, Lb], [Rr, Rb], [C, Cb], [Lb, Cb], [Rb, Cb]];
  }

  // 4: globe
  // 5: time and cost
  const SEATS = Array.from({ length: 8 }, (_, i) => [-.7 + i * .2, -.62]);
  // 6: racks
  const RACKS = [3, 5, 7, 9].map((u, i) => ({ x: -.66 + i * .36, units: u }));

  /* ---------- formations: N target points per scene; some depend on time ---------- */
  function buildFormations(N) {
    const F = [];
    // 0 doors
    { const R = rng(11); F[0] = alongPolys(DOORS.map(d => [...d]), N, R); }
    // 1 silos
    { const R = rng(12); F[1] = Array.from({ length: N }, (_, i) => { const p = siloFill(i % 6, R, false); return [p[0], p[1], 0]; }); }
    // 2 tangled: 55% stay in silos, the rest ride the tangled connectors
    { const R = rng(13); F[2] = Array.from({ length: N }, (_, i) => {
        if (i % 20 < 11) { const p = siloFill(i % 6, R, true); return [p[0], p[1], 0]; }
        const c = TANGLE[i % TANGLE.length], t = R(); return [0, 0, 2, c, t];
      }); }
    // 3 models: cube edges and small data blobs
    { const R = rng(14), polys = [];
      MODELS.forEach(m => cubeEdges(0, m.y + .1, .2).forEach(e => polys.push(e)));
      const edgePts = alongPolys(polys, Math.floor(N * .7), R);
      const blob = Array.from({ length: N - edgePts.length }, (_, i) => { const m = MODELS[i % 3], a = R() * TAU, r = Math.sqrt(R()) * .1; return [-.62 + Math.cos(a) * r, m.y + Math.sin(a) * r, 0]; });
      F[3] = edgePts.concat(blob); }
    // 4 globe: fibonacci sphere, projected each frame
    { F[4] = Array.from({ length: N }, (_, i) => { const y = 1 - (i + .5) / N * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996; return [0, 0, 4, [Math.cos(th) * r, y, Math.sin(th) * r]]; }); }
    // 5 time and cost: timeline, cost curve, two filled seats
    { const R = rng(15), out = [];
      for (let i = 0; i < N; i++) {
        const k = i % 10;
        if (k < 3) out.push([-.85 + R() * 1.7, .5, 0]);
        else if (k < 8) { const t = R(); out.push([-.85 + t * 1.7, .38 - (Math.pow(t, 2.2) * .9), 0]); }
        else { const s = SEATS[i % 2 ? 2 : 5], a = R() * TAU, r = Math.sqrt(R()) * .07; out.push([s[0] + Math.cos(a) * r, s[1] + Math.sin(a) * r, 0]); }
      }
      F[5] = out; }
    // 6 racks
    { const R = rng(16), polys = [];
      RACKS.forEach(r => { for (let u = 0; u < r.units; u++) polys.push(rect(r.x - .13, .62 - (u + 1) * .14, .26, .11)); });
      F[6] = alongPolys(polys, N, R); }
    // 7 woven fabric inside a circle, gathering at the core
    { const R = rng(17), out = [];
      for (let i = 0; i < N; i++) {
        const v = i % 2, line = Math.floor(R() * 13), c = -.78 + line * .13, t = (R() * 2 - 1) * .86;
        let x = v ? c : t, y = v ? t : c;
        if (Math.hypot(x, y) > .86) { const a = Math.atan2(y, x); x = Math.cos(a) * .86 * R(); y = Math.sin(a) * .86 * R(); }
        out.push([x, y, 0]);
      }
      F[7] = out; }
    return F;
  }

  /* ---------- overlays: the line art for each scene ---------- */
  function overlay(k, ctx, M, a, time, s) {
    if (a <= .01) return;
    const X = x => M.cx + x * M.R, Y = y => M.cy + y * M.R, S = v => v * M.R;
    ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const label = (txt, x, y, col = `rgba(${INK},.85)`, size = 12, w = 600) => { ctx.font = `${w} ${Math.max(10, size * M.k)}px ${FONT}`; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y); };
    const chip = (txt, x, y) => {
      ctx.font = `600 ${Math.max(10, 11.5 * M.k)}px ${FONT}`; const w = ctx.measureText(txt).width + 18 * M.k, h = 22 * M.k;
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.strokeStyle = `rgba(${INK},.18)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.stroke(); label(txt, x, y + .5, `rgba(${INK},.9)`, 11.5);
    };
    if (k === 0) {
      // corridor lines toward the vanishing point, keyholes glowing on every door
      ctx.strokeStyle = `rgba(${INK},.13)`; ctx.lineWidth = 1;
      [[-1.05, .92], [1.05, .92], [-1.05, -1], [1.05, -1]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(X(x), Y(VP[1] + (y - VP[1]))); ctx.lineTo(X(VP[0]), Y(VP[1])); ctx.stroke(); });
      DOORS.forEach((d, i) => {
        ctx.fillStyle = `rgba(255,255,255,${.72 - (i >> 1) * .12})`; ctx.strokeStyle = `rgba(${INK},${.3 - (i >> 1) * .06})`; ctx.lineWidth = Math.max(1, 1.4 * M.k);
        ctx.beginPath(); d.forEach((q, j) => j ? ctx.lineTo(X(q[0]), Y(q[1])) : ctx.moveTo(X(q[0]), Y(q[1]))); ctx.closePath(); ctx.fill(); ctx.stroke();
        const ix = lerp(d[0][0], d[2][0], .18), iy1 = lerp(d[0][1], d[1][1], .12), iy2 = lerp(d[0][1], d[1][1], .86);
        ctx.strokeStyle = `rgba(${INK},.08)`; ctx.beginPath(); ctx.moveTo(X(ix), Y(iy1)); ctx.lineTo(X(ix), Y(iy2)); ctx.stroke();
      });
      DOORS.forEach((d, i) => {
        const kx = lerp(d[0][0], d[2][0], .78), ky = lerp(d[0][1], d[1][1], .48), pulse = .5 + .5 * Math.sin(time * 2 + i);
        ctx.fillStyle = `rgba(${CY},${.25 + .45 * pulse})`; ctx.beginPath(); ctx.arc(X(kx), Y(ky), S(.018) * (1 + i % 2 * .2) * (1 - (i >> 1) * .22), 0, TAU); ctx.fill();
      });
      // a single key at the end of the corridor
      const kx = X(0), ky = Y(.55), g = ctx.createRadialGradient(kx, ky, 0, kx, ky, S(.22)); g.addColorStop(0, `rgba(${CY},.28)`); g.addColorStop(1, `rgba(${CY},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(kx, ky, S(.22), 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(${INK},.95)`; ctx.lineWidth = Math.max(1.6, 2.2 * M.k);
      ctx.beginPath(); ctx.arc(kx - S(.11), ky, S(.045), 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(kx - S(.065), ky); ctx.lineTo(kx + S(.12), ky); ctx.moveTo(kx + S(.08), ky); ctx.lineTo(kx + S(.08), ky + S(.035)); ctx.moveTo(kx + S(.115), ky); ctx.lineTo(kx + S(.115), ky + S(.045)); ctx.stroke();
    }
    if (k === 1 || k === 2) {
      SILOS.forEach(([cx, cy], i) => {
        const w = SILO_W * (k === 2 ? .8 : 1), h = SILO_H * (k === 2 ? .8 : 1);
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.strokeStyle = `rgba(${INK},.22)`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(X(cx - w / 2), Y(cy - h / 2), S(w), S(h), S(.05)); ctx.fill(); ctx.stroke();
        chip(SILO_TAG[i], X(cx), Y(cy - h / 2));
      });
    }
    if (k === 1) {
      // the empty centre: no single source of truth
      const r = S(.2), sp = time * .4;
      ctx.setLineDash([S(.025), S(.03)]); ctx.lineDashOffset = -sp * 20; ctx.strokeStyle = `rgba(${INK},.35)`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(X(0), Y(0), r, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      label('?', X(0), Y(0) + 1, `rgba(${INK},${.35 + .25 * Math.sin(time * 1.6)})`, 34, 300);
      // short probes that stop before reaching each other
      ctx.strokeStyle = `rgba(${GREY},.35)`; ctx.lineWidth = 1;
      SILOS.forEach(([cx, cy]) => { const ang = Math.atan2(-cy, -cx), d = Math.hypot(cx, cy); ctx.beginPath(); ctx.moveTo(X(cx + Math.cos(ang) * .16), Y(cy + Math.sin(ang) * .16)); ctx.lineTo(X(cx + Math.cos(ang) * (d - .3)), Y(cy + Math.sin(ang) * (d - .3))); ctx.stroke(); ctx.fillStyle = `rgba(${GREY},.5)`; ctx.beginPath(); ctx.arc(X(cx + Math.cos(ang) * (d - .3)), Y(cy + Math.sin(ang) * (d - .3)), 2, 0, TAU); ctx.fill(); });
    }
    if (k === 2) {
      TANGLE.forEach((c, i) => {
        ctx.strokeStyle = `rgba(${OAK},.5)`; ctx.lineWidth = 1.3; ctx.beginPath();
        c.pts.forEach((p, j) => { const w = Math.sin(j * .5 + time * 1.4 + c.ph) * .012; const x = X(p[0] + w), y = Y(p[1] - w); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
        const q = c.pts[Math.floor(c.knot * 40)];
        ctx.fillStyle = '#fff'; ctx.strokeStyle = `rgba(${OAK},.9)`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X(q[0]), Y(q[1]), S(.022), 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(q[0]) - S(.01), Y(q[1])); ctx.lineTo(X(q[0]) + S(.01), Y(q[1])); ctx.stroke();
      });
    }
    if (k === 3) {
      MODELS.forEach((m, i) => {
        const y = m.y, phase = ((time * .32 + i * .33) % 1);
        // data in, a model assembled from nothing, one objective out
        ctx.strokeStyle = `rgba(${INK},.18)`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(X(-.62), Y(y), S(.13), 0, TAU); ctx.stroke();
        ctx.setLineDash([S(.02), S(.025)]); ctx.beginPath(); ctx.moveTo(X(-.46), Y(y)); ctx.lineTo(X(-.24), Y(y)); ctx.moveTo(X(.24), Y(y)); ctx.lineTo(X(.46), Y(y)); ctx.stroke(); ctx.setLineDash([]);
        const edges = cubeEdges(0, y + .1, .2), built = phase < .7 ? phase / .7 : 1, fade = phase < .85 ? 1 : 1 - (phase - .85) / .15;
        ctx.strokeStyle = `rgba(${INK},${.9 * fade})`; ctx.lineWidth = Math.max(1.4, 2 * M.k);
        edges.forEach((e, j) => { const t = clamp(built * edges.length - j); if (t <= 0) return; ctx.beginPath(); ctx.moveTo(X(e[0][0]), Y(e[0][1])); ctx.lineTo(X(lerp(e[0][0], e[1][0], t)), Y(lerp(e[0][1], e[1][1], t))); ctx.stroke(); });
        // target rings
        [.11, .07, .03].forEach((r, j) => { ctx.strokeStyle = `rgba(${j === 2 ? CY : INK},${j === 2 ? .9 : .35})`; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(X(.64), Y(y), S(r), 0, TAU); ctx.stroke(); });
        chip(String(i + 1), X(0), Y(y - .2));
      });
    }
    if (k === 4) {
      const r = S(.62);
      const g = ctx.createRadialGradient(X(-.2), Y(-.25), r * .1, X(0), Y(0), r * 1.05); g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(235,228,216,.2)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(0), Y(0), r, 0, TAU); ctx.fill();
      ctx.strokeStyle = `rgba(${INK},.16)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(X(0), Y(0), r, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(X(0), Y(0), r, r * .28, 0, 0, TAU); ctx.stroke();
      // scripts around the globe: only a few are understood
      const G = [['A', 1, -.86, -.62], ['é', 1, .9, -.5], ['ع', 0, -.92, .3], ['中', 0, .86, .42], ['अ', 0, -.5, .86], ['Ж', 0, .45, .88], ['ß', 1, 0, -.92]];
      G.forEach(([ch, ok, gx, gy], i) => {
        const bob = Math.sin(time * 1.2 + i) * .02, x = X(gx), y = Y(gy + bob), rr = S(.085);
        ctx.fillStyle = ok ? `rgba(${INK},.95)` : 'rgba(255,255,255,.9)'; ctx.strokeStyle = ok ? `rgba(${INK},1)` : `rgba(${GREY},.45)`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.font = `600 ${Math.max(12, 17 * M.k)}px ${ch === 'ع' ? '"GE SS Two",Tahoma,sans-serif' : FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = ok ? '#fff' : `rgba(${GREY},.9)`; ctx.fillText(ch, x, y + 1);
        if (!ok) { ctx.strokeStyle = `rgba(${GREY},.55)`; ctx.beginPath(); ctx.moveTo(x - rr * .62, y + rr * .62); ctx.lineTo(x + rr * .62, y - rr * .62); ctx.stroke(); }
      });
    }
    if (k === 5) {
      // seats: talent is scarce
      SEATS.forEach((p, i) => { const on = i === 2 || i === 5; ctx.strokeStyle = on ? `rgba(${INK},.6)` : `rgba(${GREY},.4)`; ctx.setLineDash(on ? [] : [3, 4]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), S(.075), 0, TAU); ctx.stroke(); });
      ctx.setLineDash([]);
      // quarters and a timeline that keeps stretching
      const stretch = (time * .08) % 1;
      ctx.strokeStyle = `rgba(${INK},.2)`; ctx.lineWidth = Math.max(4, 6 * M.k); ctx.beginPath(); ctx.moveTo(X(-.85), Y(.5)); ctx.lineTo(X(.85), Y(.5)); ctx.stroke();
      ctx.strokeStyle = `rgba(${INK},.85)`; ctx.beginPath(); ctx.moveTo(X(-.85), Y(.5)); ctx.lineTo(X(-.85 + 1.7 * (.25 + .75 * smooth(stretch))), Y(.5)); ctx.stroke();
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach((q, i) => { const x = X(-.85 + (i + .5) * .425); label(q, x, Y(.62), `rgba(${INK},.7)`, 12.5); ctx.strokeStyle = `rgba(${INK},.25)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(-.85 + i * .425), Y(.44)); ctx.lineTo(X(-.85 + i * .425), Y(.56)); ctx.stroke(); });
      // cost curve rising ahead of value
      ctx.strokeStyle = `rgba(${OAK},.9)`; ctx.lineWidth = Math.max(1.6, 2.4 * M.k); ctx.beginPath();
      for (let i = 0; i <= 50; i++) { const t = i / 50, x = X(-.85 + t * 1.7), y = Y(.38 - Math.pow(t, 2.2) * .9); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      const tip = [X(.85), Y(.38 - .9)]; ctx.fillStyle = `rgba(${OAK},1)`; ctx.beginPath(); ctx.arc(tip[0], tip[1], S(.025), 0, TAU); ctx.fill();
      label('$', tip[0] - S(.07), tip[1] - S(.02), `rgba(${OAK},1)`, 18, 700);
    }
    if (k === 6) {
      // heat rising over the racks
      const heat = .7 + .3 * Math.sin(time * 1.3), g = ctx.createRadialGradient(X(.25), Y(-.55), 0, X(.25), Y(-.55), S(.75));
      g.addColorStop(0, `rgba(${OAK},${.22 * heat})`); g.addColorStop(1, `rgba(${OAK},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(.25), Y(-.55), S(.75), 0, TAU); ctx.fill();
      for (let w = 0; w < 3; w++) { const hx = .02 + w * .3, ph = (time * .35 + w * .33) % 1; ctx.strokeStyle = `rgba(${OAK},${.45 * (1 - ph)})`; ctx.lineWidth = 1.4; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const yy = -.12 - ph * .45 - i * .012, xx = hx + Math.sin(i * .6 + time * 2 + w) * .02; i ? ctx.lineTo(X(xx), Y(yy)) : ctx.moveTo(X(xx), Y(yy)); } ctx.stroke(); }
      RACKS.forEach((r, i) => {
        ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.strokeStyle = `rgba(${INK},.22)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(X(r.x - .15), Y(.62 - r.units * .14 - .02), S(.3), S(r.units * .14 + .02), S(.025)); ctx.fill(); ctx.stroke();
        for (let u = 0; u < r.units; u++) { const on = (Math.sin(time * 3 + u * 1.7 + i * 2.3) > .2); ctx.fillStyle = on ? `rgba(${CY},.95)` : `rgba(${INK},.18)`; ctx.beginPath(); ctx.arc(X(r.x + .08), Y(.62 - (u + .5) * .14 + .015), S(.012), 0, TAU); ctx.fill(); }
      });
      ctx.strokeStyle = `rgba(${INK},.3)`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X(-.9), Y(.64)); ctx.lineTo(X(.9), Y(.64)); ctx.stroke();
      // energy meter climbing
      const mx = X(-.55), my = Y(-.55), mr = S(.22), v = .55 + .4 * (.5 + .5 * Math.sin(time * .7));
      ctx.strokeStyle = `rgba(${INK},.18)`; ctx.lineWidth = Math.max(5, 7 * M.k); ctx.beginPath(); ctx.arc(mx, my, mr, Math.PI, TAU); ctx.stroke();
      const mg = ctx.createLinearGradient(mx - mr, 0, mx + mr, 0); mg.addColorStop(0, `rgba(${INK},.9)`); mg.addColorStop(1, `rgba(${OAK},1)`);
      ctx.strokeStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr, Math.PI, Math.PI + Math.PI * v); ctx.stroke();
      ctx.strokeStyle = `rgba(${INK},.9)`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(Math.PI + Math.PI * v) * mr * .8, my + Math.sin(Math.PI + Math.PI * v) * mr * .8); ctx.stroke();
      ctx.fillStyle = `rgba(${INK},.9)`; ctx.beginPath(); ctx.arc(mx, my, 3.5, 0, TAU); ctx.fill();
      label('kW', mx, my + S(.08), `rgba(${INK},.65)`, 12);
    }
    if (k === 7) {
      // weave: alternating over and under, gathered by one core
      ctx.save(); ctx.beginPath(); ctx.arc(X(0), Y(0), S(.86), 0, TAU); ctx.clip();
      for (let i = 0; i < 13; i++) {
        const c = -.78 + i * .13;
        ctx.strokeStyle = `rgba(${INK},${i % 2 ? .22 : .32})`; ctx.lineWidth = Math.max(1.5, 2.4 * M.k);
        ctx.beginPath(); ctx.moveTo(X(c), Y(-.9)); ctx.lineTo(X(c), Y(.9)); ctx.stroke();
        ctx.strokeStyle = `rgba(${INK},${i % 2 ? .3 : .2})`;
        for (let j = 0; j < 13; j++) { if ((i + j) % 2) continue; const x0 = -.78 + j * .13; ctx.beginPath(); ctx.moveTo(X(x0 - .065), Y(c)); ctx.lineTo(X(x0 + .065), Y(c)); ctx.stroke(); }
      }
      ctx.restore();
      ctx.strokeStyle = `rgba(${INK},.22)`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(X(0), Y(0), S(.86), 0, TAU); ctx.stroke();
      const pulse = .5 + .5 * Math.sin(time * 1.6), g = ctx.createRadialGradient(X(0), Y(0), 0, X(0), Y(0), S(.42));
      g.addColorStop(0, `rgba(28,88,188,${.45 + .1 * pulse})`); g.addColorStop(1, 'rgba(28,88,188,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X(0), Y(0), S(.42), 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.strokeStyle = `rgba(${INK},.35)`; ctx.lineWidth = 1.2; ctx.shadowColor = 'rgba(20,71,153,.25)'; ctx.shadowBlur = 24;
      const cw = S(.56), ch = S(.16); ctx.beginPath(); ctx.roundRect(X(0) - cw / 2, Y(0) - ch / 2, cw, ch, ch / 2); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
      label('PYXON-Eye', X(0), Y(0) + 1, '#144799', 17, 650);
    }
    ctx.restore();
  }

  /* ---------- renderer ---------- */
  function create(canvas, opts = {}) {
    const ctx = canvas.getContext('2d'), N = opts.n || 420, F = buildFormations(N), R = rng(99);
    const P = Array.from({ length: N }, () => ({ d: R(), c: (R() - .5) * .5, ph: R() * TAU, s: .7 + R() * .8 }));
    let W = 0, H = 0, dpr = 1, M = null, raf = 0, run = false, t0 = performance.now();
    const st = { p: 0, fixed: opts.fixed };
    const centers = opts.centers || [0, .072, .215, .358, .502, .645, .788, .93];
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2); W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const R0 = Math.min(W * .45, H * (opts.fixed != null ? .43 : .39));
      M = { cx: W / 2, cy: H * (opts.fixed != null ? .5 : .47), R: R0, k: clamp(R0 / 300, .7, 1.25) };
    }
    function point(f, j, time) {
      const q = F[f][j];
      if (q[2] === 2) { const c = q[3], i = q[4] * 40, a = c.pts[Math.floor(i)], b = c.pts[Math.min(40, Math.floor(i) + 1)], tt = i % 1; return [lerp(a[0], b[0], tt), lerp(a[1], b[1], tt)]; }
      if (q[2] === 4) { const [x, y, z] = q[3], rot = time * .25, cr = Math.cos(rot), sr = Math.sin(rot), xx = x * cr + z * sr, zz = -x * sr + z * cr, tl = .35, yy = y * Math.cos(tl) - zz * Math.sin(tl), z2 = y * Math.sin(tl) + zz * Math.cos(tl); return [xx * .62, yy * .62, z2, Math.atan2(z, x)]; }
      return q;
    }
    function frame(now) {
      const time = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      let k, m;
      if (st.fixed != null) { k = st.fixed; m = 0; }
      else {
        const p = st.p; k = 0; while (k < centers.length - 2 && p >= centers[k + 1]) k++;
        const u = clamp((p - centers[k]) / (centers[k + 1] - centers[k]));
        m = smooth(clamp((u - .22) / .5));
      }
      const k2 = Math.min(k + 1, 7);
      overlay(k, ctx, M, Math.pow(1 - m, 1.6), time, st);
      if (m > 0) overlay(k2, ctx, M, Math.pow(m, 1.6), time, st);
      // dots
      for (let j = 0; j < N; j++) {
        const pj = P[j], mj = smooth(clamp(m * 1.45 - pj.d * .45));
        const a = point(k, j, time), b = mj > 0 ? point(k2, j, time) : a;
        let x = lerp(a[0], b[0], mj), y = lerp(a[1], b[1], mj);
        const arc = Math.sin(Math.PI * mj) * pj.c; x += -(b[1] - a[1]) * arc; y += (b[0] - a[0]) * arc;
        x += Math.sin(time * .9 + pj.ph) * .004; y += Math.cos(time * .8 + pj.ph) * .004;
        let alpha = .62, col = INK, rad = 1.95 * pj.s;
        const sc = mj < .5 ? k : k2, zv = (sc === 4) ? (mj < .5 ? a : b) : null;
        if (zv) { const front = (zv[2] + 1) / 2, lit = Math.cos(zv[3] + time * .25 - .6) > .35; alpha = .12 + .7 * front; col = lit ? INK : GREY; if (!lit) alpha *= .6; rad *= .8 + front * .5; }
        if (sc === 2 && F[2][j][2] === 2) col = OAK;
        if (sc === 7) { const d = Math.hypot(x, y); alpha = .25 + .6 * (1 - d); if (d < .2) col = CY; }
        ctx.fillStyle = `rgba(${col},${alpha})`; ctx.beginPath(); ctx.arc(M.cx + x * M.R, M.cy + y * M.R, rad * M.k, 0, TAU); ctx.fill();
      }
      if (run) raf = requestAnimationFrame(frame);
    }
    function start() { if (run) return; run = true; raf = requestAnimationFrame(frame); }
    function stop() { run = false; cancelAnimationFrame(raf); }
    size(); addEventListener('resize', () => { size(); if (!run) frame(performance.now()); });
    if (opts.reduce) { frame(performance.now()); return { set p(v) { st.p = v; frame(performance.now()); }, start() { }, stop() { } }; }
    new IntersectionObserver(([en]) => en.isIntersecting ? start() : stop()).observe(canvas);
    frame(performance.now());
    return { set p(v) { st.p = v; }, get p() { return st.p; }, start, stop };
  }

  window.PYXGap = { create };
})();
