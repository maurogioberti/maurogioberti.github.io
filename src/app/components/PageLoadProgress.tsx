'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const INITIAL_PROGRESS = 0.12;
const MAX_PROGRESS = 0.9;
const MIN_VISIBLE_MS = 140;
const HIDE_DELAY_MS = 220;

export function PageLoadProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const finishTimeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef(0);
  const isLoadingRef = useRef(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a');

      if (!link || link.target === '_blank' || link.hasAttribute('download')) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      const nextUrl = new URL(link.href, currentUrl.href);

      if (nextUrl.origin !== currentUrl.origin) {
        return;
      }

      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) {
        return;
      }

      startLoading();
    };

    const handlePopState = () => {
      startLoading();
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    finishLoading();
  }, [routeKey]);

  function setProgress(value: number) {
    progressRef.current = value;

    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${value})`;
    }
  }

  function clearTimers() {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (finishTimeoutRef.current !== null) {
      window.clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }

  function tick(now: number) {
    const elapsed = now - startTimeRef.current;
    const progress = Math.min(
      MAX_PROGRESS,
      INITIAL_PROGRESS + (1 - Math.exp(-elapsed / 700)) * (MAX_PROGRESS - INITIAL_PROGRESS)
    );

    setProgress(progress);

    if (isLoadingRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(tick);
    }
  }

  function startLoading() {
    if (!containerRef.current) {
      return;
    }

    clearTimers();

    isLoadingRef.current = true;
    startTimeRef.current = performance.now();
    containerRef.current.dataset.state = 'loading';
    setProgress(INITIAL_PROGRESS);
    animationFrameRef.current = window.requestAnimationFrame(tick);
  }

  function finishLoading() {
    if (!containerRef.current) {
      return;
    }

    const elapsed = performance.now() - startTimeRef.current;

    if (isLoadingRef.current && elapsed < MIN_VISIBLE_MS) {
      finishTimeoutRef.current = window.setTimeout(finishLoading, MIN_VISIBLE_MS - elapsed);
      return;
    }

    isLoadingRef.current = false;
    clearTimers();

    if (progressRef.current <= 0) {
      containerRef.current.dataset.state = 'idle';
      return;
    }

    setProgress(1);
    containerRef.current.dataset.state = 'done';

    hideTimeoutRef.current = window.setTimeout(() => {
      if (!containerRef.current) {
        return;
      }

      containerRef.current.dataset.state = 'idle';
      setProgress(0);
    }, HIDE_DELAY_MS);
  }

  return (
    <div ref={containerRef} className="page-load-feedback" data-state="idle" aria-hidden="true">
      <div ref={barRef} className="page-load-feedback-bar" />
      <div className="page-load-feedback-overlay" />
    </div>
  );
}
