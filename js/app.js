/* PYXON website app: router, page templates, scroll choreography. */
(() => {
'use strict';
const D = window.PYX;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = matchMedia('(hover: none)').matches;
if (REDUCE) document.documentElement.classList.add('reduce');
gsap.registerPlugin(ScrollTrigger);
window.PYXAPP = { route: 'home' };

/* ---------- icons ---------- */
const P = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.4 2.4L15.5 10"/>',
  context: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  arabic: '<path d="M4 15c3 0 4-2 4-5M8 10c0 3 1 5 4 5s4-3 4-6M16 9c0 4 1 6 4 6"/><circle cx="12" cy="6" r=".9" fill="currentColor"/>',
  stack: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5" opacity=".5"/>',
  swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  flow: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="12" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8.3 7l7.4 4M8.3 17l7.4-4"/>',
  plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l7-7"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 10h8M8 14h5"/>',
  wave: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  note: '<path d="M7 3h9l4 4v14H7z"/><path d="M16 3v4h4M10 12h7M10 16h5"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
  down: '<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>'
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.context}</svg>`;
const arrow = ic('arrow', 'ic arr');

/* ---------- media helpers ---------- */
const loopVid = (key, poster, cls = '') => !key ? `<img class="vposter ${cls}" src="${poster}" alt="" loading="lazy">` : `<video class="lazyv ${cls}" muted loop playsinline preload="none" poster="${poster || `assets/video/${key}.webp`}" data-src="assets/video/${key}.mp4"></video>`;
const solMedia = s => {
  if (s.image && s.loop && (s.loop === 'enterprise' || s.loop === 'iot')) return `<video class="lazyv gen" muted loop playsinline preload="none" poster="${s.image}" data-src="assets/video/${s.loop}.mp4" data-fallback="${s.imageFallback || ''}"></video>`;
  if (s.loop && !s.image) return loopVid(s.loop);
  if (s.image && s.loop) return loopVid(s.loop, s.image);
  return `<img src="${s.image}" alt="" loading="lazy">`;
};
const docUrl = f => `assets/docs/${f}.pdf`;
const AR_OK = !/claude/i.test(location.hostname); /* Arabic PDFs ship with the deployable site; the private preview carries English only */
const thumb = f => `assets/thumb/${f}.webp`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const T = s => (window.PYXI18N ? PYXI18N.t(s) : s);
const RTL = () => document.documentElement.dir === 'rtl';
const words = s => T(s).split(' ').map(w => `<span class="word"><span>${w}</span></span>`).join(' ');
const label = t => `<div class="thread-label">${t}</div>`;
const solById = id => D.solutions.find(s => s.id === id);

/* ---------- shared sections ---------- */
const interlude = (a, b) => `<section class="interlude" data-ribbon><div class="wrap"><p class="h1 il" data-split>${words(a)}</p>${b ? `<p class="lead" data-reveal style="margin:26px auto 0;text-align:center">${b}</p>` : ''}</div></section>`;
const ctaSec = (title = "Let's turn your fragmented data into intelligent, real-time decisions, on one platform.", img = 'assets/img/gen-contact.webp') => `
<section class="cta-sec">
  <div class="bg"><img src="${img}" alt="" loading="lazy" onerror="this.src='assets/img/loom-room.webp'"></div>
  <div class="wrap">
    ${label('Start with one decision')}
    <h2 class="h1" data-split style="max-width:16ch">${words(title)}</h2>
    <p class="lead" data-reveal>A focused pilot on one high-value workflow, measured against a baseline, inside your environment.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:34px" data-reveal>
      <a class="btn" href="#contact" data-magnet>Book a 30-minute walkthrough ${arrow}</a>
      <a class="btn ghost" href="#resources" data-magnet>Download the profile</a>
    </div>
  </div>
</section>`;

const docCard = f => {
  const t = D.docTitles[f] || (D.docs.profiles.concat(D.docs.labs).find(d => d.file === f) || {}).title || f;
  const title = Array.isArray(t) ? t[0] : t;
  const lang = Array.isArray(t) ? t[1] : 'EN';
  return `<div class="doc" data-reveal><a class="cover" href="${docUrl(f)}" target="_blank" rel="noopener"><img src="${thumb(f)}" alt="" loading="lazy"></a><b>${esc(title)}</b><div class="meta"><span>PDF</span><span class="lang"><a href="${docUrl(f)}" target="_blank" rel="noopener">${lang}</a></span></div></div>`;
};
const docPair = (en, ar, title) => `<div class="doc" data-reveal><a class="cover" href="${docUrl(en)}" target="_blank" rel="noopener"><img src="${thumb(en)}" alt="" loading="lazy"></a><b>${esc(title)}</b><div class="meta"><span>PDF</span><span class="lang"><a href="${docUrl(en)}" target="_blank" rel="noopener">EN</a>${ar && AR_OK ? `<a href="${docUrl(ar)}" target="_blank" rel="noopener">AR</a>` : ''}</span></div></div>`;

const filmBlock = (loop, film, yt, title, poster) => `
<div class="film-block" data-film="${film}" data-yt="${yt || ''}" data-title="${esc(title)}" data-cursor="Play" data-reveal>
  ${loopVid(loop, poster)}
  <div class="play">${ic('play')}</div>
  <div class="cap"><b>${esc(title)}</b><span class="chip" style="background:rgba(255,255,255,.2);color:#fff">Watch</span></div>
</div>`;

const solCard = s => `
<a class="sol-card" href="#${s.id}" data-cursor="Explore">
  ${solMedia(s)}
  <span class="by">by PYXON-Eye</span>
  <span class="go">${arrow}</span>
  <div class="in"><div class="k">${s.short}</div><h3>${s.name}</h3><p>${s.card}</p></div>
</a>`;

/* ---------- HOME ---------- */
function pageHome() {
  return `
<section class="hero" id="hero">
  <div class="stage">
    <canvas id="loomCanvas" aria-label="The PYXON loom video: separate threads woven into one blue ribbon"></canvas>
    <div class="veil"></div>
    <div class="meta"><span class="chip live">Deployable in any country, on any cloud</span></div>
    <div class="copy">
      <div class="chap" data-from="0" data-to=".12">
        ${label('PYXON-Eye, the contextual intelligence platform')}
        <h1 class="h-mega">${words('Intelligence Built for Reality.')}</h1>
        <p class="lead">The contextual intelligence platform for governments and enterprises. Scroll to see how PYXON weaves your data into one.</p>
        <div class="cta hero-in"><a class="btn" href="#platform" data-magnet>Explore PYXON-Eye ${arrow}</a><a class="btn ghost" href="#contact" data-magnet>Book a walkthrough</a></div>
      </div>
      <div class="chap" data-from=".14" data-to=".32"><h2 class="h1">${words('Every organisation holds its data in separate threads.')}</h2></div>
      <div class="chap" data-from=".34" data-to=".52"><h2 class="h1">${words('PYXON-Eye reads them as they are, and weaves them into context.')}</h2></div>
      <div class="chap" data-from=".54" data-to=".7"><h2 class="h1">${words('Less data preparation. Less infrastructure.')}</h2></div>
      <div class="chap" data-from=".72" data-to=".86"><h2 class="h1">${words('More usable intelligence. Sovereign and secure.')}</h2></div>
      <div class="chap" data-from=".88" data-to="1.01">
        <h2 class="h1" style="max-width:14ch">${words('One platform. Every domain. Any model.')}</h2>
        <p class="lead">PYXON-Eye builds a governed context layer above the systems you already run, so any AI model reasons on your reality, inside your environment.</p>
        <div class="cta"><a class="btn" href="#platform" data-magnet>Explore PYXON-Eye ${arrow}</a><a class="btn ghost" href="#contact" data-magnet>Book a walkthrough</a></div>
      </div>
    </div>
    <div class="scrollcue" id="cue"><span>Scroll to weave</span><i></i></div>
    <div class="progress"><i id="heroBar"></i></div>
  </div>
</section>
${interlude('Data never moves. Context does.', 'PYXON-Eye reads your systems in place and weaves one governed context above them. Nothing copied, nothing retained.')}
<section class="sec tight">
  <div class="wrap">
    <div class="stats">
      <div class="stat" data-reveal><div class="v"><span class="num" data-count="6">0</span></div><p>Ready-to-deploy solution families on one platform</p></div>
      <div class="stat" data-reveal><div class="v"><span class="num" data-count="8">0</span></div><p>Genuine AI products from PYXON AI Labs</p></div>
      <div class="stat" data-reveal><div class="v"><span class="num" data-count="1.5" data-dec="1">0</span><sup>B</sup></div><p>Parameters, scoring ahead of models up to 150 times its size</p></div>
      <div class="stat" data-reveal><div class="v"><span class="num" data-count="2">0</span></div><p>Solutions live on Microsoft Marketplace, discoverable worldwide</p></div>
    </div>
  </div>
</section>

<section class="sec globe-sec" id="globalSec">
  <div class="wrap globe-wrap">
    <div>
      ${label('Global by design')}
      <h2 class="h1" data-split>${words('Built for every region. Deployable in any country.')}</h2>
      <p class="lead" data-reveal>PYXON-Eye runs wherever your data must stay: on-premises, private cloud, hybrid or air-gapped, in any country. With global cloud and AI partners, it reaches governments and enterprises in every region.</p>
      <div class="regions">${regionsGrid()}</div>
      <p class="small" style="margin-top:18px" data-reveal>Gov-Insight and Edu-Bridge are discoverable by Microsoft customers worldwide, with procurement through the Marketplace.</p>
    </div>
    <div class="globe-box" id="globeBox" data-cursor="Drag"><div class="glabels" id="glabels"></div></div>
  </div>
</section>

<section class="gap" id="gapSec">
  <div class="stage">
    <div class="pic">
      <canvas id="gapCv" role="img" aria-label="Animated drawing of each deployment problem: closed doors, separate data silos, tangled connectors, models rebuilt from scratch, a globe trained for other markets, stretching timelines and rising costs, then every thread woven into PYXON-Eye"></canvas>
      <div class="pcap"><b id="gapNum">01</b><span>/ 0${D.gap.length}</span></div>
    </div>
    <div class="txt">
      ${label('The deployment gap')}
      <h2 class="h2" style="max-width:16ch">Many systems. Many doors. One AI initiative trying to open them all.</h2>
      <div class="list">
        ${D.gap.map((g, i) => `<div class="item"><canvas class="mscene" data-scene="${i + 1}" aria-hidden="true"></canvas><div class="n">0${i + 1}</div><h3 class="h3">${g.title}</h3><p>${g.text}</p></div>`).join('')}
        <div class="final"><canvas class="mscene" data-scene="7" aria-hidden="true"></canvas><div class="h3" style="max-width:20ch">Six hidden realities, one platform built to resolve them.</div><p class="lead" style="margin-top:16px">PYXON-Eye.</p><a class="btn" style="margin-top:24px" href="#platform">See how it closes the gap ${arrow}</a></div>
      </div>
      <div class="dots">${D.gap.map(() => '<i><b></b></i>').join('')}</div>
    </div>
  </div>
</section>

<section class="stack-sec" id="stackSec">
  <div class="wrap stage">
    <div>
      ${label('Platform architecture')}
      <h2 class="h2">Four layers, from raw data to action.</h2>
      <p class="lead" style="margin-top:22px">Data flows up: connect, understand, act, and deliver domain solutions. Everything runs in your environment.</p>
      <div class="layer-info" id="layerInfo">
        ${D.layers.map((l, i) => `<button type="button" data-l="${3 - i}"><span class="n">${l.n}</span><b>${l.name}</b><p>${l.text}</p></button>`).join('')}
      </div>
    </div>
    <div class="stack-3d" id="stack3d">
      <div class="rig" id="rig">
        ${D.layers.slice().reverse().map((l, i) => `<div class="slab ${l.n === 'L2' ? 'core' : ''}" data-i="${i}"><span class="tag">${l.n}</span><span class="nm">${l.n === 'L2' ? 'PYXON-CORE' : l.name}</span></div>`).join('')}
      </div>
      <div class="llm-rail"><span>Any LLM, local or cloud</span></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split head">
      <div>${label('Inside PYXON-CORE')}<h2 class="h2" data-split>${words('The engine holds the memory. The model only reasons.')}</h2></div>
      <p class="lead" data-reveal>PYXON-CORE builds living contexts above every source and knows what relates to what before any model is called. The model receives a small, relevant slice instead of your whole estate.</p>
    </div>
    <div class="flow" id="flow" data-reveal>
      <canvas></canvas>
      <div class="lbl l1"><b>Your systems</b>ERP, CRM, documents, sensors, APIs, public signals</div>
      <div class="lbl l2"><b>PYXON-CORE</b>Context built in place</div>
      <div class="lbl l3"><b>Any LLM</b>Receives only the relevant slice</div>
      <div class="meter"><div><strong>0</strong><span class="small">data copied</span></div><div><strong>0</strong><span class="small">data retained</span></div></div>
    </div>
    <div class="compare" style="margin-top:60px">
      ${D.core.map(c => `<div class="row" data-reveal><span class="a">${c.area}</span><span class="from">${c.from}</span><span class="to">${c.to}</span></div>`).join('')}
    </div>
  </div>
</section>

<section class="strip" id="strip">
  <div class="stage">
    <div class="track" id="track">
      <div class="sol-card intro">
        ${label('Solutions portfolio')}
        <h2 class="h1">One platform, adapted to every domain.</h2>
        <p class="lead" style="margin-top:22px">Each solution runs on the same engine, governance and connectors, so one skill set serves every department.</p>
      </div>
      ${D.solutions.map(solCard).join('')}
      <div class="sol-card intro" style="justify-content:center"><h3 class="h2">Your sector is next.</h3><p class="lead" style="margin:18px 0 26px">The same approach generates a tailored solution in weeks, not quarters.</p><a class="btn" href="#solutions">All solutions ${arrow}</a></div>
    </div>
  </div>
</section>

${interlude('One engine. One governance. One set of connectors.', 'Every PYXON solution shares them, so the second deployment is faster than the first.')}
<section class="sec linen">
  <div class="wrap">
    <div class="split head">
      <div>${label('PYXON Studio, the front end of PYXON-Eye')}<h2 class="h2" data-split>${words('Where people meet the platform.')}</h2></div>
      <p class="lead" data-reveal>The workspace where leaders, analysts and agents work together. Every solution, from Gov-Insight to Nabd, is delivered through the same Studio.</p>
    </div>
    ${studioMock()}
    <div class="grid g4" style="margin-top:28px">${D.studio.map(s => `<div data-reveal><div class="h4" style="margin-bottom:8px">${s.title}</div><p class="small">${s.text}</p></div>`).join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split head">
      <div>${label('PYXON AI Labs')}<h2 class="h1" data-split>${words('Research that ships.')}</h2></div>
      <p class="lead" data-reveal>Genuine AI products, from small, vision and speech models to embeddings, governance and agents: built in the Labs and measured on public benchmarks.</p>
    </div>
    <div class="split top" style="align-items:center">
      <div data-reveal><div class="giant"><span class="num" data-count="1.5" data-dec="1">0</span><span class="unit">B</span></div><p class="lead" style="margin-top:20px">Pyxon-SLLM-RAG-v3 runs on a device or one CPU server, and scores ahead of models up to 150 times its size on the Balsam benchmark.</p></div>
      ${balsamCards(1)}
    </div>
    <div style="margin-top:50px;display:flex;gap:12px;flex-wrap:wrap" data-reveal><a class="btn" href="#labs">Inside the Labs ${arrow}</a><a class="btn ghost" href="${D.links.labs}" target="_blank" rel="noopener">Visit pyxon.ai</a></div>
  </div>
</section>

${pyxiSection()}

<section class="sec linen">
  <div class="wrap">
    <div class="split head">
      <div>${label('Go to market')}<h2 class="h2" data-split>${words('Two solutions available on Microsoft Marketplace.')}</h2></div>
      <p class="lead" data-reveal>Discoverable by Microsoft customers worldwide. Gov-Insight and Edu-Bridge are the first two; more PYXON solutions follow.</p>
    </div>
    ${marketplace()}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap"><div>${label('See PYXON in action')}<h2 class="h2">Videos from the platform.</h2></div><a class="link" href="#videos">All videos ${arrow}</a></div>
    <div class="grid g3">${vids().filter(f => ['brand', 'eye', 'gov', 'edu', 'governance', 'construction'].includes(f.id)).map(filmTile).join('')}</div>
  </div>
</section>
${ctaSec()}`;
}

function filmTile(f) {
  return `<div class="film-block" style="aspect-ratio:16/10" data-film="${f.film}"${f.lang ? ` data-lang="${f.lang}"` : ''} data-yt="${f.yt || ''}" data-title="${esc(f.title)}" data-cursor="Play" data-reveal>${loopVid(f.loop, f.poster)}<div class="play" style="width:70px;height:70px">${ic('play')}</div><div class="cap"><b style="font-size:18px">${esc(f.title)}</b></div></div>`;
}

function studioMock() {
  const s = solById('gov-insight').scorecard;
  return `
<div class="studio" id="studio" data-reveal>
  <div class="bar"><div style="display:flex;align-items:center;gap:12px"><img src="assets/img/pyxon-logo.svg" alt="PYXON"><b style="font-variation-settings:'wdth' 100,'wght' 640">Studio</b><span class="chip">Gov-Insight</span></div><span class="chip live">Illustrative view</span></div>
  <div class="pane" id="chat">
    <div class="msg q">Which objectives in the digital pillar have no owning project?</div>
    <div class="msg a">Three objectives have no owning project. The largest gap is service digitisation, weighted 18% of the pillar.<div class="src"><span>Entity strategy, p.14</span><span>Portfolio register</span><span>KPI library</span></div></div>
    <div class="msg q ar">ما أبرز ملاحظات المواطنين هذا الشهر؟</div>
    <div class="msg a ar">تتصدر ملاحظات تصريف مياه الأمطار، مرتبطة بمشروع البنية التحتية في الحي الشمالي.<div class="src"><span>البلاغات</span><span>مركز الاتصال</span></div></div>
    <div class="approval"><span>Agent drafted a costed plan for risk R1, stormwater flooding</span><span class="ok">Approve</span></div>
  </div>
  <div class="pane">
    <div class="small">${s.title}, ${s.sample}</div>
    <div class="kpi" style="margin-top:10px"><strong><span class="num" data-count="${s.index}">0</span>%</strong><span class="small">alignment index<br>${s.delta}</span></div>
    <div class="bars">${s.rows.map(r => `<div class="b"><span>${r[0]}</span><em>${r[1]}%</em><i><b data-w="${r[1]}"></b></i></div>`).join('')}</div>
  </div>
</div>`;
}

function balsamCards(compact) {
  return `<div class="balsam" ${compact ? 'style="grid-template-columns:1fr"' : ''}>${D.balsam.slice(0, compact ? 1 : 3).map(c => `
  <div class="card bcat" data-reveal><h4>${c.cat}</h4>${c.rows.map(r => `<div class="brow ${r[2] ? 'win' : ''}"><span>${r[0]}</span><em>${r[1].toFixed(3)}</em><div class="bar"><i data-w="${Math.round((r[1] / .75) * 100)}"></i></div></div>`).join('')}</div>`).join('')}
  </div>${compact ? '' : ''}`;
}

function marketplace() {
  return `<div class="mp">
  ${[['gov-insight', 'mpGov', 'Alignment intelligence for government: from national vision to measured, traceable delivery.', 'Built for ministries, authorities, municipalities and agencies.'], ['edu-bridge', 'mpEdu', 'Education intelligence that connects what universities teach to what the labour market needs.', 'Built for universities, colleges and education authorities.']].map(([id, k, a, b]) => {
    const s = solById(id);
    return `<div class="card" data-reveal><img src="${s.icon}" alt=""><div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><b class="h3">${s.name}</b><span class="chip live">Available</span></div><div class="small" style="margin:6px 0 12px">by PYXON, SaaS</div><p style="color:var(--ink-2)">${a}</p><p class="small" style="margin-top:6px">${b}</p><a class="link" style="margin-top:16px" href="${D.links[k]}" target="_blank" rel="noopener">View on Microsoft Marketplace ${ic('ext', 'ic')}</a></div></div>`;
  }).join('')}</div>`;
}

function pyxiSection() {
  return `
<section class="sec pyxi-sec">
  <div class="wrap split" style="align-items:center">
    <div>
      ${label('Meet PYXI')}
      <h2 class="h1" data-split>${words('Your guide through PYXON.')}</h2>
      <p class="lead" data-reveal>PYXI is the PYXON falcon, with the cyan Eye on its vest and the PYXON-Eye context points on its wing. Ask PYXI where to start: it knows every solution, every video and every brief.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:30px" data-reveal><button class="btn" type="button" data-open-pyxi>Ask PYXI where to start ${arrow}</button>${D.pyxiLaunch ? `<button class="btn ghost" type="button" data-film="pyxi-launch" data-title="Meet PYXI: Small wings. Big possibilities.">${ic('play', 'ic')} Watch PYXI's first story</button>` : ''}</div>
      <div class="pyxi-facts" data-reveal><div><b>The Eye</b><span>The cyan emblem on the vest is PYXON-Eye.</span></div><div><b>The constellation</b><span>The points on the wing are the context PYXON-CORE connects.</span></div><div><b>The falcon</b><span>Sharp sight, calm judgement, always on watch.</span></div></div>
    </div>
    <div data-reveal>
      <div class="pyxi-stage" id="pyxiStage"><img src="assets/pyxi/pyxi-hero.webp" alt="PYXI, the PYXON falcon"></div>
    </div>
  </div>
</section>`;
}

/* ---------- PLATFORM ---------- */
function pagePlatform() {
  return `
<section class="sub-hero">
  <div class="bg"><img src="assets/img/gen-platform.webp" alt="" onerror="this.src='assets/img/loom-room.webp'"></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Platform</span></div>
    ${label('The intelligence platform')}
    <h1 class="h1" data-split>${words('PYXON-Eye.')}</h1>
    <p class="h3" style="margin-top:18px;color:var(--royal);max-width:20ch" data-reveal>More intelligence. Less resource consumption.</p>
    <p class="lead" data-reveal>PYXON-Eye is the intelligence platform behind every PYXON solution. It builds a governed context layer above your existing systems, content and signals, so any AI model reasons on your reality with fewer tokens, less compute and nothing copied.</p>
    <div class="cta" data-reveal><a class="btn" href="#contact">Book a walkthrough ${arrow}</a><button class="btn ghost" data-film="eye" data-yt="0OAWAEbgK-o" data-title="PYXON-Eye: See Everything, Decide with Confidence">${ic('play', 'ic')} Watch the video</button></div>
  </div>
</section>
<section class="sec tight"><div class="wrap"><dl class="glance">${[['Built for', 'CIOs, CDOs and transformation leads who need one governed intelligence layer'], ['Connects', 'ERP, CRM, core systems, data lakes, documents, databases, APIs and MCPs, sensors and external signals'], ['Languages', 'Arabic and English, by voice or text'], ['Deployment', 'Cloud, on-premises, hybrid, air-gapped or edge'], ['Start', 'A focused pilot on one high-value workflow, measured against a baseline']].map(g => `<div data-reveal><dt>${g[0]}</dt><dd>${g[1]}</dd></div>`).join('')}</dl></div></section>

<section class="sec linen">
  <div class="wrap">
    <div class="split head"><div>${label('What PYXON-Eye does')}<h2 class="h2">Connect in place. Understand. Act. Reuse.</h2></div><p class="lead" data-reveal>An AI-powered business intelligence platform that unifies internal enterprise data with external signals into a comprehensive, real-time view, then turns it into predictive insights, intelligent decisions and automated actions.</p></div>
    <div class="grid g4">${[['plug', 'Connect in place', 'Secure, governed ingestion of internal systems and external signals where they live. No ETL, no copies, no retention.'], ['context', 'Understand the context', 'PYXON-CORE, the Contextual Intelligence and Reasoning Engine, builds living contexts above every source and knows what relates to what before any model is called.'], ['shield', 'Act with control', 'Orchestration, recommendations and controlled automated action, with human approval for sensitive steps.'], ['stack', 'Reuse across the enterprise', 'The same platform, integrations and domain intelligence extend across departments and use cases.']].map(c => `<div class="card" data-reveal><div class="icon">${ic(c[0])}</div><div class="h4">${c[1]}</div><p>${c[2]}</p></div>`).join('')}</div>
  </div>
</section>

<section class="stack-sec" id="stackSec">
  <div class="wrap stage">
    <div>
      ${label('Platform architecture')}
      <h2 class="h2">One layer changes everything.</h2>
      <p class="lead" style="margin-top:22px">Sensitive data is masked before any AI model sees it. Deploy on-premises, private cloud, hybrid or air-gapped: nothing leaves, nothing is shared.</p>
      <div class="layer-info" id="layerInfo">${D.layers.map((l, i) => `<button type="button" data-l="${3 - i}"><span class="n">${l.n}</span><b>${l.name}</b><p>${l.text}</p></button>`).join('')}</div>
    </div>
    <div class="stack-3d" id="stack3d"><div class="rig" id="rig">${D.layers.slice().reverse().map((l, i) => `<div class="slab ${l.n === 'L2' ? 'core' : ''}" data-i="${i}"><span class="tag">${l.n}</span><span class="nm">${l.n === 'L2' ? 'PYXON-CORE' : l.name}</span></div>`).join('')}</div><div class="llm-rail"><span>Any LLM, local or cloud</span></div></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split head"><div>${label('Inside PYXON-CORE, CPU-first')}<h2 class="h2" data-split>${words('The engine holds the memory. The model only reasons.')}</h2></div><p class="lead" data-reveal>Context building, embedding and retrieval run on CPU rather than GPU. The platform stays LLM-agnostic because your data never reaches the model, only the relevant slice does.</p></div>
    <div class="flow" id="flow" data-reveal><canvas></canvas>
      <div class="lbl l1"><b>Your systems</b>Read in place</div>
      <div class="lbl l2"><b>PYXON-CORE</b>Context construction</div>
      <div class="lbl l3"><b>Any LLM</b>A focused slice</div>
      <div class="meter"><div><strong>0</strong><span class="small">data copied</span></div><div><strong>0</strong><span class="small">data retained</span></div></div>
    </div>
    <div class="grid g3" style="margin-top:40px">${[['Context construction', 'Living contexts built above every source, in place, before any model is called.'], ['Custom embedding and retrieval', 'The PYXON Custom Embedding Model Engine builds a model per data type and source automatically. Fewer tokens, lower cost, less hallucination.'], ['Model routing and governance', 'The right model and size for each task, local or cloud, under your policies and audit trail.']].map(c => `<div class="card" data-reveal><div class="h4" style="margin-top:0">${c[0]}</div><p>${c[1]}</p></div>`).join('')}</div>
    <div class="compare" style="margin-top:50px">${D.core.map(c => `<div class="row" data-reveal><span class="a">${c.area}</span><span class="from">${c.from}</span><span class="to">${c.to}</span></div>`).join('')}</div>
  </div>
</section>

${interlude('Your data. Your sovereignty. Your intelligence.')}
<section class="sec linen">
  <div class="wrap">
    <div class="split head"><div>${label('Key features')}<h2 class="h2">Seven capabilities that close the gap.</h2></div><p class="lead" data-reveal>One platform, from data collection to agentic action.</p></div>
    <div class="grid g4">${D.capabilities.map(c => `<div class="card" data-reveal><div class="icon">${ic(c.icon)}</div><div class="h4">${c.title}</div><p>${c.text}</p></div>`).join('')}<div class="card" data-reveal style="background:linear-gradient(140deg,var(--royal),var(--cobalt));color:#fff"><div class="icon" style="background:rgba(255,255,255,.15);color:#fff">${ic('eye')}</div><div class="h4">PYXON-Eye</div><p style="color:rgba(255,255,255,.85)">One platform, from data collection to agentic action.</p></div></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="split head"><div>${label('Front end and back end')}<h2 class="h2">PYXON Studio and the PYXON-Eye engine.</h2></div><p class="lead" data-reveal>Studio is where leaders, analysts and agents work together. The engine is where the intelligence runs: it connects your data in place, builds governed context, runs the models and orchestrates agents, all inside your environment.</p></div>
    ${studioMock()}
    <div class="grid g2" style="margin-top:40px">
      <div class="card" data-reveal><div class="h3">PYXON Studio</div><div style="display:grid;gap:16px;margin-top:20px">${D.studio.map(s => `<div><b class="h4" style="display:block;margin:0 0 4px">${s.title}</b><p>${s.text}</p></div>`).join('')}</div></div>
      <div class="card" data-reveal><div class="h3">PYXON-Eye engine</div><div style="display:grid;gap:16px;margin-top:20px">${D.engine.map(s => `<div><b class="h4" style="display:block;margin:0 0 4px">${s.title}</b><p>${s.text}</p></div>`).join('')}</div></div>
    </div>
  </div>
</section>

<section class="sec linen">
  <div class="wrap">
    <div class="head">${label('Why PYXON-Eye')}<h2 class="h2">Sovereign. LLM-agnostic. CPU-first.</h2></div>
    <div class="grid g3">${[['Connects in place', 'Reads data where it lives. No ETL, no copies, nothing retained by PYXON.'], ['Arabic-native reasoning', 'Reasons in Arabic directly, not through translation. Ask by voice or text.'], ['Every figure traced', 'Answers cite the records behind them, so results can be checked and defended.'], ['Your choice of AI model', 'Local or cloud, swapped in without a rebuild.'], ['Lower compute cost', 'CPU-first context and retrieval; GPU only where it earns it.'], ['Local regulation', 'Operates under local regulations and governance, including SDAIA, NDMO and PDPL.']].map(c => `<div class="card" data-reveal><div class="h4" style="margin-top:0">${c[0]}</div><p>${c[1]}</p></div>`).join('')}</div>
    <div style="margin-top:60px">${filmBlock('eye', 'eye', '0OAWAEbgK-o', 'PYXON-Eye: See Everything, Decide with Confidence')}</div>
    <div style="margin-top:20px">${filmBlock('loom', 'loom', '_7J3R_PWp84', 'The Loom: PYXON-Eye brand video')}</div>
  </div>
</section>

<section class="sec"><div class="wrap"><div class="head">${label('Downloads')}<h2 class="h2">PYXON-Eye material.</h2></div><div class="docs">${docPair('pyxon-eye-brief-2026-en', 'pyxon-eye-brief-2026-ar', 'PYXON-Eye Solution Brief')}${docCard('pyxon-eye-sheet-2d')}</div></div></section>
${ctaSec()}`;
}

/* ---------- SOLUTIONS INDEX ---------- */
function pageSolutions() {
  return `
<section class="sub-hero">
  <div class="bg"><img src="assets/img/gen-solutions.webp" alt="" onerror="this.src='assets/img/cubes-shelf.webp'"></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Solutions</span></div>
    ${label('Solutions for every domain')}
    <h1 class="h1" data-split>${words('One platform. Eight solution families.')}</h1>
    <p class="lead" data-reveal>A single intelligence platform, adapted across government, enterprise, education, healthcare, procurement, IoT, cybersecurity and industry-specific environments. All by PYXON-Eye.</p>
  </div>
</section>
<section class="sec tight"><div class="wrap"><div class="grid g4" id="solGrid">${D.solutions.map(s => `<div data-reveal>${solCard(s).replace('class="sol-card"', 'class="sol-card" style="width:100%"')}</div>`).join('')}</div></div></section>
<section class="sec linen"><div class="wrap"><div class="split head"><div>${label('Services')}<h2 class="h2">Industry-specific solutions, powered by AI.</h2></div><p class="lead" data-reveal>Beyond the products, our teams enable, extend and train.</p></div><div class="grid g3">${D.services.map((s, i) => `<div class="card" data-reveal><div class="icon">${ic(['context', 'cpu', 'stack', 'globe', 'note'][i])}</div><div class="h4">${s.title}</div><p>${s.text}</p></div>`).join('')}</div></div></section>
${ctaSec('Find the solution for your first decision.')}`;
}

/* ---------- SOLUTION DETAIL ---------- */
function pageSolution(s) {
  const idx = D.solutions.indexOf(s);
  const next = D.solutions[(idx + 1) % D.solutions.length];
  const doesTitle = s.surfacesTitle || `What ${s.name.split(' ')[0]} does.`;
  const hasFilm = !!s.film;
  const heroMedia = s.loop ? (s.image && (s.loop === 'enterprise' || s.loop === 'iot') ? `<video class="lazyv gen" muted loop playsinline preload="none" poster="${s.image}" data-src="assets/video/${s.loop}.mp4" data-fallback="${s.imageFallback || ''}"></video>` : loopVid(s.loop, s.image)) : `<img src="${s.image}" alt="">`;
  return `
<section class="sub-hero sol">
  <div class="wrap solgrid">
    <div>
      <div class="crumbs"><a href="#home">PYXON</a><span>/</span><a href="#solutions">Solutions</a><span>/</span><span>${s.name}</span></div>
      <div class="by"><span class="chip">${s.kicker}</span><span class="chip" style="background:var(--ink);color:#fff">by PYXON-Eye</span></div>
      <h1 class="h1 solname">${s.name}${s.arabic ? `<span class="ar-name" lang="ar">${s.arabic}</span>` : ''}</h1>
      <p class="h3" style="margin-top:20px;max-width:22ch;color:var(--royal)" data-reveal>${s.tagline}</p>
      <p class="lead" data-reveal>${s.intro}</p>
      <div class="cta" data-reveal><a class="btn" href="#contact" data-solution="${s.id}">Start a pilot ${arrow}</a>${hasFilm ? `<button class="btn ghost" data-film="${s.film}" data-yt="${s.yt || ''}" data-title="${esc(s.name)}">${ic('play', 'ic')} Watch the video</button>` : ''}${s.marketplace ? `<a class="btn ghost" href="${D.links[s.marketplace]}" target="_blank" rel="noopener">On Microsoft Marketplace</a>` : ''}</div>
    </div>
    <div class="window solmedia" data-reveal>${heroMedia}${s.icon ? `<img class="appicon" src="${s.icon}" alt="">` : ''}</div>
  </div>
</section>
<section class="sec tight"><div class="wrap"><dl class="glance">${s.glance.map(g => `<div data-reveal><dt>${g[0]}</dt><dd>${g[1]}</dd></div>`).join('')}</dl>
${s.stats ? `<div class="stats" style="margin-top:50px;grid-template-columns:repeat(3,1fr)">${s.stats.map(x => `<div class="stat" data-reveal><div class="v">${x[0]}</div><p>${x[1]}</p></div>`).join('')}</div>` : ''}</div></section>

${s.journey ? `<section class="sec linen"><div class="wrap"><div class="head">${label('Patient journey')}<h2 class="h2">${s.journeyTitle}</h2><p class="lead">Every stage: capture context, apply safety rules, route to a named owner, record the outcome, measure the result.</p></div><div class="journey7">${s.journey.map(j => `<div data-reveal><b>${j[0]}</b><p>${j[1]}</p></div>`).join('')}</div></div></section>` : ''}

${s.does ? `<section class="sec ${s.journey ? '' : 'linen'}"><div class="wrap"><div class="split head"><div>${label(s.surfacesTitle ? 'Six surfaces' : 'Capabilities')}<h2 class="h2">${doesTitle}</h2></div><p class="lead" data-reveal>${s.also[0]}</p></div>
  <div class="grid ${s.does.length > 4 ? 'g3' : 'g4'}">${s.does.map((d, i) => `<div class="card" data-reveal><div class="icon">${ic(['context', 'stack', 'flow', 'shield', 'eye', 'note'][i % 6])}</div><div class="h4">${d[0]}</div><p>${d[1]}</p></div>`).join('')}</div></div></section>` : ''}

${s.sectors ? `<section class="sec linen"><div class="wrap"><div class="head">${label('Sectors, as examples')}<h2 class="h2">Built for the realities of each sector.</h2></div><div class="grid g2">${s.sectors.map(sec => `<div class="card" data-reveal style="padding:0;overflow:hidden"><div class="window ratio-video" style="border-radius:0;box-shadow:none">${sec.loop ? loopVid(sec.loop) : `<img src="${sec.image}" alt="" loading="lazy">`}</div><div style="padding:28px"><div class="h3">${sec.name}</div><p style="color:var(--royal);margin:8px 0 10px;font-variation-settings:'wdth' 100,'wght' 600">${sec.line}</p><p>${sec.text}</p><div style="display:flex;gap:14px;margin-top:18px;flex-wrap:wrap">${sec.film ? `<button class="link" data-film="${sec.film}" data-yt="${sec.yt || ''}" data-title="${esc(sec.name)}">${ic('play', 'ic')} Watch the video</button>` : ''}</div></div></div>`).join('')}</div></div></section>` : ''}

${s.scorecard ? `<section class="sec"><div class="wrap"><div class="split head"><div>${label('What changes')}<h2 class="h2">One number the executive can act on, and six that say where.</h2></div><p class="lead" data-reveal>An illustrative entity scorecard: one alignment index and six aspects, each traced to projects, owners and budget lines.</p></div>${studioMock()}</div></section>` : ''}

${interlude(s.tagline)}
<section class="sec ${s.scorecard ? 'linen' : ''}"><div class="wrap"><div class="head">${label('How it works')}<h2 class="h2">${s.stepsTitle}</h2></div>
  <div class="steps"><svg class="thread" viewBox="0 0 1000 60" preserveAspectRatio="none"><path d="M0 30 C120 0 230 60 350 30 S580 0 700 30 S880 60 1000 30" fill="none" stroke="#144799" stroke-width="2.5" stroke-linecap="round" data-draw/></svg>${s.steps.map((st, i) => `<div class="step" data-reveal><span class="dot">${i + 1}</span><div class="h4">${st[0]}</div><p>${st[1]}</p></div>`).join('')}</div></div></section>

${s.changes ? `<section class="sec ${s.scorecard ? '' : 'linen'}"><div class="wrap split top"><div>${label('What changes')}<h2 class="h2">Before and after ${s.name.split(' ')[0]}.</h2><p class="lead" style="margin-top:22px">Switch the view to see what moves when the context layer arrives.</p></div><div class="ba" id="ba" data-reveal><div class="toggle"><button type="button" class="on" data-v="before">Today</button><button type="button" data-v="after">With ${s.name.split(' ')[0]}</button></div><div class="rows">${s.changes.map(c => `<div class="r"><span class="a">${c[0]}</span><span class="t"><span class="before">${c[1]}</span><span class="after">${c[2]}</span></span></div>`).join('')}</div></div></div></section>` : ''}

${s.agents ? `<section class="sec"><div class="wrap"><div class="head">${label('Agents that act, with your approval')}<h2 class="h2">Six governed agents.</h2></div><div class="grid g3">${s.agents.map(a => `<div class="card" data-reveal><div class="icon">${ic('bot')}</div><div class="h4">${a[0]}</div><p>${a[1]}</p><span class="chip" style="margin-top:16px">${a[2]}</span></div>`).join('')}</div></div></section>` : ''}

${s.approvals ? `<section class="sec"><div class="wrap split top"><div>${label('Five locked approvals')}<h2 class="h2">${s.also[0]}</h2></div><div class="grid" style="gap:10px">${s.approvals.map(a => `<div class="office-row" data-reveal><b style="font-size:18px">${a}</b>${ic('shield', 'ic')}</div>`).join('')}<p class="small" style="margin-top:10px">Measured benefits stay separate from modelled ones until a local pilot proves them.</p></div></div></section>` : ''}

${s.matrix ? `<section class="sec"><div class="wrap"><div class="head">${label('Smart solutions portfolio')}<h2 class="h2">Every domain, unified.</h2></div><div class="matrix">${s.matrix.map(m => `<div class="card" data-reveal><div class="h4" style="margin-top:0">${m[0]}</div><ul>${m[1].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}<div class="card" data-reveal style="background:linear-gradient(140deg,var(--royal),var(--cobalt));color:#fff"><div class="h4" style="margin-top:0">One Platform</div><ul>${['Every domain, unified', 'Real-time and predictive', 'Adaptable by design'].map(x => `<li style="color:rgba(255,255,255,.88)">${x}</li>`).join('')}</ul></div></div></div></section>` : ''}

${s.governance ? `<section class="sec"><div class="wrap split"><div>${label('PYXON Governance')}<h2 class="h2">${s.governance.title}</h2><p class="lead" style="margin-top:22px">${s.governance.text}</p><div style="margin-top:22px">${s.governance.code.map(c => `<span class="code">${c}</span>`).join('')}</div><a class="link" style="margin-top:22px" href="${D.links.aigp}" target="_blank" rel="noopener">Try the free AIGP practice exam on pyxon.ai ${ic('ext', 'ic')}</a></div><div>${filmBlock('shield', 'governance', '2BEjTe-23qk', 'Score AI Before You Deploy: PYXON Governance')}</div></div></section>` : ''}

${hasFilm && !s.governance && !s.sectors ? `<section class="sec tight"><div class="wrap">${filmBlock(s.loop, s.film, s.yt, s.name + ', the video')}</div></section>` : ''}
${(() => { const more = vids().filter(f => f.sol === s.id && f.film !== s.film); return more.length ? `<section class="sec tight"><div class="wrap"><div class="head">${label('More videos')}<h2 class="h2">See ${esc(s.name)} explained.</h2></div><div class="grid g3">${more.map(filmTile).join('')}</div></div></section>` : ''; })()}

<section class="sec linen"><div class="wrap"><div class="split head"><div>${label('Also inside')}<h2 class="h2">${s.also[0]}</h2></div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-self:end" data-reveal>${s.also.slice(1).map(a => `<span class="chip">${a}</span>`).join('')}</div></div>
  <div class="docs">${docsFor(s)}</div></div></section>

<section class="sec tight"><div class="wrap"><a href="#${next.id}" class="sol-card next-card" style="width:100%" data-cursor="Next">${solMedia(next)}<span class="by">Next solution</span><span class="go" style="opacity:1;transform:none">${arrow}</span><div class="in"><div class="k">${next.short}</div><h3>${next.name}</h3><p>${next.tagline}</p></div></a></div></section>
${ctaSec(`Start with one ${s.short.toLowerCase()} decision.`)}`;
}

function docsFor(s) {
  const out = []; const done = new Set();
  s.docs.forEach(f => {
    if (done.has(f)) return;
    if (f.endsWith('-en')) { const ar = f.replace(/-en$/, '-ar'); done.add(ar); out.push(docPair(f, s.docs.includes(ar) ? ar : null, (D.docTitles[f] || [f])[0])); }
    else out.push(docCard(f));
    done.add(f);
  });
  out.push(docPair('pyxon-eye-brief-2026-en', 'pyxon-eye-brief-2026-ar', 'PYXON-Eye Solution Brief'));
  out.push(docPair('pyxon-corporate-profile-2026-en', 'pyxon-corporate-profile-2026-ar', 'Corporate Profile 2026'));
  out.push(docCard('pyxon-eye-sheet-2d'));
  return out.join('');
}

/* ---------- LABS ---------- */
function pageLabs() {
  return `
<section class="sub-hero">
  <div class="bg"><img src="assets/img/labs-flask.webp" alt=""></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>AI Labs</span></div>
    ${label('PYXON AI Labs')}
    <h1 class="h1" data-split>${words('Research that ships.')}</h1>
    <p class="lead" data-reveal>Genuine AI products, from small, vision and speech models to embeddings, governance and agents: built in the Labs and measured on public benchmarks.</p>
    <div class="cta" data-reveal><a class="btn" href="${D.links.labs}" target="_blank" rel="noopener">Visit pyxon.ai ${ic('ext', 'ic')}</a><a class="btn ghost" href="${docUrl('pyxon-ai-labs-flyer')}" target="_blank" rel="noopener">Labs flyer (PDF)</a></div>
  </div>
</section>
<section class="sec"><div class="wrap"><div class="split head"><div>${label('Genuine AI products')}<h2 class="h2">Eight genuine products, one research engine.</h2></div><p class="lead" data-reveal>Arabic-first by design. Native Arabic reasoning, not translation.</p></div><div class="grid g4">${D.labsProducts.map(p => `<div class="card" data-reveal><div class="icon">${ic(p.icon)}</div><div class="h4">${p.title}</div><p>${p.text}</p></div>`).join('')}</div></div></section>
<section class="sec linen"><div class="wrap">
  <div class="split head"><div>${label('Balsam benchmark')}<h2 class="h2">Measured on the Balsam benchmark of the King Salman Global Academy for Arabic Language.</h2></div><div data-reveal><div class="giant" style="font-size:clamp(100px,14vw,220px)"><span class="num" data-count="1.5" data-dec="1">0</span><span class="unit">B</span></div><p class="lead">Runs on a device or one CPU server, and scores ahead of models up to 150 times its size.</p></div></div>
  ${balsamCards(0)}
  <div class="grid g2" style="margin-top:30px"><div data-reveal><div class="h4">Measured, not claimed</div><p class="body" style="margin-top:6px">Balsam v2, the Arabic LLM benchmark of the King Salman Global Academy for Arabic Language.</p></div><div data-reveal><div class="h4">Clear about the scope</div><p class="body" style="margin-top:6px">Category wins, not the overall average: built for extraction, transfer and summarisation inside your context.</p></div></div>
  <a class="link" style="margin-top:26px" href="${D.links.balsam}" target="_blank" rel="noopener">Balsam leaderboard, version 2 ${ic('ext', 'ic')}</a>
</div></section>
${interlude('Measured, not claimed.')}
<section class="sec"><div class="wrap"><div class="head">${label('Research output')}<h2 class="h2">Original research, published and in review.</h2></div><div class="papers">${D.papers.map(p => `<div class="paper" data-reveal><span class="st ${p.status === 'Published' ? 'pub' : ''}">${p.status}</span><div><h4>${p.title}</h4><p>${p.note}</p><p class="small">${p.venue}</p></div>${p.key ? `<a class="btn ghost sm" href="${D.links[p.key]}" target="_blank" rel="noopener">Springer ${ic('ext', 'ic')}</a>` : '<span></span>'}</div>`).join('')}</div></div></section>
<section class="sec linen"><div class="wrap"><div class="head">${label('Downloads')}<h2 class="h2">From the Labs.</h2></div><div class="docs">${D.docs.labs.map(d => docCard(d.file)).join('')}</div></div></section>
${ctaSec('Put Arabic-first AI to work on your own data.')}`;
}

/* ---------- COMPANY ---------- */
function pageCompany() {
  return `
<section class="sub-hero">
  <div class="bg"><video class="lazyv gen" muted loop playsinline preload="none" poster="assets/img/gen-global.webp" data-src="assets/video/global.mp4" data-fallback="assets/img/loom-room.webp"></video></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Company</span></div>
    ${label('About PYXON')}
    <h1 class="h1" data-split>${words('From IT services to an AI-native framework.')}</h1>
    <p class="lead" data-reveal>PYXON is an AI company. We build PYXON-Eye and the solutions on it for governments and enterprises, with a global partner network that includes Microsoft, AWS, Cohere and Huawei.</p>
  </div>
</section>
<section class="sec tight vm-sec"><div class="wrap"><div class="vm">
  <div class="vm-col" data-reveal>${label('Our vision')}<p class="vm-text">${D.vision}</p></div>
  <div class="vm-col" data-reveal>${label('Our mission')}<h2 class="h3">${D.mission.title}</h2><p class="body">${D.mission.text}</p></div>
</div></div></section>
<section class="sec"><div class="wrap"><div class="head">${label('Our journey')}<h2 class="h2">Three stages. One direction.</h2></div>
  <div class="journey3">${D.journey.map(j => `<div class="j" data-reveal><span class="yr">${j.year}</span><div class="st">${j.stage}</div><div class="h3">${j.title}</div><p class="body" style="margin-top:8px">${j.text}</p></div>`).join('')}</div>
  <div class="grid g3" style="margin-top:60px">${D.pillars.map(p => `<div class="card" data-reveal><div class="h4" style="margin-top:0">${p.title}</div><p>${p.text}</p></div>`).join('')}</div>
</div></section>
<section class="sec globe-sec" id="globalSec"><div class="wrap globe-wrap"><div>${label('Global presence')}<h2 class="h1">Worldwide reach.</h2><p class="lead">Deployable in any country, in your environment, with global technology partners, research collaborations across universities, and two solutions on Microsoft Marketplace.</p><div class="regions">${regionsGrid()}</div></div><div class="globe-box" id="globeBox" data-cursor="Drag"><div class="glabels" id="glabels"></div></div></div></section>
${interlude('Global by design. Local by deployment.', 'Your data stays in your country, under your rules. Our reach goes everywhere else.')}
<section class="sec linen"><div class="wrap"><div class="split head"><div>${label('Why PYXON')}<h2 class="h2">Built differently, by design.</h2></div><p class="lead" data-reveal>Six reasons governments and enterprises choose PYXON.</p></div><div class="grid g3">${D.why.map(w => `<div class="card" data-reveal><div class="icon">${ic(w.icon)}</div><div class="h4">${w.title}</div><p>${w.text}</p></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><div class="split head"><div>${label('Solutions and services')}<h2 class="h2">Industry-specific solutions, powered by AI.</h2></div></div><div class="grid g3">${D.services.map((s, i) => `<div class="card" data-reveal><div class="icon">${ic(['context', 'cpu', 'stack', 'globe', 'note'][i])}</div><div class="h4">${s.title}</div><p>${s.text}</p></div>`).join('')}</div></div></section>
<section class="sec linen"><div class="wrap"><div class="split head"><div>${label('Go to market')}<h2 class="h2">Two solutions on Microsoft Marketplace.</h2></div><p class="lead" data-reveal>Procurement through the Marketplace, for Microsoft customers worldwide.</p></div>${marketplace()}</div></section>
<section class="sec"><div class="wrap split"><div>${label('Careers')}<h2 class="h2">Build genuine AI with us.</h2><p class="lead" style="margin-top:22px">Scientists, architects and engineers who want their research to ship. Send your profile and the work you are proudest of.</p></div><div class="card" data-reveal><div class="h4" style="margin-top:0">Write to us</div><p>Careers: <b>${D.careersEmail}</b></p><p>General: <b>${D.email}</b></p><div class="cta" style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="#careers">See careers at PYXON</a><a class="btn ghost" href="mailto:${D.careersEmail}">Email ${D.careersEmail}</a></div></div></div></section>
${ctaSec()}`;
}

/* ---------- VIDEOS ---------- */
function vids() { return D.films.filter(f => !f.needsPyxi || D.pyxiLaunch); }
function regionsGrid() { return D.regions.map(r => `<div class="region" data-reveal><b>${r.name}</b><span>${r.cities}</span></div>`).join(''); }
function pageVideos() {
  const groups = ['PYXON and PYXON-Eye', 'Demos', 'Solutions', 'Events and moments', 'Partners'];
  const lead = D.pyxiLaunch ? filmBlock('', 'pyxi-launch', '', 'Meet PYXI: Small wings. Big possibilities.', 'assets/pyxi/pyxi-fly.webp') : filmBlock('loom', 'loom', '_7J3R_PWp84', 'The Loom: Intelligence Built for Reality');
  const leadId = D.pyxiLaunch ? 'pyxi' : 'brand';
  return `
<section class="sub-hero" style="min-height:70vh">
  <div class="bg"><img src="assets/video/loom.webp" alt=""></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Videos</span></div>
    ${label('See PYXON in action')}
    <h1 class="h1" data-split>${words('The PYXON video library.')}</h1>
    <p class="lead" data-reveal>Brand videos, solution videos and moments from the events we attended. New videos go to the PYXON YouTube channel first.</p>
    <div class="cta" data-reveal><a class="btn" href="${D.links.youtube}" target="_blank" rel="noopener">YouTube, @pyxonai ${ic('ext', 'ic')}</a></div>
  </div>
</section>
<section class="sec tight"><div class="wrap">${lead}</div></section>
${groups.map(g => { const list = vids().filter(f => f.group === g && f.id !== leadId); return list.length ? `<section class="sec tight vgroup"><div class="wrap"><div class="head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap"><h2 class="h2">${g}.</h2><span class="small">${list.length} ${list.length > 1 ? 'videos' : 'video'}</span></div>${list.length === 1 ? filmBlock(list[0].loop || '', list[0].film, list[0].yt, list[0].title, list[0].poster) : `<div class="grid ${list.length === 2 ? 'g2' : 'g3'}">${list.map(filmTile).join('')}</div>`}</div></section>` : ''; }).join('')}
${ctaSec()}`;
}

/* ---------- PARTNERS ---------- */
function pagePartners() {
  return `
<section class="sub-hero" style="min-height:70vh">
  <div class="bg"><img src="assets/img/gen-solutions.webp" alt="" onerror="this.src='assets/img/loom-room.webp'"></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Partners</span></div>
    ${label('Partners')}
    <h1 class="h1" data-split>${words('One platform. Woven into the world\'s technology.')}</h1>
    <p class="lead" data-reveal>PYXON-Eye is model-agnostic and cloud-agnostic. Our partners let governments and enterprises run it on the cloud, models and marketplace they already trust.</p>
  </div>
</section>
<section class="sec tight"><div class="wrap">
  <div class="partner-wall" data-reveal>${D.partners.map(p => `<button type="button" class="pw" data-goto="p-${p.id}"><img src="${p.logo}" alt="${p.name}"></button>`).join('')}</div>
  <div class="partners">${D.partners.map((p, i) => `
    <article class="partner" id="p-${p.id}" data-reveal>
      <div class="logo-tile"><img src="${p.logo}" alt="${p.name}"></div>
      <div class="ptext"><span class="chip">${p.role}</span><h2 class="h3">PYXON and ${p.name}</h2><p class="body">${p.text}</p>${p.link ? `<a class="link" href="${D.links[p.link]}" target="_blank" rel="noopener">${p.linkText} ${ic('ext', 'ic')}</a>` : ''}</div>
    </article>`).join('')}</div>
</div></section>
${interlude('Any model. Any cloud. Your rules.', 'Partners extend where PYXON-Eye can run. Your data still stays where you decide.')}
<section class="sec linen"><div class="wrap split"><div>${label('Become a partner')}<h2 class="h2">Build on PYXON-Eye with us.</h2><p class="lead" style="margin-top:22px">Technology, cloud, integration and channel partners: bring PYXON-Eye and its solution families to your customers.</p></div><div class="card" data-reveal><div class="h4" style="margin-top:0">Talk to the partnerships team</div><p>Email <b>${D.email}</b> with your company, your market and the customers you serve.</p><a class="btn" style="margin-top:18px" href="#contact">Start the conversation ${arrow}</a></div></div></section>
${ctaSec()}`;
}

/* ---------- NEWS ---------- */
function newsCard(n, big) {
  const media = n.contain ? `<div class="nimg contain"><img src="${n.img}" alt="" loading="lazy"></div>` : `<div class="nimg"><img src="${n.img}" alt="" loading="lazy"></div>`;
  const act = n.video ? `<button class="link" type="button" data-film="${n.video}" data-yt="${n.yt || ''}" data-title="${esc(n.title.replace(/\.$/, ''))}">${ic('play', 'ic')} Watch the video</button>`
    : n.url ? `<a class="link" href="${n.url}" target="_blank" rel="noopener">${n.linkText} ${ic('ext', 'ic')}</a>`
    : n.link ? (n.link.startsWith('#') ? `<a class="link" href="${n.link}">${n.linkText} ${arrow}</a>` : `<a class="link" href="${D.links[n.link]}" target="_blank" rel="noopener">${n.linkText} ${ic('ext', 'ic')}</a>`) : '';
  return `<article class="news-card${big ? ' big' : ''}" data-k="${n.cat}" data-reveal>${media}<div class="nbody"><div class="nmeta"><span class="chip">${n.cat}</span><span>${n.date}${n.place ? `, ${n.place}` : ''}</span></div><h3 class="${big ? 'h2' : 'h4'}">${n.title}</h3><p>${n.text}</p>${act}</div></article>`;
}
function pageNews() {
  const list = D.news.filter(n => !n.needsPyxi || D.pyxiLaunch);
  const cats = ['All', 'Events', 'Company', 'Research and Labs'];
  return `
<section class="sub-hero" style="min-height:70vh">
  <div class="bg"><img src="assets/img/loom-room.webp" alt=""></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>News</span></div>
    ${label('News and events')}
    <h1 class="h1" data-split>${words('What we built, and where we showed it.')}</h1>
    <p class="lead" data-reveal>Every event we attended, every release from PYXON AI Labs and the news from PYXON, newest first.</p>
  </div>
</section>
<section class="sec tight"><div class="wrap">
  ${newsCard(list[0], true)}
  <div class="filters" id="filters" style="margin-top:56px">${cats.map((c, i) => `<button type="button" class="${i ? '' : 'on'}" data-k="${c}">${c}</button>`).join('')}</div>
  <div class="news-grid" id="docGrid">${list.slice(1).map(n => newsCard(n)).join('')}</div>
</div></section>
${ctaSec()}`;
}

/* ---------- RESOURCES ---------- */
function pageResources() {
  const all = [];
  D.docs.profiles.forEach(d => all.push({ f: d.file, t: d.title, k: 'Company', ar: d.pair }));
  all.push({ f: 'pyxon-eye-brief-2026-en', t: 'PYXON-Eye Solution Brief', k: 'PYXON-Eye', ar: 'pyxon-eye-brief-2026-ar' });
  D.solutions.forEach(s => s.docs.forEach(f => {
    if (f.endsWith('-ar')) return;
    const t = (D.docTitles[f] || [f])[0];
    all.push({ f, t, k: 'Solution briefs', ar: f.endsWith('-en') ? f.replace(/-en$/, '-ar') : null });
  }));
  ['pyxon-eye-sheet-2d'].forEach(f => all.push({ f, t: D.docTitles[f][0], k: 'PYXON-Eye' }));
  D.docs.labs.forEach(d => all.push({ f: d.file, t: d.title, k: 'AI Labs' }));
  const seen = new Set(); const list = all.filter(x => !seen.has(x.f) && seen.add(x.f));
  const cats = ['All', 'Company', 'PYXON-Eye', 'Solution briefs', 'AI Labs'];
  return `
<section class="sub-hero" style="min-height:70vh">
  <div class="bg"><img src="assets/img/cubes-shelf.webp" alt=""></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Resources</span></div>
    ${label('Resources')}
    <h1 class="h1" data-split>${words('Every profile, sheet and brief.')}</h1>
    <p class="lead" data-reveal>The latest corporate and core profiles, the PYXON-Eye sheet, a solution brief for every family and the Labs flyer.</p>
  </div>
</section>
<section class="sec tight"><div class="wrap">
  <div class="filters" id="filters">${cats.map((c, i) => `<button type="button" class="${i ? '' : 'on'}" data-k="${c}">${c}</button>`).join('')}</div>
  <div class="docs" id="docGrid">${list.map(x => `<div data-k="${x.k}">${docPair(x.f, x.ar, x.t)}</div>`).join('')}</div>
</div></section>
${ctaSec()}`;
}

/* ---------- CONTACT ---------- */
function pageContact() {
  return `
<section class="sub-hero" style="min-height:auto;padding-bottom:40px">
  <div class="bg"><img src="assets/img/gen-contact.webp" alt="" onerror="this.src='assets/img/loom-room.webp'"></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Contact</span></div>
    ${label('Talk to us')}
    <h1 class="h1" data-split>${words('Book a 30-minute walkthrough.')}</h1>
    <p class="lead" data-reveal>Tell us the decision you want to improve. We will show it working on PYXON-Eye, and scope a pilot inside your environment.</p>
  </div>
</section>
<section class="sec tight"><div class="wrap split top">
  <form class="contact card" id="contactForm" data-reveal novalidate>
    <label>Full name<input name="name" required autocomplete="name"></label>
    <label>Work email<input name="email" type="email" required autocomplete="email"></label>
    <label>Organisation<input name="org" autocomplete="organization" placeholder="Optional"></label>
    <label>Country<input name="country" autocomplete="country-name" placeholder="Optional"></label>
    <label class="full">Solution of interest<select name="solution"><option>PYXON-Eye platform</option>${D.solutions.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}<option>PYXON AI Labs</option></select></label>
    <label class="full">The decision you want to improve<textarea name="msg" placeholder="Optional"></textarea></label>
    <div class="full form-foot"><button class="btn" type="submit">Send request ${arrow}</button><p class="small form-privacy">We use your details only to answer your request. Read our <a class="link" href="#privacy">Privacy Policy</a>.</p></div>
    <div class="full form-note" id="formNote" aria-live="polite"></div>
  </form>
  <div style="display:grid;gap:14px">
    <div class="card next-steps" data-reveal><div class="h4" style="margin-top:0">What happens next</div><ol><li>We read your request and reply by email.</li><li>A 30-minute walkthrough of PYXON-Eye on your use case.</li><li>A pilot scoped inside your own environment.</li></ol></div>
    <div class="card" data-reveal><div class="h4" style="margin-top:0">Write to us</div><p class="mail-row"><a class="link" href="mailto:${D.email}" translate="no">${D.email}</a><button type="button" class="chip copy-mail" data-copy="${D.email}">Copy email</button></p><p class="small" style="margin-top:14px">Research and models: <a class="link" href="${D.links.labs}" target="_blank" rel="noopener">pyxon.ai</a></p></div>
    <div class="card" data-reveal style="display:flex;gap:16px;align-items:center"><div class="pyxi-btn" style="flex:0 0 auto;width:72px;height:72px" id="contactPyxi"><span class="eye"></span></div><p>PYXI will make sure your request reaches the right team.</p></div>
  </div>
</div></section>`;
}

/* ---------- ROUTER ---------- */
/* ---------- careers ---------- */
function pageCareers() {
  const C = D.careers;
  return `
<section class="sub-hero" style="min-height:78vh">
  <div class="bg"><img src="assets/img/labs-flask.webp" alt="" onerror="this.src='assets/img/loom-room.webp'"></div>
  <div class="wrap">
    <div class="crumbs"><a href="#home">PYXON</a><span>/</span><a href="#company">Company</a><span>/</span><span>Careers</span></div>
    ${label('Build with us')}
    <h1 class="h1" data-split>${words('For people who want their AI to actually ship.')}</h1>
    <p class="lead" data-reveal>PYXON is hiring across engineering, AI research, business development, design and operations. We do not do innovation theatre. We deploy.</p>
    <div class="cta" data-reveal><a class="btn" href="mailto:${D.careersEmail}">Email ${D.careersEmail}</a></div>
  </div>
</section>
<section class="sec"><div class="wrap"><div class="split head"><div>${label('Why PYXON')}<h2 class="h2">Work that ships.</h2></div></div>
  <div class="grid g4 careers-why">${C.why.map(w => `<div class="card" data-reveal><div class="h4" style="margin-top:0">${w[0]}</div><p>${w[1]}</p></div>`).join('')}</div>
</div></section>
<section class="sec linen"><div class="wrap"><div class="split head"><div>${label('Three ways to join')}<h2 class="h2">Find your way in.</h2></div></div>
  <div class="grid g3">${C.ways.map(w => `<div class="card" data-reveal><div class="h3" style="margin-top:0">${w[0]}</div><p class="body" style="margin-top:12px">${w[1]}</p></div>`).join('')}</div>
</div></section>
<section class="sec"><div class="wrap split"><div>${label('Don\'t see your role?')}<h2 class="h2">Send us what you would build.</h2><p class="lead" style="margin-top:22px">We hire for capability, not job descriptions. Send your profile and the work you are proudest of.</p></div>
  <div class="card" data-reveal><div class="h4" style="margin-top:0">Write to us</div><p>Careers: <b>${D.careersEmail}</b></p><a class="btn" style="margin-top:20px" href="mailto:${D.careersEmail}">Email ${D.careersEmail}</a></div></div></section>
${ctaSec()}`;
}

/* ---------- legal ---------- */
function pageLegal(key) {
  const L = D.legal[key], other = key === 'privacy' ? 'terms' : 'privacy';
  const block = s => (s.p || []).map(t => `<p>${t}</p>`).join('') + (s.ul ? `<ul>${s.ul.map(t => `<li>${t}</li>`).join('')}</ul>` : '') + (s.p2 || []).map(t => `<p>${t}</p>`).join('') + (s.ul2 ? `<ul>${s.ul2.map(t => `<li>${t}</li>`).join('')}</ul>` : '') + (s.contact ? `<p class="legal-contact"><b>PYXON</b><span>Email: <a href="mailto:${D.email}">${D.email}</a></span></p>` : '');
  return `
<section class="legal-hero"><div class="wrap">
  <div class="crumbs"><a href="#home">PYXON</a><span>/</span><span>Legal</span></div>
  <h1 class="h1">${esc(L.title)}</h1>
  <p class="legal-date">Last updated: ${L.updated}</p>
</div></section>
<section class="sec tight legal-sec"><div class="wrap legal-grid">
  <nav class="legal-toc" aria-label="On this page"><b>On this page</b><ol>${L.sections.map((s, i) => `<li><a href="#${key}" data-sec="${key}-${i + 1}">${esc(s.h)}</a></li>`).join('')}</ol>
    <a class="legal-other" href="#${other}">${esc(D.legal[other].title)}</a></nav>
  <article class="legal-body">
    ${L.intro.map(t => `<p class="legal-intro">${t}</p>`).join('')}
    <p class="legal-lang-note">This translation is provided for convenience. The English version prevails.</p>
    ${L.sections.map((s, i) => `<section id="${key}-${i + 1}"><h2>${esc(s.h)}</h2>${block(s)}</section>`).join('')}
  </article>
</div></section>`;
}
const routes = { home: pageHome, platform: pagePlatform, solutions: pageSolutions, labs: pageLabs, company: pageCompany, videos: pageVideos, partners: pagePartners, news: pageNews, resources: pageResources, contact: pageContact, careers: pageCareers, privacy: () => pageLegal('privacy'), terms: () => pageLegal('terms') };
const titles = { home: 'PYXON | Intelligence Built for Reality', platform: 'PYXON-Eye | The contextual intelligence platform', solutions: 'Solutions | PYXON', labs: 'PYXON AI Labs | Research that ships', company: 'Company | PYXON', videos: 'Videos | PYXON', partners: 'Partners | PYXON', news: 'News | PYXON', resources: 'Resources | PYXON', contact: 'Contact | PYXON', careers: 'Careers | PYXON', privacy: 'Privacy Policy | PYXON', terms: 'Terms of Use | PYXON' };
let lenis = null, first = true, busy = false;

function currentRoute() { let h = (location.hash || '#home').slice(1); if (h === 'films') h = 'videos'; if (h === 'privacy-policy' || h === 'privacy-notice') h = 'privacy'; if (h === 'terms-of-use') h = 'terms'; if (h === 'about') h = 'company'; if (h.startsWith('p-')) h = 'partners'; return routes[h] || solById(h) ? h : 'home'; }

function render(route) {
  ScrollTrigger.getAll().forEach(t => t.kill());
  window.dispatchEvent(new CustomEvent('pyx:leave'));
  const main = $('#main');
  const s = solById(route);
  main.innerHTML = `<div class="page on" data-route="${route}">${s ? pageSolution(s) : routes[route]()}</div>`;
  if (window.PYXI18N) PYXI18N.apply(main);
  const ttl = s ? `${s.name} by PYXON-Eye | PYXON` : titles[route];
  if (window.PYXI18N) PYXI18N.setTitle(ttl); else document.title = ttl;
  $$('.nav [data-nav]').forEach(a => a.classList.toggle('on', !!(a.dataset.nav === route || (s && a.dataset.nav === 'solutions'))));
  window.PYXAPP.route = route;
  window.scrollTo(0, 0); if (lenis) lenis.scrollTo(0, { immediate: true });
  initPage(route);
  window.dispatchEvent(new CustomEvent('pyx:page', { detail: { route } }));
  ScrollTrigger.refresh();
}

function go(route) {
  if (busy) return;
  closeMega(); $('#mnav').classList.remove('open'); if (typeof openPyxi === 'function') openPyxi(false);
  if (first || REDUCE) { first = false; render(route); return; }
  busy = true;
  /* a quiet veil: the page fades to cream, one blue thread is drawn, the new page rises in */
  const lx = $('#loomx'), rib = $('#loomx .rib'), logo = $('#loomx .lx-logo');
  gsap.timeline({ onComplete: () => { busy = false; gsap.set(lx, { visibility: 'hidden' }); } })
    .set(lx, { visibility: 'visible', opacity: 0, clipPath: 'none' })
    .set(rib, { scaleX: 0, transformOrigin: 'center', opacity: 1 }).set(logo, { opacity: 0, y: 6 })
    .to(lx, { opacity: 1, duration: .38, ease: 'power2.inOut' })
    .to(rib, { scaleX: 1, duration: .55, ease: 'power3.inOut' }, '<.1')
    .to(logo, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, '<.15')
    .add(() => render(route))
    .to([logo, rib], { opacity: 0, duration: .25, ease: 'power1.in' }, '+=.08')
    .to(lx, { opacity: 0, duration: .45, ease: 'power2.inOut' }, '<.1');
}
window.addEventListener('hashchange', () => go(currentRoute()));
/* a new language: re-render the page so headings, motion and layout direction are rebuilt */
window.addEventListener('pyx:lang', () => { if (!first) { const y = lenis ? lenis.scroll : scrollY; render(currentRoute()); requestAnimationFrame(() => { ScrollTrigger.refresh(); if (y > 0) { if (lenis) lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y); } }); } });
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const h = a.getAttribute('href').slice(1);
  if (!h) return;
  if (('#' + h) === location.hash) { e.preventDefault(); go(currentRoute()); }
  if (a.dataset.solution) sessionStorageSafe('pyxSolution', a.dataset.solution);
});
function sessionStorageSafe(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } }
function sessionGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }

/* ---------- PAGE INIT ---------- */
function initPage(route) {
  lazyVideos();
  reveals();
  counters();
  splitHeads();
  drawPaths();
  bindFilms();
  bindMagnets();
  if ($('#loomCanvas')) initLoom();
  if ($('#gapSec')) initGap();
  if ($('#stackSec')) initStack();
  if ($('#strip')) initStrip();
  if ($('#flow')) initFlow();
  if ($('#studio')) initStudio();
  if ($('.balsam')) initBalsam();
  if ($('#ba')) initBA();
  if ($('#filters')) initFilters();
  if ($('#contactForm')) initForm();
  if ($('#pyxiStage')) initPyxiStage();
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.goto); if (t) { if (lenis) lenis.scrollTo(t, { offset: -110 }); else t.scrollIntoView({ behavior: 'smooth' }); } }));
  $$('[data-open-pyxi]').forEach(b => b.addEventListener('click', () => openPyxi(true)));
  tickClocks();
}

/* lazy videos: play only when visible */
let vio;
function lazyVideos() {
  if (vio) vio.disconnect();
  vio = new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    if (en.isIntersecting) {
      if (!v.src && v.dataset.src) {
        v.src = v.dataset.src;
        v.addEventListener('error', () => { if (v.dataset.fallback) { const img = new Image(); img.src = v.poster || v.dataset.fallback; img.className = v.className; img.onerror = () => { img.src = v.dataset.fallback; }; img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'; v.replaceWith(img); } }, { once: true });
      }
      if (!REDUCE) tryPlay(v);
    } else if (!v.paused) v.pause();
  }), { rootMargin: '200px 0px' });
  $$('video.lazyv').forEach(v => vio.observe(v));
}

function reveals() {
  const els = $$('[data-reveal]');
  if (REDUCE) { els.forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }); return; }
  ScrollTrigger.batch(els, {
    start: 'top 88%', once: true,
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true })
  });
}

function splitHeads() {
  $$('[data-split]').forEach(h => {
    const inner = $$('.word>span', h);
    if (REDUCE) return;
    gsap.set(h, { overflow: 'visible' });
    $$('.word', h).forEach(w => { w.style.overflow = 'hidden'; w.style.verticalAlign = 'top'; w.style.paddingBottom = '.08em'; });
    gsap.fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
    gsap.fromTo(h, { fontVariationSettings: '"wdth" 76, "wght" 340' }, { fontVariationSettings: '"wdth" 96, "wght" 620', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 86%', once: true } });
  });
}

function counters() {
  $$('[data-count]').forEach(el => {
    const to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    const fmt = v => { const t = v.toFixed(dec); return /^(de|fr|es)$/.test(document.documentElement.lang) ? t.replace('.', ',') : t; };
    if (REDUCE) { el.textContent = fmt(to); return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = fmt(o.v); } });
  });
}

function drawPaths() {
  $$('path[data-draw]').forEach(p => {
    const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: p.closest('section'), start: 'top 70%', end: 'center 50%', scrub: 1 } });
  });
}

/* ---------- HERO LOOM SEQUENCE ---------- */
const FRAMES = 293; const frames = []; let loomLoaded = 0;
function framePath(i) { return `assets/loom/${String(i + 1).padStart(3, '0')}.webp`; }
function preloadLoom(onProgress) {
  return new Promise(res => {
    let need = 40;
    for (let i = 0; i < FRAMES; i++) {
      const im = new Image(); im.decoding = 'async';
      im.onload = im.onerror = () => { loomLoaded++; onProgress && onProgress(loomLoaded / FRAMES); if (loomLoaded === need) res(); };
      im.src = framePath(i); frames[i] = im;
    }
    setTimeout(res, 6000);
  });
}
function initLoom() {
  const cv = $('#loomCanvas'), ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  let cur = -1, dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; cur = -1; draw(state.f); };
  const state = { f: 0, p: 0 };
  let curK = -1;
  function draw(f) {
    /* the opening frame starts framed to the right, beside the headline, and pans to the centred framing as the weave begins */
    const wide = cv.width >= cv.height, t = Math.min(1, (state.p || 0) / .28), e = 1 - (1 - t) * (1 - t), k = wide ? (RTL() ? 1 - .38 * e : .62 * e) : .42;
    let i = Math.round(f); if (i === cur && Math.abs(k - curK) < .002) return; curK = k;
    let im = frames[i];
    if (!im || !im.complete || !im.naturalWidth) { for (let k = i; k >= 0; k--) if (frames[k] && frames[k].complete && frames[k].naturalWidth) { im = frames[k]; break; } }
    if (!im) return;
    cur = i;
    const W = cv.width, H = cv.height, r = Math.max(W / im.naturalWidth, H / im.naturalHeight);
    const w = im.naturalWidth * r, h = im.naturalHeight * r;
    ctx.imageSmoothingQuality = 'high'; ctx.clearRect(0, 0, W, H); ctx.drawImage(im, (W - w) * k, (H - h) / 2, w, h);
  }
  addEventListener('resize', size); size();
  const chaps = $$('.hero .chap');
  chaps.forEach(c => gsap.set(c, { opacity: 0, y: 30 }));
  gsap.set(chaps[0], { opacity: 1, y: 0 }); chaps[0].classList.add('on');
  // arrival: the loom comes up out of the paper with a slow push-in, the headline rises, then the actions settle in
  const ins = $$('.hero-in', chaps[0]), lead0 = $('.lead', chaps[0]), lab0 = $('.thread-label', chaps[0]);
  let breathe = null;
  if (!REDUCE) {
    const tl = gsap.timeline();
    tl.fromTo(cv, { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1, duration: 2.8, ease: 'expo.out' }, 0)
      .fromTo('.hero .veil', { opacity: .55 }, { opacity: 1, duration: 2.2, ease: 'power2.out' }, .2)
      .fromTo(lab0, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, .35)
      .fromTo($$('.word>span', chaps[0]), { yPercent: 110 }, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: .07 }, .45)
      .fromTo(lead0, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.15)
      .fromTo(ins, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .14 }, 1.4)
      .fromTo('.hero .meta, .hero .scrollcue', { opacity: 0 }, { opacity: 1, duration: 1 }, 1.8)
      .add(() => { breathe = gsap.to(cv, { scale: 1.045, xPercent: RTL() ? .8 : -.8, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1 }); }, 2.8);
  }
  $$('.word', chaps[0]).forEach(w => { w.style.overflow = 'hidden'; w.style.verticalAlign = 'top'; w.style.paddingBottom = '.06em'; });
  ScrollTrigger.create({
    trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: st => {
      const p = st.progress;
      state.p = p; state.f = p * (FRAMES - 1); draw(state.f);
      $('#heroBar').style.width = (p * 100) + '%';
      $('#cue').style.opacity = p > .03 ? 0 : 1;
      if (breathe) { if (p > .015 && !breathe.paused()) { breathe.pause(); gsap.to(cv, { scale: 1, xPercent: 0, duration: .8, ease: 'power2.out' }); } else if (p <= .015 && breathe.paused()) breathe.resume(); }
      chaps.forEach(c => {
        const a = +c.dataset.from, b = +c.dataset.to;
        const fadeIn = .035;
        let o = 0;
        if (p >= a && p <= b) o = Math.min(1, (p - a) / fadeIn, (b - p) / fadeIn);
        if (c === chaps[0]) o = p <= b ? Math.min(1, (b - p) / fadeIn) : 0;
        if (c === chaps[chaps.length - 1] && p >= a) o = Math.min(1, (p - a) / fadeIn);
        c.style.opacity = o; c.style.transform = `translateY(${(1 - o) * 26}px)`;
        c.classList.toggle('on', o > .5);
        c.style.fontVariationSettings = '';
        const h = c.querySelector('.h1,.h-mega'); if (h) h.style.fontVariationSettings = `"wdth" ${76 + o * 18}, "wght" ${360 + o * 270}`;
      });
      window.dispatchEvent(new CustomEvent('pyx:hero', { detail: { p } }));
    }
  });
}

/* ---------- GAP corridor ---------- */
function initGap() {
  const mobile = matchMedia('(max-width:900px)').matches;
  if (!window.PYXGap) return;
  if (mobile) {
    PYXGap.create($('#gapCv'), { fixed: 0, n: 240, reduce: REDUCE });
    $$('#gapSec .mscene').forEach(c => PYXGap.create(c, { fixed: +c.dataset.scene, n: 240, reduce: REDUCE }));
    return;
  }
  const items = $$('#gapSec .item'), dots = $$('#gapSec .dots b'), fin = $('#gapSec .final'), num = $('#gapNum'), cap = $('#gapSec .pcap');
  const scene = PYXGap.create($('#gapCv'), { n: 440, reduce: REDUCE });
  const cl = v => Math.max(0, Math.min(1, v));
  ScrollTrigger.create({
    trigger: '#gapSec', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: st => {
      const p = st.progress, n = items.length, seg = .86 / n;
      let cur = 0;
      items.forEach((it, i) => {
        const a = i * seg, b = a + seg; let o = 0;
        if (p >= a && p < b) { const t = (p - a) / seg; o = Math.min(1, t * 6, (1 - t) * 6); }
        if (p >= a) cur = i;
        it.style.opacity = o; it.style.transform = `translateY(${(1 - o) * 24}px)`;
        dots[i].style.width = cl((p - a) / seg) * 100 + '%';
      });
      const f = cl((p - .86) / .1); fin.style.opacity = f; fin.style.transform = `translateY(${(1 - f) * 24}px)`;
      scene.p = p;
      num.textContent = '0' + (cur + 1); cap.style.opacity = p > .86 ? 0 : 1;
    }
  });
}

/* ---------- 3D stack ---------- */
function initStack() {
  const slabs = $$('#rig .slab'), btns = $$('#layerInfo button');
  const setActive = l => { btns.forEach(b => b.classList.toggle('on', +b.dataset.l === l)); slabs.forEach((s, i) => s.classList.toggle('hot', i === l)); };
  btns.forEach(b => b.addEventListener('click', () => setActive(+b.dataset.l)));
  slabs.forEach((s, i) => s.addEventListener('click', () => setActive(i)));
  setActive(1);
  const mobile = matchMedia('(max-width:1020px)').matches;
  const apply = p => slabs.forEach((s, i) => { const z = (i - 1.5) * (30 + p * 120); s.style.transform = `translateZ(${z}px)`; });
  if (mobile) { apply(.8); return; }
  apply(0);
  ScrollTrigger.create({
    trigger: '#stackSec', start: 'top top', end: 'bottom bottom', scrub: .6,
    onUpdate: st => {
      const p = st.progress; apply(Math.min(1, p * 1.6));
      $('#rig').style.transform = `translate(-50%,-50%) rotateX(${58 - p * 6}deg) rotateZ(${-34 + p * 18}deg)`;
      const l = Math.min(3, Math.floor(p * 4.2)); setActive(l);
    }
  });
}

/* ---------- Horizontal solutions strip ---------- */
function initStrip() {
  if (matchMedia('(max-width:900px)').matches) return;
  const track = $('#track');
  const dist = () => track.scrollWidth - innerWidth;
  gsap.to(track, { x: () => RTL() ? dist() : -dist(), ease: 'none', scrollTrigger: { trigger: '#strip', start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true } });
  $$('.sol-card:not(.intro)', track).forEach(c => {
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`; });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
}

