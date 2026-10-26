let idx = [], sel = -1, wired = false;
const norm = (s) => s.toLowerCase().replace(/['’]s\b/g, '').replace(/[^a-z0-9+% ]+/g, ' ');
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const STOP = new Set(['johnny', 'wilson', 'the', 'a', 'of', 'and', 'my', 'me', 'for', 'in']);
export function find(q) {
  const ts = norm(q).split(/\s+/).filter((t) => t && !STOP.has(t));
  if (!ts.length) return idx.filter((e) => e.p);
  return idx
    .map((e) => ({ e, n: ts.reduce((n, t) => n + (norm(e.t).includes(t) ? 3 : 0) + (norm(e.k).includes(t) ? 1 : 0), 0) }))
    .filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 6).map((x) => x.e);
}
const hide = () => { const u = document.getElementById('sug'); if (u) u.hidden = true; sel = -1; };
function show(list, q) {
  const u = document.getElementById('sug'); if (!u) return; sel = -1;
  u.innerHTML = list.length
    ? list.map((e) => `<li><a href="${e.u}"><b>${esc(e.t)}</b><span>${esc(e.s)}</span></a></li>`).join('')
    : `<li class="none">No results for “${esc(q)}”. Try “resume” or “google ads”.</li>`;
  u.hidden = false;
}
export function typeIn() {
  const i = document.getElementById('q'); if (!i) return;
  const t = i.dataset.q || '';
  clearInterval(window.__qt);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { i.value = t; return; }
  let n = 0; i.value = '';
  window.__qt = setInterval(() => { if (document.activeElement === i || n >= t.length) return clearInterval(window.__qt); i.value = t.slice(0, ++n); }, 60);
}
export function initSearch(index) {
  idx = index;
  if (!wired) {
    wired = true;
    document.addEventListener('input', (e) => { if (e.target.id !== 'q') return; const q = e.target.value.trim(); q ? show(find(q), q) : hide(); });
    document.addEventListener('focusin', (e) => { if (e.target.id === 'q') { clearInterval(window.__qt); e.target.select(); } });
    document.addEventListener('click', (e) => { if (!e.target.closest('#sf')) hide(); });
    document.addEventListener('keydown', (e) => {
      if (e.target.id !== 'q') return;
      const as = [...document.querySelectorAll('#sug a')];
      if (e.key === 'Escape') return hide();
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && as.length) {
        e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + as.length) % as.length;
        as.forEach((a, k) => a.classList.toggle('on', k === sel));
      }
    });
    document.addEventListener('submit', (e) => {
      if (e.target.id !== 'sf') return; e.preventDefault();
      const a = document.querySelector('#sug a.on') || document.querySelector('#sug a');
      if (a) { location.href = a.getAttribute('href'); return; }
      const q = document.getElementById('q').value, l = find(q);
      l.length ? (location.href = l[0].u) : show([], q);
    });
  }
  typeIn();
}
export function initMenu() {
  const set = (open) => {
    const b = document.getElementById('burger'), p = document.getElementById('mnav');
    if (!b || !p) return;
    p.hidden = !open; b.setAttribute('aria-expanded', String(open));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('#burger');
    if (b) return set(b.getAttribute('aria-expanded') !== 'true');
    if (!e.target.closest('#mnav') || e.target.closest('#mnav a')) set(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}
