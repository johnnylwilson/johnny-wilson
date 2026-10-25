export function initForm(demo = false) {
  document.addEventListener('submit', async (e) => {
    const f = e.target.closest && e.target.closest('form.cf');
    if (!f) return;
    e.preventDefault();
    const ok = f.querySelector('.ok'), bad = f.querySelector('.bad'), btn = f.querySelector('button');
    ok.hidden = bad.hidden = true;
    const url = f.dataset.action;
    if (demo) { ok.textContent += ' (Preview only: nothing was sent.)'; ok.hidden = false; f.reset(); return; }
    if (!url || url.includes('YOUR_FORM_ID')) { bad.textContent = 'This form is not connected yet. Add your Formspree form ID to formAction in src/data.json.'; bad.hidden = false; return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(url, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('bad status');
      ok.hidden = false; f.reset();
    } catch (err) {
      bad.textContent = 'Oops! Something went wrong while submitting the form. Please email me directly.'; bad.hidden = false;
    }
    btn.disabled = false; btn.textContent = 'Send';
  });
}
