// ─── Edit your event here ────────────────────────────────────────────
const EVENT = {
  name: 'Start-Up Social',
  date: '02 December 2026',
  city: 'Bengaluru',
  frame: 'assets/i-am-attending.jpg',          // the image guests download & share
  frameFile: 'start-up-social-i-am-attending.jpg',
  linkedInUrl: 'https://www.linkedin.com/feed/',
};
// ─────────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);
const steps = { rsvp: $('step-rsvp'), decline: $('step-decline'), frame: $('step-frame'), share: $('step-share') };
const stepIndex = { rsvp: 1, decline: 1, frame: 2, share: 3 };
let guest = { name: '', company: '' };

document.querySelectorAll('[data-event]').forEach(el => { el.textContent = EVENT[el.dataset.event]; });
const [day, ...month] = EVENT.date.split(' '); // "02 December 2026" → big "02" + "December 2026"
document.querySelectorAll('[data-event-part]').forEach(el => { el.textContent = el.dataset.eventPart === 'day' ? day : month.join(' '); });

// ─── Steps ───────────────────────────────────────────────────────────
function go(name) {
  Object.entries(steps).forEach(([key, el]) => { el.hidden = key !== name; });
  const n = stepIndex[name];
  document.querySelectorAll('[data-step-dot]').forEach(li => {
    const i = Number(li.dataset.stepDot);
    li.classList.toggle('is-active', i === n);
    li.classList.toggle('is-done', i < n);
  });
  const showFrame = name === 'frame' || name === 'share';
  $('event-card').hidden = showFrame;
  $('frame-card').hidden = !showFrame;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.go)));

// ─── RSVP form ───────────────────────────────────────────────────────
const nameInput = $('in-name');
const companyInput = $('in-company');
[nameInput, companyInput].forEach(input => input.addEventListener('input', () => input.removeAttribute('aria-invalid')));

$('rsvp-form').addEventListener('submit', e => {
  e.preventDefault();
  const attending = new FormData(e.currentTarget).get('attending');
  const missing = [];
  if (!nameInput.value.trim()) { missing.push('your name'); nameInput.setAttribute('aria-invalid', 'true'); }
  if (!companyInput.value.trim()) { missing.push('your company'); companyInput.setAttribute('aria-invalid', 'true'); }
  if (!attending) missing.push('whether you can attend');
  const err = $('form-error');
  if (missing.length) {
    err.textContent = `Please add ${missing.join(', ').replace(/, ([^,]*)$/, ' and $1')}.`;
    err.hidden = false;
    return;
  }
  err.hidden = true;
  guest = { name: nameInput.value.trim(), company: companyInput.value.trim() };
  if (attending === 'no') {
    $('decline-name').textContent = guest.name;
    go('decline');
  } else {
    $('frame-name').textContent = guest.name.split(' ')[0];
    go('frame');
  }
});

// ─── Download / share ────────────────────────────────────────────────
let frameBlob = null;
async function getFrame() {
  if (!frameBlob) frameBlob = await (await fetch(EVENT.frame)).blob();
  return frameBlob;
}

async function download() {
  const url = URL.createObjectURL(await getFrame());
  const a = Object.assign(document.createElement('a'), { href: url, download: EVENT.frameFile });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

$('btn-download').addEventListener('click', download);

$('btn-linkedin').addEventListener('click', () => {
  download();
  const win = window.open(EVENT.linkedInUrl, '_blank');
  if (win) win.opener = null;
  else setTimeout(() => window.location.assign(EVENT.linkedInUrl), 600); // popup blocked: let the download start first
});