/* ---------- Particle flow (data stays, slice goes) ---------- */
function initFlow() {
  const box = $('#flow'), cv = $('canvas', box), ctx = cv.getContext('2d');
  let W, H, dpr = Math.min(devicePixelRatio || 1, 2), run = false, raf, L;
  const NAMES = ['ERP', 'CRM', 'Documents', 'Sensors', 'APIs', 'Public signals'];
  const srcs = NAMES.length, ps = [], outs = []; let tick = 0;
  const fam = () => { const l = document.documentElement.lang || ''; return l === 'ar' ? '"GE SS Two", Tahoma, sans-serif' : /^zh/.test(l) ? '"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif' : '"Myriad Variable Concept", Arial, sans-serif'; };
  function layout() {
    W = box.clientWidth; const vert = W < 620; box.classList.toggle('vert', vert);
    const pad = vert ? 18 : Math.max(24, W * .03), names = NAMES.map(T), chips = [];
    if (vert) {
      // phones: systems on top, the engine in the middle, the model below
      const cols = 3, gap = 8, cw = (W - pad * 2 - gap * (cols - 1)) / cols, ch = 30, top = 52;
      names.forEach((n, i) => chips.push({ n, x: pad + (i % cols) * (cw + gap), y: top + Math.floor(i / cols) * (ch + gap), w: cw, h: ch, ox: pad + (i % cols) * (cw + gap) + cw / 2, oy: top + Math.floor(i / cols) * (ch + gap) + ch }));
      const R = Math.min(W * .12, 50), ext = R * 1.56 + 3, cx = W / 2, cy = top + ch * 2 + gap + 54 + ext, lw = 124, lh = 46, ly = cy + ext + 34;
      H = ly + lh + 146;
      box.style.height = H + 'px';
      box.style.setProperty('--l2y', (top + ch * 2 + gap + 15) + 'px'); box.style.setProperty('--l3y', (ly + lh + 10) + 'px');
      L = { vert, pad, chips, cx, cy, R, llm: { x: cx - lw / 2, y: ly, w: lw, h: lh } };
    } else {
      box.style.height = ''; H = box.clientHeight;
      const cw = Math.min(176, W * .15), ch = Math.min(38, H * .07), gap = Math.min(14, H * .025), tot = srcs * ch + (srcs - 1) * gap, top = H * .56 - tot / 2;
      names.forEach((n, i) => chips.push({ n, x: pad, y: top + i * (ch + gap), w: cw, h: ch, ox: pad + cw, oy: top + i * (ch + gap) + ch / 2 }));
      const cx = W * .5, cy = H * .56, R = Math.min(W, H) * .15, lw = Math.min(170, W * .14), lh = Math.min(64, H * .12);
      L = { vert, pad, chips, cx, cy, R, llm: { x: W - pad - lw, y: cy - lh / 2, w: lw, h: lh } };
    }
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function spawn(rand) { return { s: Math.floor(Math.random() * srcs), t: rand ? Math.random() : 0, sp: .0028 + Math.random() * .003, j: (Math.random() - .5) * 26, ph: Math.random() * 6.28 }; }
  layout(); addEventListener('resize', layout); addEventListener('pyx:lang', () => setTimeout(() => { layout(); if (!run) frame(); }, 60));
  for (let i = 0; i < 220; i++) ps.push(spawn(true));
  function frame() {
    const { vert, chips, cx, cy, R, llm } = L, f = fam();
    ctx.clearRect(0, 0, W, H);
    // core rings and glow
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = `rgba(20,71,153,${.22 - k * .06})`; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(cx, cy, R + k * R * .28 + Math.sin(tick * .02 + k) * 2.5, 0, Math.PI * 2); ctx.stroke(); }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, 'rgba(14,111,214,.34)'); g.addColorStop(1, 'rgba(20,71,153,.03)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#144799'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    // particles: every system feeds the core
    ps.forEach((p, i) => {
      p.t += p.sp; const c = chips[p.s];
      const t = Math.min(1, p.t), e = t * t * (3 - 2 * t), w = Math.sin(t * 8 + p.ph) * 5 * (1 - e);
      const x = vert ? c.ox + (cx - c.ox) * e + w + p.j * .4 * (1 - e) : c.ox + (cx - c.ox) * e;
      const y = vert ? c.oy + (cy - c.oy) * e : c.oy + (cy - c.oy) * e + p.j * (1 - e) * e + w;
      ctx.fillStyle = `rgba(20,71,153,${.2 + .5 * (1 - e)})`; ctx.beginPath(); ctx.arc(x, y, vert ? 1.8 : 2.1, 0, Math.PI * 2); ctx.fill();
      if (p.t >= 1) { ps[i] = spawn(false); if (Math.random() < .06) outs.push({ t: 0 }); }
    });
    // source systems, labelled
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = RTL() ? 'rtl' : 'ltr';
    chips.forEach(c => {
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.strokeStyle = 'rgba(20,71,153,.16)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(c.x, c.y, c.w, c.h, c.h / 2); ctx.fill(); ctx.stroke();
      let fs = vert ? 12 : Math.max(12, Math.min(14.5, c.h * .4)); ctx.font = `600 ${fs}px ${f}`;
      while (ctx.measureText(c.n).width > c.w - 14 && fs > 9) { fs -= .5; ctx.font = `600 ${fs}px ${f}`; }
      ctx.fillStyle = '#3B4660'; ctx.fillText(c.n, c.x + c.w / 2, c.y + c.h / 2 + .5);
    });
    // the small slice that reaches the model
    const sx = vert ? cx : cx + R, sy = vert ? cy + R : cy, ex = vert ? cx : llm.x, ey = vert ? llm.y : cy;
    ctx.strokeStyle = 'rgba(0,198,224,.28)'; ctx.setLineDash([3, 5]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
    for (let i = outs.length - 1; i >= 0; i--) { const o = outs[i]; o.t += .014; const x = sx + (ex - sx) * o.t, y = sy + (ey - sy) * o.t; ctx.fillStyle = '#00C6E0'; ctx.shadowColor = '#00C6E0'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; if (o.t >= 1) outs.splice(i, 1); }
    // model box
    ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(20,71,153,.32)'; ctx.lineWidth = 1.4; ctx.shadowColor = 'rgba(20,71,153,.14)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.roundRect(llm.x, llm.y, llm.w, llm.h, Math.min(20, llm.h / 2)); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.stroke();
    ctx.fillStyle = '#144799'; ctx.font = `600 ${vert ? 15 : 16}px "Myriad Variable Concept", Arial, sans-serif`; ctx.fillText('LLM', llm.x + llm.w / 2, llm.y + llm.h / 2 + .5);
    tick++;
    if (run) raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver(([en]) => { const was = run; run = en.isIntersecting && !REDUCE; if (run && !was) frame(); else if (!run) cancelAnimationFrame(raf); }).observe(box);
  frame();
}

/* ---------- Studio mock ---------- */
function initStudio() {
  $$('#studio').forEach(st => {
    const msgs = $$('.msg', st), bars = $$('.bars b', st), ap = $('.approval', st);
    ScrollTrigger.create({ trigger: st, start: 'top 70%', once: true, onEnter: () => {
      gsap.to(msgs, { opacity: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .55 });
      if (ap) gsap.from(ap, { opacity: 0, y: 10, delay: msgs.length * .55, duration: .6 });
      bars.forEach((b, i) => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 300 + i * 120));
    } });
  });
}
function initBalsam() {
  $$('.balsam').forEach(bl => ScrollTrigger.create({ trigger: bl, start: 'top 75%', once: true, onEnter: () => $$('.bar i', bl).forEach((b, i) => setTimeout(() => { b.style.width = Math.min(100, b.dataset.w) + '%'; }, i * 90)) }));
}
function initBA() {
  const ba = $('#ba');
  $$('.toggle button', ba).forEach(b => b.addEventListener('click', () => { $$('.toggle button', ba).forEach(x => x.classList.toggle('on', x === b)); ba.classList.toggle('after', b.dataset.v === 'after'); }));
  ScrollTrigger.create({ trigger: ba, start: 'top 55%', once: true, onEnter: () => setTimeout(() => $$('.toggle button', ba)[1].click(), 1400) });
}
function initFilters() {
  $$('#filters button').forEach(b => b.addEventListener('click', () => {
    $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('#docGrid>[data-k]').forEach(d => { d.style.display = (b.dataset.k === 'All' || d.dataset.k === b.dataset.k) ? '' : 'none'; });
    ScrollTrigger.refresh();
  }));
}
function initForm() {
  const f = $('#contactForm'); const pre = sessionGet('pyxSolution'); if (pre) f.solution.value = pre;
  const copy = (txt, btn) => {
    const done = () => { const o = btn.textContent; btn.textContent = T('Copied'); setTimeout(() => { btn.textContent = o; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallback());
    else fallback();
    function fallback() { const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { } ta.remove(); }
  };
  $$('.copy-mail').forEach(b => b.addEventListener('click', () => copy(b.dataset.copy, b)));
  f.addEventListener('submit', e => {
    e.preventDefault();
    const note = $('#formNote');
    const bad = [];
    if (!f.name.value.trim()) bad.push(f.name);
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) bad.push(f.email);
    $$('input', f).forEach(i => i.classList.toggle('bad', bad.includes(i)));
    if (bad.length) { note.className = 'full form-note err'; note.textContent = T('Add your name and a valid work email so we can reply.'); bad[0].focus(); return; }
    const sol = f.solution.options[f.solution.selectedIndex].text;
    const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\nOrganisation: ${f.org.value}\nCountry: ${f.country.value}\nSolution: ${sol}\n\n${f.msg.value}`;
    const subj = 'Walkthrough request: ' + sol;
    const href = `mailto:${D.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    note.className = 'full form-note ok';
    note.innerHTML = `<p>${T('Request ready. If your email app did not open, copy it and send it to us.')} <b translate="no">${D.email}</b></p><div class="acts"><button type="button" class="chip" data-act="copy">${T('Copy request')}</button><a class="chip" href="${href}">${T('Open email app')}</a></div>`;
    $('[data-act=copy]', note).addEventListener('click', ev => copy(`To: ${D.email}\nSubject: ${subj}\n\n${body}`, ev.currentTarget));
    location.href = href;
  });
  $$('input', f).forEach(i => i.addEventListener('input', () => i.classList.remove('bad')));
}

/* ---------- films modal ---------- */
function bindFilms() {
  $$('[data-film]').forEach(el => el.addEventListener('click', () => openFilm(el.dataset.film, el.dataset.yt, el.dataset.title)));
}
function openFilm(film, yt, title) {
  const m = $('#modal'), media = $('#modalMedia');
  const onSite = /pyxon\.(com|ai)$/.test(location.hostname);
  media.innerHTML = (onSite && yt) ? `<iframe src="https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="${esc(title)}"></iframe>` : `<video src="assets/film/${film}.mp4" controls autoplay playsinline></video>`;
  $('#modalTitle').textContent = title || '';
  const a = $('#modalYt'); a.style.display = yt ? '' : 'none'; a.href = yt ? `https://youtu.be/${yt}` : '#';
  m.classList.add('on'); if (lenis) lenis.stop();
}
function closeFilm() { const m = $('#modal'); m.classList.remove('on'); $('#modalMedia').innerHTML = ''; if (lenis) lenis.start(); }
$('#modalX').addEventListener('click', closeFilm);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeFilm(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { closeFilm(); closeMega(); openPyxi(false); } });

/* ---------- magnetic buttons + cursor ---------- */
function bindMagnets() {
  if (TOUCH || REDUCE) return;
  $$('[data-magnet]').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: 'power3.out' }); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
  });
}
if (!TOUCH && !REDUCE) {
  const c = $('#cursor'), span = $('span', c); let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; const t = e.target.closest('[data-cursor]'); c.classList.toggle('big', !!t); span.textContent = t ? t.dataset.cursor : ''; });
  (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
} else $('#cursor').remove();

