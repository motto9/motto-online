/* Where's Molly? — front-end. Copy comes from content.json (synced from Notion). */
const $ = id => document.getElementById(id);
const S = 300 / 460;                              // doll display scale
const dollUrl = k => 'assets/dolls/' + k + '.png';
const iconUrl = k => 'assets/icons/' + k + '.png';
const esc = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let CONTENT = null, persona = null, accPos = {};
try { accPos = JSON.parse(localStorage.getItem('molly-acc-pos') || '{}') || {}; } catch (e) {}

const cur = () => CONTENT.personas.find(p => p.id === persona) || null;

/* ---------- doll ---------- */
function buildDoll() {
  const layer = $('dolllayer');
  const dolls = CONTENT.personas.map(p =>
    `<div class="doll" data-art="${p.id}" style="background-image:url(${dollUrl(p.art)})"></div>`).join('')
    + `<div class="doll" data-art="base" style="background-image:url(${dollUrl('molly')})"></div>`;
  const acc = Object.entries(CONTENT.accessories).map(([slot, a]) =>
    `<div class="acc" data-slot="${slot}" data-key="${a.key}" title="drag me — double-click to reset"
       style="background-image:url(${dollUrl(a.art)})"></div>`).join('');
  layer.innerHTML = dolls + acc;
  layer.querySelectorAll('.acc').forEach(el => {
    el.addEventListener('pointerdown', e => startDrag(el, e));
    el.addEventListener('dblclick', () => { delete accPos[el.dataset.key]; save(); positionAcc(el); });
  });
}
function positionAcc(el) {
  const a = CONTENT.accessories[el.dataset.slot];
  const p = accPos[a.key] || { x: a.x * S, y: a.y * S };
  el.style.left = p.x.toFixed(1) + 'px'; el.style.top = p.y.toFixed(1) + 'px';
  el.style.width = Math.round(a.w * S) + 'px'; el.style.height = Math.round(a.h * S) + 'px';
}
function startDrag(el, e) {
  e.preventDefault();
  const a = CONTENT.accessories[el.dataset.slot];
  const c = accPos[a.key] || { x: a.x * S, y: a.y * S };
  const ox = e.clientX - c.x, oy = e.clientY - c.y;
  const move = ev => { accPos[a.key] = { x: ev.clientX - ox, y: ev.clientY - oy }; positionAcc(el); };
  const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); save(); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
}
function save() { try { localStorage.setItem('molly-acc-pos', JSON.stringify(accPos)); } catch (e) {} }

/* ---------- render persona ---------- */
function render() {
  const c = cur(), b = CONTENT.base, key = c ? c.id : 'base';
  document.querySelectorAll('.chip').forEach(el => { const id = el.dataset.id || null; el.setAttribute('aria-pressed', String(id === persona)); });
  document.querySelectorAll('.doll').forEach(el => el.style.display = (el.dataset.art === key ? 'block' : 'none'));
  document.querySelectorAll('.acc').forEach(el => { el.style.display = (el.dataset.slot === key ? 'block' : 'none'); positionAcc(el); });
  $('nameplate').textContent = c ? c.name : b.nameplate;
  $('blurb').textContent = c ? c.blurb : b.blurb;
  $('bio').innerHTML = (c ? (c.longVersion || b.longVersion) : b.longVersion);
  $('nowlink').textContent = c ? c.linkLabel : b.linkLabel;
  $('nowlink').href = c ? c.linkHref : b.linkHref;
  $('fileName').textContent = c ? 'molly_' + c.id + '.txt' : b.fileName;
  $('headlineLabel').textContent = c ? 'NOW SHOWING' : b.headlineLabel;
  $('headline').textContent = c ? c.headline : b.headline;
  $('listLabel').textContent = c ? c.listLabel : b.listLabel;
  $('bullets').innerHTML = (c ? c.bullets : b.bullets).map(x => `<div class="b"><span class="st">✦</span><span>${x}</span></div>`).join('');
  const acc = CONTENT.accessories[key];
  $('draghint').textContent = acc ? ('✦ drag her ' + acc.key + ' around ✦ double-click to put it back') : '✦ dollz made at dollzrevival';
}

/* ---------- bento (from content.json) ---------- */
function renderBento2() {
  const el = $('bento2'); if (!el) return;
  el.innerHTML = (CONTENT.bento2 || []).filter(c => c.enabled !== false).map(c => {
    const cls = 'card b2-' + (c.type || 'medium');
    const kick = c.kicker ? `<div class="kicker">${esc(c.kicker)}</div>` : '';
    const title = (c.type === 'feature' && c.title) ? `<h2>${esc(c.title)}</h2>` : '';
    const text = c.body ? `<p>${esc(c.body).replace(/\n/g, '<br>')}</p>` : '';
    const hasText = kick || title || text;
    const align = c.type === 'wide' ? ' style="text-align:center"' : '';
    let inner;
    if (c.image && hasText) inner = `<div class="body"${align}>${kick}<img class="b2img inset" src="${esc(c.image)}" alt="">${title}${text}</div>`;
    else if (c.image) inner = `<img class="b2img" src="${esc(c.image)}" alt="">`;
    else if (c.type === 'tall') inner = `<div class="imgstub">${c.body ? esc(c.body).replace(/\n/g, '<br>') : 'IMG — drop a picture'}</div>`;
    else inner = `<div class="body"${align}>${kick}${title}${text}</div>`;
    return c.link
      ? `<a class="${cls}" href="${esc(c.link)}" target="_blank" rel="noreferrer" style="text-decoration:none;color:inherit">${inner}</a>`
      : `<div class="${cls}">${inner}</div>`;
  }).join('');
}

