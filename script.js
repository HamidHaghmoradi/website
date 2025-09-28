const prefersDarkScheme = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const safeReadTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch (error) {
    return null;
  }
};

const safeWriteTheme = (value) => {
  try {
    if (value) {
      localStorage.setItem('theme', value);
    } else {
      localStorage.removeItem('theme');
    }
  } catch (error) {
    // Ignore storage failures so the toggle still works gracefully.
  }
};

const init = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const yearEl = document.getElementById('year');
  const themeToggle = document.querySelector('.theme-toggle');

  const applyTheme = (theme) => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', nextTheme);
    if (themeToggle) {
      const labelTarget = nextTheme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${labelTarget} theme`);
    }
  };

  const storedTheme = safeReadTheme();
  const initialTheme = storedTheme
    || (prefersDarkScheme && prefersDarkScheme.matches ? 'dark' : document.body.getAttribute('data-theme') || 'light');

  applyTheme(initialTheme);

  const handlePreferenceChange = (event) => {
    if (!safeReadTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  };

  if (prefersDarkScheme) {
    if (typeof prefersDarkScheme.addEventListener === 'function') {
      prefersDarkScheme.addEventListener('change', handlePreferenceChange);
    } else if (typeof prefersDarkScheme.addListener === 'function') {
      prefersDarkScheme.addListener(handlePreferenceChange);
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);

      const systemPrefersDark = prefersDarkScheme ? prefersDarkScheme.matches : false;
      const matchesSystemPreference = (nextTheme === 'dark' && systemPrefersDark) || (nextTheme === 'light' && !systemPrefersDark);

      if (matchesSystemPreference) {
        safeWriteTheme(null);
      } else {
        safeWriteTheme(nextTheme);
      }
    });
  }

  if (navToggle && navLinks) {
    const navAnchors = Array.from(navLinks.querySelectorAll('a'));
    const mobileNavQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(max-width: 820px)') : null;

    const setAnchorTabIndex = (value) => {
      navAnchors.forEach((anchor) => {
        if (value === null) {
          anchor.removeAttribute('tabindex');
        } else {
          anchor.tabIndex = value;
        }
      });
    };

    const closeMobileNav = () => {
      navLinks.classList.remove('open');
      navLinks.setAttribute('aria-hidden', 'true');
      setAnchorTabIndex(-1);
      navToggle.setAttribute('aria-expanded', 'false');
    };

    const openMobileNav = () => {
      navLinks.classList.add('open');
      navLinks.setAttribute('aria-hidden', 'false');
      setAnchorTabIndex(null);
      navToggle.setAttribute('aria-expanded', 'true');
    };

    const syncNavForViewport = () => {
      if (mobileNavQuery && mobileNavQuery.matches) {
        closeMobileNav();
      } else {
        navLinks.classList.remove('open');
        navLinks.removeAttribute('aria-hidden');
        setAnchorTabIndex(null);
        navToggle.setAttribute('aria-expanded', 'false');
      }
    };

    if (mobileNavQuery) {
      mobileNavQuery.addEventListener('change', syncNavForViewport);
    }

    syncNavForViewport();

    navToggle.addEventListener('click', () => {
      if (mobileNavQuery && !mobileNavQuery.matches) {
        return;
      }

      if (navLinks.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement && (!mobileNavQuery || mobileNavQuery.matches)) {
        closeMobileNav();
      }
    });
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