/* ---------- header, mega menu, clocks ---------- */
const hdr = $('#hdr'); let lastY = 0;
function onScroll(y) {
  hdr.classList.toggle('solid', y > 40);
  hdr.classList.toggle('hide', y > lastY && y > 400 && !$('#mega').classList.contains('open'));
  lastY = y;
}
const mega = $('#mega');
mega.innerHTML = `<div class="preview" id="megaPrev">${loopVid('eye')}<div class="cap"><b>PYXON-Eye</b>The platform behind every solution</div></div><div class="list"><a class="eye" href="#platform" data-prev="eye" data-t="PYXON-Eye" data-d="The platform behind every solution"><span><b>PYXON-Eye platform</b><span>Studio, engine and PYXON-CORE</span></span>${arrow}</a>${D.solutions.map(s => `<a href="#${s.id}" data-prev="${s.loop || ''}" data-img="${s.image || ''}" data-t="${s.name}" data-d="${s.tagline}"><b>${s.name}</b><span>${s.short}</span></a>`).join('')}<a href="#solutions" style="grid-column:1/-1;color:var(--royal)"><b>All solutions and services</b></a></div>`;
function openMega() { mega.classList.add('open'); $('#solBtn').setAttribute('aria-expanded', 'true'); const v = $('video', mega); if (v && !v.src) v.src = v.dataset.src; v && v.play().catch(() => { }); }
function closeMega() { mega.classList.remove('open'); $('#solBtn').setAttribute('aria-expanded', 'false'); }
/* first click (or hover) opens the menu; clicking Solutions again goes to the all-solutions page */
$('#solBtn').addEventListener('click', () => { if (mega.classList.contains('open')) { closeMega(); if (location.hash === '#solutions') go('solutions'); else location.hash = 'solutions'; } else openMega(); });
$('#solBtn').addEventListener('mouseenter', () => { if (!TOUCH) openMega(); });
mega.addEventListener('mouseleave', () => { if (!TOUCH) closeMega(); });
hdr.addEventListener('mouseleave', e => { if (!TOUCH && !mega.contains(e.relatedTarget)) closeMega(); });
$$('.list a[data-prev]', mega).forEach(a => a.addEventListener('mouseenter', () => {
  const prev = $('#megaPrev'); const k = a.dataset.prev; const img = a.dataset.img;
  const media = k ? `<video muted loop playsinline autoplay src="assets/video/${k}.mp4" poster="assets/video/${k}.webp"></video>` : `<img src="${img}" alt="">`;
  prev.innerHTML = `${media}<div class="cap"><b>${a.dataset.t}</b>${a.dataset.d}</div>`;
}));
$('#burger').addEventListener('click', () => $('#mnav').classList.add('open'));
$('#mnavX').addEventListener('click', () => $('#mnav').classList.remove('open'));
$('#ftrSol').innerHTML = D.solutions.map(s => `<li><a href="#${s.id}">${s.name}</a></li>`).join('');

