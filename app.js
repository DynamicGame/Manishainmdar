const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();
const dateInput = document.querySelector('#date');
const today = new Date();
const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
dateInput.min = localDate;
const form = document.querySelector('#booking-form');
const review = document.querySelector('#review');
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    showForm();
    document.querySelector('#service').value = button.dataset.service;
    document.querySelector('#booking').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
});
function showForm() { form.hidden = false; review.hidden = true; }
form.addEventListener('submit', event => {
  event.preventDefault();
  if (dateInput.value < localDate) { dateInput.setCustomValidity('Please choose today or a future date.'); dateInput.reportValidity(); return; }
  const data = Object.fromEntries(new FormData(form));
  const list = document.querySelector('#review-details');
  list.replaceChildren();
  const chosenDate = new Date(`${data.date}T12:00:00`);
  const details = [
    ['Service', data.service], ['Preferred date', chosenDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
    ['Preferred time', data.time], ['Name', data.name], ['Email', data.email], ['Phone', data.phone || 'Not provided'], ['Number of people', data.people], ['Location', data.location], ['Your notes', data.message || 'No additional notes']
  ];
  details.forEach(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt'); term.textContent = label;
    const definition = document.createElement('dd'); definition.textContent = value;
    row.append(term, definition); list.append(row);
  });
  form.hidden = true; review.hidden = false;
  document.querySelector('#enquiry-action-status').textContent = '';
  document.querySelector('#edit-enquiry').focus({ preventScroll: true });
  review.scrollIntoView({ block: 'center', behavior: 'smooth' });
});
dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));
document.querySelector('#edit-enquiry').addEventListener('click', () => { showForm(); document.querySelector('#service').focus(); });
const dialog = document.querySelector('#lightbox');
let galleryTrigger;
document.querySelectorAll('[data-photo]').forEach(button => {
  button.addEventListener('click', () => {
    galleryTrigger = button;
    const source = button.querySelector('img');
    const target = dialog.querySelector('img');
    target.src = source.src; target.alt = source.alt;
    dialog.querySelector('p').textContent = button.querySelector('em').textContent;
    dialog.showModal();
  });
});
dialog.querySelector('button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => galleryTrigger?.focus());

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const galleryItems = [...document.querySelectorAll('[data-photo]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  galleryItems.forEach(item => { item.hidden = button.dataset.filter !== 'all' && !item.dataset.category.split(' ').includes(button.dataset.filter); });
  const count = galleryItems.filter(item => !item.hidden).length;
  document.querySelector('#gallery-status').textContent = `${count} inspiration ${count === 1 ? 'look' : 'looks'}`;
  document.querySelector('#gallery-empty').hidden = count > 0;
}));
function movePhoto(direction) {
  const visibleItems = galleryItems.filter(item => !item.hidden);
  const current = visibleItems.indexOf(galleryTrigger);
  galleryTrigger = visibleItems[(current + direction + visibleItems.length) % visibleItems.length];
  const source = galleryTrigger.querySelector('img');
  dialog.querySelector('img').src = source.src;
  dialog.querySelector('img').alt = source.alt;
  dialog.querySelector('p').textContent = galleryTrigger.querySelector('em').textContent;
  document.querySelector('#photo-position').textContent = `${visibleItems.indexOf(galleryTrigger) + 1} / ${visibleItems.length}`;
}
galleryItems.forEach(item => item.addEventListener('click', () => movePhoto(0)));
document.querySelector('#previous-photo').addEventListener('click', () => movePhoto(-1));
document.querySelector('#next-photo').addEventListener('click', () => movePhoto(1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); movePhoto(event.key === 'ArrowLeft' ? -1 : 1); }
});
function enquiryText() {
  return 'Enquiry for Makeup by Manisha\n\n' + [...document.querySelectorAll('#review-details > div')].map(row => `${row.querySelector('dt').textContent}: ${row.querySelector('dd').textContent}`).join('\n') + '\n\nNot sent. Appointment and availability have not been confirmed.';
}
document.querySelector('#download-enquiry').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([enquiryText()], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'manisha-makeup-enquiry.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#enquiry-action-status').textContent = 'Your download has been prepared. The enquiry has not been sent.';
});
document.querySelector('#copy-enquiry').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(enquiryText()); document.querySelector('#enquiry-action-status').textContent = 'Details copied. Your enquiry has not been sent.'; }
  catch { document.querySelector('#enquiry-action-status').textContent = 'Copy isn’t available in this browser. Download your enquiry instead.'; }
});