/* ---------- plain (nostalgia off) ---------- */
function renderPlain() {
  $('plainInner').innerHTML =
    `<h1>Molly Otto</h1><p class="sub">Producer &amp; digital strategist. San Francisco.</p>
     <p>${CONTENT.bio}</p>
     ${CONTENT.personas.map(p => `<div style="margin-bottom:26px"><h2>${p.label}</h2><p>${p.blurb}</p>
       <ul style="margin:0;padding-left:20px">${p.bullets.map(b => `<li style="margin-bottom:3px">${b}</li>`).join('')}</ul></div>`).join('')}
     <h2 style="margin-top:34px">Get in touch</h2>
     <ul style="margin:0;padding-left:20px">
       <li><a href="mailto:${CONTENT.email}">${CONTENT.email}</a></li>
       ${CONTENT.social.map(s => `<li><a href="${s.href}" target="_blank" rel="noreferrer">${s.label[0] + s.label.slice(1).toLowerCase()}</a></li>`).join('')}
     </ul>`;
}

/* ---------- ambient ---------- */
function sparkleField() {
  const f = $('sparkles'); const g = ['✦', '✧', '✶', '·']; let h = '';
  for (let i = 0; i < 96; i++) {
    h += `<span style="left:${((i * 37.3) % 100).toFixed(2)}%;top:${((i * 53.7) % 100).toFixed(2)}%;
      font-size:${8 + ((i * 7) % 14)}px;color:${i % 3 === 0 ? '#ffd76a' : '#fff6fb'};
      animation:om-twinkle ${(2.2 + ((i * 13) % 30) / 10).toFixed(1)}s ease-in-out infinite;
      animation-delay:${(((i * 17) % 40) / 10).toFixed(1)}s">${g[i % 4]}</span>`;
  }
  f.innerHTML = h;
}
function sparkleBurst(el) {
  let last = 0;
  const cols = ['#ff5fa2', '#ffd76a', '#fff6fb', '#48d8f0'];
  el.addEventListener('pointermove', e => {
    const now = Date.now(); if (now - last < 70) return; last = now;
    const r = el.getBoundingClientRect();
    const s = document.createElement('span');
    s.textContent = ['✦', '✧', '✶'][Math.floor(Math.random() * 3)];
    s.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;z-index:6;
      pointer-events:none;font-size:${11 + Math.random() * 10}px;color:${cols[Math.floor(Math.random() * cols.length)]};
      text-shadow:1px 1px 0 rgba(42,17,64,.5);animation:om-burst .8s ease-out forwards`;
    el.appendChild(s); setTimeout(() => s.remove(), 820);
  });
}

/* ---------- boot ---------- */
['toggle', 'toggleTop'].forEach(id => { const t = $(id); if (t) t.addEventListener('click', () => document.body.classList.toggle('plain')); });

function boot() {
  $('marquee').innerHTML = '<s>' + CONTENT.marquee + '</s><s>' + CONTENT.marquee + '</s>';
  $('email').href = 'mailto:' + CONTENT.email;
  $('copyright').textContent = '© ' + new Date().getFullYear() + ' molly otto ✦ no cookies, only sparkles';
  $('social').innerHTML = CONTENT.social.map(s => `<a href="${s.href}" target="_blank" rel="noreferrer">${s.label}</a>`).join('');
  if (CONTENT.photo) $('photoImg').innerHTML = `<img src="${CONTENT.photo}" alt="Molly">`;
  const b = CONTENT.base;
  $('rail').innerHTML = [{ id: null, label: b.label || 'Just Molly Otto', icon: b.icon || 'heart' }].concat(CONTENT.personas)
    .map(p => `<button class="chip" data-id="${p.id === null ? '' : p.id}" aria-pressed="false">${p.icon ? `<img class="chipicon" src="${iconUrl(p.icon)}" alt="">` : ''}<span>${p.label}</span></button>`).join('');
  $('rail').addEventListener('click', e => { const btn = e.target.closest('.chip'); if (!btn) return; persona = btn.dataset.id || null; render(); });
  buildDoll(); render(); renderPlain(); renderBento2(); sparkleField(); sparkleBurst($('dollframe')); sparkleBurst($('email'));
}

fetch('content.json').then(r => r.json()).then(d => { CONTENT = d; boot(); })
  .catch(err => { console.error('Failed to load content.json', err); });