function tickClocks() {
  const fmt = tz => { try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(new Date()); } catch (e) { return '--:--'; } };
  $('#clocks').innerHTML = D.worldClocks.map(([c, tz]) => `<span><b>${c}</b>${fmt(tz)}</span>`).join('');
  $$('[data-tz]').forEach(el => { el.textContent = fmt(el.dataset.tz); });
}
setInterval(tickClocks, 20000);

/* ---------- PYXI guide ---------- */
const PYXI = { hero: 'assets/pyxi/pyxi-hero.webp', corner: 'assets/pyxi/pyxi-corner.webp', loop: 'assets/pyxi/pyxi-wave.mp4', face: 'assets/pyxi/pyxi-face.mp4', facePoster: 'assets/pyxi/pyxi-face.webp',
  poses: [['wave', 'Hello'], ['greet', 'Greet'], ['think', 'Think'], ['stand', 'Stand'], ['fly', 'Fly'], ['eye', 'The Eye']] };
let pyxiOk = false;
(function probePyxi() {
  const im = new Image();
  im.onload = () => {
    pyxiOk = true;
    $('#pyxiBtn').innerHTML = `<video muted loop playsinline autoplay poster="${PYXI.facePoster}" src="${PYXI.face}"></video>`;
    const lp = $('#loaderPyxi'); if (lp) lp.src = PYXI.corner;
    if ($('#pyxiStage')) initPyxiStage();
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.goto); if (t) { if (lenis) lenis.scrollTo(t, { offset: -110 }); else t.scrollIntoView({ behavior: 'smooth' }); } }));
    $$('#contactPyxi').forEach(c => { c.innerHTML = `<video muted loop playsinline autoplay poster="${PYXI.facePoster}" src="${PYXI.face}"></video>`; });
  };
  im.src = PYXI.hero;
})();
function pyxiMedia(p) { return p === 'wave' ? `<video muted loop playsinline autoplay poster="${PYXI.hero}" src="${PYXI.loop}"></video>` : `<img src="assets/pyxi/pyxi-${p}.webp" alt="PYXI, ${p}">`; }
function initPyxiStage() {
  if (!pyxiOk) return;
  const st = $('#pyxiStage'), ps = $('#pyxiPoses');
  if (st) st.innerHTML = pyxiMedia('wave');
  if (!st || !ps) return;
  ps.innerHTML = PYXI.poses.map((p, i) => `<button type="button" class="${i ? '' : 'on'}" data-p="${p[0]}" aria-label="PYXI ${p[1]}"><img src="assets/pyxi/pyxi-${p[0] === 'wave' ? 'hero' : p[0]}.webp" alt=""><span>${p[1]}</span></button>`).join('');
  $$('button', ps).forEach(b => b.addEventListener('click', () => {
    $$('button', ps).forEach(x => x.classList.toggle('on', x === b));
    st.classList.remove('swap'); void st.offsetWidth; st.classList.add('swap');
    st.innerHTML = pyxiMedia(b.dataset.p);
  }));
}
const panel = $('#pyxiPanel'), hi = $('#pyxiHi');
const finder = [
  ['I run a government entity', 'gov-insight'], ['I lead a university', 'edu-bridge'], ['I run a hospital', 'nabd'], ['I lead procurement', 'procure-insight'],
  ['I manage sites, fleets or a city', 'iot-insight'], ['I own security and compliance', 'pyxon-shield'], ['I lead a large enterprise', 'enterprise-insight'], ['I build, make or ship things', 'industry']
];
panel.innerHTML = `<h4>Hi, I'm PYXI.</h4><p class="small">Tell me what you do, and I'll take you to the right place.</p><div class="opts">${finder.map(f => `<button type="button" data-s="${f[1]}">${f[0]} ${arrow}</button>`).join('')}</div><div class="ans" id="pyxiAns"></div><div class="opts" style="margin-top:10px;grid-template-columns:1fr 1fr"><a href="#videos">Watch the videos</a><a href="#contact">Book a walkthrough</a></div>`;
$$('button[data-s]', panel).forEach(b => b.addEventListener('click', () => {
  const s = solById(b.dataset.s); const ans = $('#pyxiAns');
  ans.innerHTML = `<b class="h4" style="display:block">${s.name}</b><p class="small" style="margin:6px 0 12px">${s.tagline} ${s.card}</p><a class="btn sm" href="#${s.id}">Take me there ${arrow}</a>`;
  ans.classList.add('on');
  $$('button[data-s]', panel).forEach(x => x.classList.toggle('picked', x === b));
  ans.classList.remove('pop'); void ans.offsetWidth; ans.classList.add('pop');
  /* bring PYXI's answer into view inside the panel */
  requestAnimationFrame(() => {
    const top = ans.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop - 16;
    const bottomGap = ans.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom;
    if (top < panel.scrollTop || bottomGap > -16) panel.scrollTo({ top: Math.max(0, Math.min(top, panel.scrollHeight)), behavior: REDUCE ? 'auto' : 'smooth' });
  });
}));
function openPyxi(on) { panel.classList.toggle('on', on); hi.classList.remove('on'); }
$('#pyxiBtn').addEventListener('click', () => openPyxi(!panel.classList.contains('on')));
panel.addEventListener('click', e => { if (e.target.closest('a')) openPyxi(false); });
const hiLines = { home: 'Hi! Not sure where to start? <b>Ask me.</b>', platform: 'This is the engine behind everything. <b>Want the 2-minute video?</b>', solutions: 'Tell me your sector and <b>I will pick for you.</b>', labs: '1.5B parameters, ahead of giants. <b>Proud of this one.</b>', contact: 'I will make sure <b>the right team</b> replies.' };
window.addEventListener('pyx:page', e => {
  const t = hiLines[e.detail.route]; if (!t) { hi.classList.remove('on'); return; }
  setTimeout(() => { hi.innerHTML = t; hi.classList.add('on'); setTimeout(() => hi.classList.remove('on'), 6000); }, 2600);
});

