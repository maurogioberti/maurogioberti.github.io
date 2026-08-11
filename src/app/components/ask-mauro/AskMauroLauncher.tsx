'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

// The panel (dialog, conversation state, API client) loads on first open so
// the launcher is the only Ask Mauro code in the initial bundle.
const AskMauroPanel = dynamic(() => import('./AskMauroPanel').then((module) => module.AskMauroPanel), {
  ssr: false,
});

const AVATAR_SRC = '/assets/profile/maurogioberti-avatar.png';
const AVATAR_SIZE = 32;
const LAUNCHER_LABEL = 'Ask Mauro — AI assistant';

export function AskMauroLauncher() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    setOpen((current) => !current);
    setHasOpened(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={LAUNCHER_LABEL}
        title={LAUNCHER_LABEL}
        onClick={handleToggle}
        className="glass-strong fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[70] inline-flex items-center gap-2.5 rounded-full p-1.5 transition-all duration-200 hover:border-vs-primary motion-safe:hover:-translate-y-0.5 sm:pr-4"
      >
        <span className="relative flex-shrink-0">
          <Image src={AVATAR_SRC} alt="" width={AVATAR_SIZE} height={AVATAR_SIZE} className="rounded-full" />
          <span
            className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-vs-background bg-vs-success"
            aria-hidden="true"
          />
        </span>
        <span className="hidden text-sm font-semibold text-vs-heading sm:inline">Ask Mauro</span>
      </button>
      {hasOpened && <AskMauroPanel open={open} onClose={handleClose} />}
    </>
  );
}
