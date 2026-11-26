const languageMenu = document.querySelector('.language-switcher');
document.addEventListener('click', event => {
  if (!languageMenu.contains(event.target)) languageMenu.open = false;
});
languageMenu.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    languageMenu.open = false;
    languageMenu.querySelector('summary').focus();
  }
});

for (const button of document.querySelectorAll('.copy-email')) {
  if (!navigator.clipboard?.writeText) continue;
  const label = button.textContent;
  let reset;
  button.hidden = false;
  button.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.classList.add('done');
      button.textContent = button.dataset.done;
    } catch {
      button.textContent = button.dataset.failed;
    }
    reset = setTimeout(() => {
      button.textContent = label;
      button.classList.remove('done');
    }, 2000);
  });
}

const index = document.querySelector('.question-index');
if (index) {
  const links = [...index.querySelectorAll('li a')];
  const headings = links.map(link => document.getElementById(link.hash.slice(1)));
  const floatingBack = document.querySelector('.floating-back');
  const languageLinks = document.querySelectorAll('.language-options a');
  let queued = false;
  function updatePosition() {
    queued = false;
    let active = 0;
    headings.forEach((heading, i) => {
      if (heading.getBoundingClientRect().top <= 145) active = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) active = links.length - 1;
    links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    floatingBack.hidden = index.getBoundingClientRect().bottom > 54;
    const reading = headings[0].getBoundingClientRect().top <= 145;
    for (const link of languageLinks) link.hash = reading ? headings[active].id : '';
  }
  function requestUpdate() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(updatePosition);
    }
  }
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate);
  addEventListener('pageshow', requestUpdate);
  updatePosition();
}