/* PYXI peeks in from the side when the visitor reaches the end of a page */
(function peek() {
  const el = document.createElement('img'); el.className = 'pyxi-peek'; el.alt = ''; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el);
  let shown = false;
  addEventListener('pyx:scroll', e => {
    if (!pyxiOk) return; if (!el.src) el.src = PYXI.corner;
    const nearEnd = e.detail.y > document.documentElement.scrollHeight - innerHeight * 1.6;
    if (nearEnd !== shown) { shown = nearEnd; el.classList.toggle('on', shown); }
  });
})();

/* ---------- boot ---------- */
function boot() {
  if (!REDUCE && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', e => { ScrollTrigger.update(); onScroll(e.scroll); window.dispatchEvent(new CustomEvent('pyx:scroll', { detail: { y: e.scroll, v: e.velocity } })); });
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  } else addEventListener('scroll', () => { onScroll(scrollY); window.dispatchEvent(new CustomEvent('pyx:scroll', { detail: { y: scrollY, v: 0 } })); }, { passive: true });
  window.PYXAPP.lenis = lenis;
  const pct = $('#pct'); const paths = ['#lt1', '#lt2', '#lt3'].map(s => $(s));
  paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.L = L; });
  const prog = v => { pct.textContent = `Weaving context ${Math.round(v * 100)}%`; paths.forEach((p, i) => { p.style.strokeDashoffset = p.dataset.L * (1 - Math.min(1, v * (1.4 - i * .15))); }); };
  setTimeout(() => { const lp = $('#loaderPyxi'); if (lp && lp.src && pyxiOk) lp.classList.add('on'); }, 500);
  const needLoom = currentRoute() === 'home';
  const ready = needLoom ? preloadLoom(v => prog(Math.min(1, v * 5.5))) : (preloadLoom(), Promise.resolve());
  const minT = new Promise(r => setTimeout(r, needLoom ? 1400 : 600));
  Promise.all([ready, minT, document.fonts ? document.fonts.ready : 0]).then(() => {
    prog(1); go(currentRoute());
    setTimeout(() => $('#loader').classList.add('done'), 250);
    setTimeout(() => $('#loader').remove(), 1500);
  });
}
boot();
/* ---------- phone call to action: one clear next step, always one tap away ---------- */
(function mobileCta() {
  const b = $('#mCta'); if (!b) return;
  const ftr = $('#ftr'); let ftrIn = false;
  new IntersectionObserver(([en]) => { ftrIn = en.isIntersecting; upd(); }, { rootMargin: '0px 0px -10% 0px' }).observe(ftr);
  function upd() {
    const r = currentRoute(), panel = $('#pyxiPanel');
    const show = innerWidth <= 960 && scrollY > innerHeight * .85 && r !== 'contact' && !ftrIn && !(panel && panel.classList.contains('on')) && !document.body.classList.contains('typing');
    b.classList.toggle('on', show);
  }
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); addEventListener('pyx:page', () => setTimeout(upd, 50));
  b.addEventListener('click', () => { const r = currentRoute(); if (solById(r)) try { sessionStorage.setItem('pyxSolution', r); } catch (e) { } });
  setInterval(upd, 1200);
})();

