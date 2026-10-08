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
    ['Preferred time', data.time], ['Name', data.name], ['Email', data.email], ['Location', data.location], ['Your notes', data.message || 'No additional notes']
  ];
  details.forEach(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt'); term.textContent = label;
    const definition = document.createElement('dd'); definition.textContent = value;
    row.append(term, definition); list.append(row);
  });
  form.hidden = true; review.hidden = false;
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
