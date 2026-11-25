/* PYXON i18n: English source strings are the keys. Text is translated in place
   (text nodes, inline runs such as "Hi <b>there</b>", and a few attributes),
   and originals are kept so the language can be switched live. */
(function () {
  const LANGS = {
    en: { dir: 'ltr', name: 'English', short: 'EN' },
    ar: { dir: 'rtl', name: 'العربية', short: 'ع' },
    de: { dir: 'ltr', name: 'Deutsch', short: 'DE' },
    fr: { dir: 'ltr', name: 'Français', short: 'FR' },
    es: { dir: 'ltr', name: 'Español', short: 'ES' },
    zh: { dir: 'ltr', name: '简体中文', short: '中文', tag: 'zh-Hans' }
  };
  const DICT = window.PYX_DICT || {};
  const KEEP = new Set(window.PYX_KEEP || []); /* brand and product names that stay as written */
  const ATTRS = ['alt', 'aria-label', 'placeholder', 'title', 'data-cursor'];
  const INLINE = new Set(['B', 'STRONG', 'I', 'EM', 'SPAN', 'A', 'SMALL', 'SUP', 'SUB', 'U', 'MARK', 'CODE']);
  const VOID = new Set(['BR', 'SVG', 'IMG', 'svg']);
  const SKIP = 'script,style,noscript,code,pre,svg,canvas,video,iframe,textarea,[translate="no"],.notranslate,.word';
  const LETTER = /[A-Za-zÀ-ɏ]/;
  const RAW = /^(?:[\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/\S+|www\.\S+)$/;

  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
  const read = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  function detect() {
    const q = (location.search.match(/[?&]lang=(\w+)/) || [])[1];
    if (q && LANGS[q]) return q;
    const s = read('pyxLang'); if (s && LANGS[s]) return s;
    const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || '').slice(0, 2).toLowerCase();
    return LANGS[nav] ? nav : 'en';
  }
  let lang = detect();
  const miss = window.__pyxMiss = new Set();
  const outs = {}; /* every translated value per language, so translated text is never treated as a new source */
  for (const l in DICT) {
    outs[l] = new Set();
    for (const v of Object.values(DICT[l])) {
      outs[l].add(norm(v.replace(/<\/?\d+\/?>|<br>/g, '')));
      v.split(/<\/?\d+\/?>|<br>/).forEach(f => { f = norm(f); if (f) outs[l].add(f); });
    }
  }

  function norm(s) { return String(s).replace(/[\s  ]+/g, ' ').trim(); }
  function lookup(key) {
    if (lang === 'en' || !key || !LETTER.test(key) || RAW.test(key) || KEEP.has(key)) return null;
    const d = DICT[lang] || {};
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    const nums = [];
    const tk = key.replace(/<\/?\d+\/?>|(\d+(?:[.,:]\d+)*)/g, (m, g) => { if (!g) return m; nums.push(g); return '{' + (nums.length - 1) + '}'; });
    if (nums.length && Object.prototype.hasOwnProperty.call(d, tk)) return d[tk].replace(/\{(\d+)\}/g, (m, i) => nums[+i]);
    if (outs[lang] && outs[lang].has(key)) return null;
    miss.add(key);
    return null;
  }
  function t(s) { const k = norm(s); const v = lookup(k); return v == null ? s : v; }

  /* originals */
  const srcText = new WeakMap();   /* text node -> English */
  const srcUnit = new WeakMap();   /* element -> { key, kids } */
  const srcAttr = new WeakMap();   /* element -> { attr: English } */

  const skipped = el => el.closest && el.closest(SKIP);
  const hasText = n => LETTER.test(n.textContent);
  function simpleKid(c) {
    if (c.nodeType === 3) return true;
    if (c.nodeType !== 1) return true;
    if (VOID.has(c.tagName)) return true;
    if (!INLINE.has(c.tagName)) return false;
    for (const g of c.childNodes) if (g.nodeType === 1 && g.tagName !== 'BR') return false;
    return true;
  }
  function isUnit(el) {
    let txt = false, inl = false;
    for (const c of el.childNodes) {
      if (!simpleKid(c)) return false;
      if (c.nodeType === 3 && LETTER.test(c.data)) txt = true;
      if (c.nodeType === 1 && (c.tagName === 'BR' || (INLINE.has(c.tagName) && c.textContent.trim()))) inl = true;
    }
    return (txt && inl) || srcUnit.has(el);
  }
  function unitKey(el) {
    const kids = []; let k = '';
    for (const c of el.childNodes) {
      if (c.nodeType === 3) k += c.data;
      else if (c.nodeType === 1) {
        if (c.tagName === 'BR') k += '<br>';
        else { const i = kids.push(c) - 1; k += VOID.has(c.tagName) || !c.textContent.trim() ? `<${i}/>` : `<${i}>${c.textContent}</${i}>`; }
      }
    }
    return { key: norm(k), kids };
  }
  function build(el, str, kids) {
    const frag = document.createDocumentFragment(), re = /<(\d+)>([\s\S]*?)<\/\1>|<(\d+)\/>|<br>/g;
    let last = 0, m, used = new Set();
    while ((m = re.exec(str))) {
      if (m.index > last) frag.appendChild(document.createTextNode(str.slice(last, m.index)));
      if (m[1] != null) { const c = kids[+m[1]]; if (c) { c.textContent = m[2]; frag.appendChild(c); used.add(c); } }
      else if (m[3] != null) { const c = kids[+m[3]]; if (c) { frag.appendChild(c); used.add(c); } }
      else frag.appendChild(document.createElement('br'));
      last = re.lastIndex;
    }
    if (last < str.length) frag.appendChild(document.createTextNode(str.slice(last)));
    kids.forEach(c => { if (!used.has(c) && VOID.has(c.tagName)) frag.appendChild(c); }); /* never drop an icon */
    el.textContent = ''; el.appendChild(frag);
  }

  function doUnit(el) {
    let rec = srcUnit.get(el);
    const cur = unitKey(el);
    if (!rec || (cur.key !== rec.key && cur.key !== rec.out)) {
      /* the app wrote new content: remember the English and the live children */
      rec = { key: cur.key, kids: cur.kids };
      srcUnit.set(el, rec);
    }
    if (lang === 'en') { if (cur.key !== rec.key) build(el, rec.key, rec.kids); rec.out = rec.key; return; }
    const v = lookup(rec.key);
    if (v == null) { rec.out = rec.key; return; }
    build(el, v, rec.kids);
    rec.out = unitKey(el).key;
  }
  function doText(n) {
    const cur = n.data;
    let src = srcText.get(n);
    if (src == null || (cur !== src && cur !== n.__out)) { src = cur; srcText.set(n, src); }
    let out = src;
    if (lang !== 'en') {
      const v = lookup(norm(src));
      if (v != null) { const lead = src.match(/^\s*/)[0], trail = src.match(/\s*$/)[0]; out = lead + v + trail; }
    }
    if (n.data !== out) n.data = out;
    n.__out = out;
  }
  function doAttrs(el) {
    let rec = srcAttr.get(el);
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a);
      if (!rec) { rec = {}; srcAttr.set(el, rec); }
      if (rec[a] == null || (cur !== rec[a] && cur !== rec['_' + a])) rec[a] = cur;
      const v = lang === 'en' ? null : lookup(norm(rec[a]));
      const out = v == null ? rec[a] : v;
      if (cur !== out) el.setAttribute(a, out);
      rec['_' + a] = out;
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { const p = root.parentElement; if (p && !skipped(p)) { if (isUnit(p)) doUnit(p); else doText(root); } return; }
    if (root.nodeType !== 1 || skipped(root)) return;
    const stack = [root];
    while (stack.length) {
      const el = stack.pop();
      if (el.nodeType !== 1) continue;
      if (el.matches(SKIP)) { if (el.tagName === 'TEXTAREA' && !el.closest('[translate="no"]')) doAttrs(el); continue; }
      doAttrs(el);
      if (isUnit(el)) { doUnit(el); continue; }
      for (let c = el.lastChild; c; c = c.previousSibling) {
        if (c.nodeType === 3) { if (LETTER.test(c.data) || srcText.has(c)) doText(c); }
        else if (c.nodeType === 1) stack.push(c);
      }
    }
  }

  let obs;
  function observe() {
    obs = new MutationObserver(recs => {
      const seen = new Set();
      for (const r of recs) {
        if (r.type === 'attributes') { if (!skipped(r.target)) doAttrs(r.target); continue; }
        if (r.type === 'characterData') { seen.add(r.target); continue; }
        r.addedNodes.forEach(n => seen.add(n));
        if (r.target.nodeType === 1 && srcUnit.has(r.target)) seen.add(r.target);
      }
      seen.forEach(n => { if (n.isConnected) walk(n.nodeType === 3 ? n : n); });
      obs.takeRecords();
    });
    obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function apply(root) { walk(root || document.body); if (obs) obs.takeRecords(); }

  /* title */
  let titleSrc = document.title;
  function setTitle(s) { if (s != null) titleSrc = s; document.title = t(titleSrc); }

  function setDocAttrs() {
    const h = document.documentElement;
    h.lang = LANGS[lang].tag || lang; h.dir = LANGS[lang].dir;
    h.classList.toggle('rtl', LANGS[lang].dir === 'rtl');
  }
  function setLang(l) {
    if (!LANGS[l] || l === lang) return;
    lang = l; store('pyxLang', l); setDocAttrs();
    walk(document.body); if (obs) obs.takeRecords();
    setTitle();
    syncSwitchers();
    window.dispatchEvent(new CustomEvent('pyx:lang', { detail: { lang } }));
  }

  /* language switcher */
  function switcherHTML(cls) {
    return `<div class="lang-sw ${cls || ''}" translate="no"><button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg><span class="cur"></span></button><ul class="lang-list" role="menu">${Object.keys(LANGS).map(k => `<li><button type="button" role="menuitemradio" data-lang="${k}" lang="${LANGS[k].tag || k}" dir="${LANGS[k].dir}">${LANGS[k].name}</button></li>`).join('')}</ul></div>`;
  }
  function syncSwitchers() {
    document.querySelectorAll('.lang-sw').forEach(sw => {
      sw.querySelector('.cur').textContent = LANGS[lang].short;
      sw.querySelector('.lang-btn').setAttribute('aria-label', { en: 'Language', ar: 'اللغة', de: 'Sprache', fr: 'Langue', es: 'Idioma', zh: '语言' }[lang]);
      sw.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.lang === lang)));
    });
    document.querySelectorAll('.lang-row [data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  }
  function mountSwitchers() {
    const r = document.querySelector('.hdr-r');
    if (r && !r.querySelector('.lang-sw')) r.insertAdjacentHTML('afterbegin', switcherHTML('in-hdr'));
    const m = document.getElementById('mnav');
    if (m && !m.querySelector('.lang-row')) m.insertAdjacentHTML('beforeend', `<div class="lang-row" translate="no">${Object.keys(LANGS).map(k => `<button type="button" data-lang="${k}" lang="${LANGS[k].tag || k}">${LANGS[k].name}</button>`).join('')}</div>`);
    const base = document.querySelector('.ftr .base');
    if (base && !document.querySelector('.ftr .lang-row')) base.insertAdjacentHTML('beforebegin', `<div class="lang-row ftr-langs" translate="no">${Object.keys(LANGS).map(k => `<button type="button" data-lang="${k}" lang="${LANGS[k].tag || k}">${LANGS[k].name}</button>`).join('')}</div>`);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-lang]');
      const sw = e.target.closest('.lang-sw');
      if (b) { setLang(b.dataset.lang); document.querySelectorAll('.lang-sw').forEach(s => { s.classList.remove('open'); s.querySelector('.lang-btn').setAttribute('aria-expanded', 'false'); }); return; }
      const btn = e.target.closest('.lang-btn');
      if (btn) { const open = !sw.classList.contains('open'); sw.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); return; }
      if (!sw) document.querySelectorAll('.lang-sw.open').forEach(s => { s.classList.remove('open'); s.querySelector('.lang-btn').setAttribute('aria-expanded', 'false'); });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.lang-sw.open').forEach(s => { s.classList.remove('open'); s.querySelector('.lang-btn').setAttribute('aria-expanded', 'false'); s.querySelector('.lang-btn').focus(); }); });
    syncSwitchers();
  }

  setDocAttrs();
  window.PYXI18N = { t, apply, setLang, setTitle, get lang() { return lang; }, get rtl() { return LANGS[lang].dir === 'rtl'; }, langs: LANGS, miss };
  mountSwitchers();
  apply(document.body);
  setTitle(document.title);
  observe();
})();