/* ---------- muted loops play on their own when they come into view ---------- */
// Phones in low power mode, or the page inside a frame, can refuse autoplay. Then the poster
// stays (no system play button) and the first tap anywhere starts every loop on screen.
const blockedVids = new Set();
function tryPlay(v) {
  v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.disablePictureInPicture = true;
  const pr = v.play(); if (pr && pr.catch) pr.then(() => { blockedVids.delete(v); v.classList.remove('vblock'); }).catch(() => { blockedVids.add(v); v.classList.add('vblock'); });
}
const autoIO = new IntersectionObserver(es => es.forEach(en => {
  const v = en.target;
  if (en.isIntersecting && en.intersectionRatio > .25) { if (!REDUCE) tryPlay(v); }
  else if (!v.paused) v.pause();
}), { threshold: [0, .25, .6] });
function armVideos(root = document) {
  root.querySelectorAll('video[autoplay]:not([data-armed]), video[loop][muted]:not(.lazyv):not([data-armed])').forEach(v => {
    if (v.closest('#modal')) return; v.dataset.armed = '1'; autoIO.observe(v);
  });
}
new MutationObserver(ms => { if (ms.some(m => [...m.addedNodes].some(n => n.nodeType === 1 && (n.tagName === 'VIDEO' || n.querySelector && n.querySelector('video'))))) armVideos(); }).observe(document.body, { childList: true, subtree: true });
armVideos();
['touchend', 'pointerdown', 'keydown'].forEach(t => addEventListener(t, () => {
  if (REDUCE || !blockedVids.size) return;
  blockedVids.forEach(v => { const r = v.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) tryPlay(v); });
}, { passive: true }));

})();

