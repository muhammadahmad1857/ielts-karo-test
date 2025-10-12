import { useEffect, useState } from "react";

export default function useCountdown(totalSeconds: number, isLocked: boolean) {
  const [left, setLeft] = useState(totalSeconds);
  useEffect(() => {
    if (isLocked || left <= 0) return;
    const id = setInterval(() => setLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [left, isLocked]);
  return {left};
}
