import { useEffect, useState } from "react";

export function usePeeking(active: boolean) {
  const [peeking, setPeeking] = useState(false);

  useEffect(() => {
    if (!active) {
      setPeeking(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setPeeking(true);
        timer = setTimeout(() => {
          setPeeking(false);
          schedule();
        }, 800);
      }, 2000 + Math.random() * 3000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [active]);

  return peeking;
}