/* hide the PYXI button while the visitor is typing (keyboard open on phones) */
addEventListener('focusin', e => { if (e.target.matches('input,textarea,select')) document.body.classList.add('typing'); });
addEventListener('focusout', () => setTimeout(() => { if (!document.activeElement || !document.activeElement.matches('input,textarea,select')) document.body.classList.remove('typing'); }, 50));

/* keep the header on one line: hide the clocks, then switch to the menu button, only when the row would not fit */
function fitHeader() {
  const h = document.getElementById('hdr'); if (!h) return;
  h.classList.remove('tight', 'dense', 'compact');
  const over = () => {
    const n = h.querySelector('.nav'), l = h.querySelector('.logo'), r = h.querySelector('.hdr-r');
    if (!n || getComputedStyle(n).display === 'none') return false;
    const nb = n.getBoundingClientRect(), lb = l.getBoundingClientRect(), rb = r.getBoundingClientRect();
    if (document.documentElement.dir === 'rtl') return nb.right > lb.left - 24 || nb.left < rb.right + 24;
    return nb.left < lb.right + 24 || nb.right > rb.left - 24;
  };
  if (over()) h.classList.add('tight');
  if (over()) h.classList.add('dense');
  if (over()) h.classList.add('compact');
}
addEventListener('resize', fitHeader);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeader);
setTimeout(fitHeader, 300); fitHeader();
addEventListener('pyx:page', () => requestAnimationFrame(fitHeader));
addEventListener('pyx:lang', () => requestAnimationFrame(fitHeader));
setTimeout(fitHeader, 1200);

