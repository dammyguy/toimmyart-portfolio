import { useLayoutEffect } from 'react';

const REVEAL_SELECTOR = '.reveal, .reveal-item';

export default function useScrollReveal() {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    const revealAll = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        element.classList.add('is-visible');
      });
    };

    if (prefersReducedMotion.matches) {
      revealAll();
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -4% 0px',
      }
    );

    const revealInView = () => {
      const visibleElements = [...document.querySelectorAll(REVEAL_SELECTOR)]
        .filter((element) => {
          if (
            !element.isConnected ||
            element.classList.contains('is-visible')
          ) {
            return false;
          }

          const rect = element.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        });

      visibleElements.forEach((element) => {
        element.classList.add('is-visible');
        observer.unobserve(element);
      });
    };

    const observeElements = (root) => {
      if (!(root instanceof Element) && root !== document) return;

      if (
        root instanceof Element &&
        root.matches(REVEAL_SELECTOR) &&
        !root.classList.contains('is-visible')
      ) {
        observer.observe(root);
      }

      root.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (!element.classList.contains('is-visible')) {
          observer.observe(element);
        }
      });
    };

    const refreshReveals = () => {
      observeElements(document.querySelector('main') ?? document.body);
      revealInView();
    };

    observeElements(document);
    document.documentElement.classList.add('scroll-reveal-ready');
    revealInView();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            observeElements(node);
          }
        });
      });
      revealInView();
    });

    mutationObserver.observe(document.querySelector('main') ?? document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('portfolio:navigate', refreshReveals);
    window.addEventListener('scroll', revealInView, { passive: true });
    window.addEventListener('resize', revealInView);
    window.addEventListener('focus', refreshReveals);
    document.addEventListener('visibilitychange', refreshReveals);

    return () => {
      window.removeEventListener('portfolio:navigate', refreshReveals);
      window.removeEventListener('scroll', revealInView);
      window.removeEventListener('resize', revealInView);
      window.removeEventListener('focus', refreshReveals);
      document.removeEventListener('visibilitychange', refreshReveals);
      mutationObserver.disconnect();
      observer.disconnect();
      document.documentElement.classList.remove('scroll-reveal-ready');
    };
  }, []);
}
