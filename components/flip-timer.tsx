"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function DigitRoll({ value }: { value: number }) {
  const v = Math.max(0, Math.floor(value)) % 10;
  const prev = usePrevious(v);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (prev !== v) {
      setAnim(true);
      const id = setTimeout(() => setAnim(false), 450);
      return () => clearTimeout(id);
    }
  }, [v, prev]);

  // Stack previous and current vertically and slide
  return (
    <div
      className={cn(
        "relative h-10 w-7 overflow-hidden rounded-md border bg-card text-center font-mono text-xl leading-10 shadow-sm"
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute left-0 top-0 w-full transition-transform duration-300 ease-out",
          anim && "-translate-y-10"
        )}
      >
        <div className="h-10 w-full">{prev}</div>
        <div className="h-10 w-full">{v}</div>
      </div>
      {!anim && <div className="invisible h-10 w-full">{v}</div>}
    </div>
  );
}

function TwoDigits({ value }: { value: number }) {
  const tens = Math.floor(value / 10) % 10;
  const ones = value % 10;
  return (
    <div className="flex items-center gap-1">
      <DigitRoll value={tens} />
      <DigitRoll value={ones} />
    </div>
  );
}

export function FlipTimer({
  seconds,
  progress,
}: {
  seconds: number;
  progress?: number;
}) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pct = Math.max(0, Math.min(100, progress ?? 0));
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-3">
        <div
          className="flex size-8 items-center justify-center rounded-md border bg-card shadow-sm"
          aria-hidden="true"
        >
          <span className="font-mono text-sm">🕒</span>
        </div>
        <div className="flex items-center gap-3">
          {hours >= 10 ? (
            <TwoDigits value={hours % 100} />
          ) : (
            <DigitRoll value={hours} />
          )}
          <span className="font-mono text-lg opacity-60">:</span>
          <TwoDigits value={minutes} />
          <span className="font-mono text-lg opacity-60">:</span>
          <TwoDigits value={secs} />
        </div>
      </div>

      {/* progress bar */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="relative h-1 w-40 rounded bg-gray-200 sm:w-56"
      >
        <div
          className="absolute left-0 top-0 h-full rounded bg-primary transition-[width] duration-500"
          style={{ width: `${100 - pct}%` }}
        />
      </div>
    </div>
  );
}
