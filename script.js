const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const yearEl = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const applyTheme = (theme) => {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', nextTheme);
  if (themeToggle) {
    const labelTarget = nextTheme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${labelTarget} theme`);
  }
};

const storedTheme = localStorage.getItem('theme');

if (storedTheme === 'dark' || storedTheme === 'light') {
  applyTheme(storedTheme);
} else if (prefersDarkScheme.matches) {
  applyTheme('dark');
} else {
  applyTheme(document.body.getAttribute('data-theme') || 'light');
}

const handlePreferenceChange = (event) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
};

if (typeof prefersDarkScheme.addEventListener === 'function') {
  prefersDarkScheme.addEventListener('change', handlePreferenceChange);
} else if (typeof prefersDarkScheme.addListener === 'function') {
  prefersDarkScheme.addListener(handlePreferenceChange);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    if ((next === 'dark' && prefersDarkScheme.matches) || (next === 'light' && !prefersDarkScheme.matches)) {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', next);
    }
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