/* legal table of contents scrolls to its section without changing the route */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-sec]'); if (!a) return;
  e.preventDefault();
  const el = document.getElementById(a.dataset.sec); if (!el) return;
  const y = el.getBoundingClientRect().top + scrollY - 110;
  if (window.PYXAPP && PYXAPP.lenis) PYXAPP.lenis.scrollTo(y); else scrollTo({ top: y, behavior: 'smooth' });
});

/* keep the opening text below the header on short screens and in long languages */
function fitHero() {
  const c = document.querySelector('.hero .chap'), hdr = document.getElementById('hdr'); if (!c || !hdr) return;
  const room = () => c.getBoundingClientRect().top - hdr.getBoundingClientRect().bottom;
  c.classList.remove('fit-tight'); let f = 1; c.style.setProperty('--fit', f);
  while (room() < 18 && f > .85) { f -= .03; c.style.setProperty('--fit', f.toFixed(2)); }
  if (room() < 18) c.classList.add('fit-tight');
  while (room() < 18 && f > .6) { f -= .03; c.style.setProperty('--fit', f.toFixed(2)); }
}
addEventListener('resize', () => requestAnimationFrame(fitHero));
addEventListener('pyx:page', () => requestAnimationFrame(fitHero));
addEventListener('pyx:lang', () => setTimeout(fitHero, 60));
if (document.fonts) document.fonts.ready.then(fitHero);
setTimeout(fitHero, 400); setTimeout(fitHero, 1600);
