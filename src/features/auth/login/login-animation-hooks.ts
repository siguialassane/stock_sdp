import { useEffect, useState } from "react";

import type { PointerPosition } from "@/features/auth/login/character-eyes";

const WANDERING_TARGETS = [
  { x: -12, y: -5 },
  { x: -10, y: 7 },
  { x: -7, y: -10 },
  { x: -14, y: 3 },
  { x: -9, y: 11 },
  { x: -6, y: -1 },
];

export function useRandomBlink() {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlinking(true);
        timer = setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 150);
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return blinking;
}

export function useWanderingLook(active: boolean, initialX: number, initialY: number) {
  const [look, setLook] = useState<PointerPosition>({ x: initialX, y: initialY });

  useEffect(() => {
    if (!active) {
      setLook({ x: initialX, y: initialY });
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      setLook((current) => {
        const choices = WANDERING_TARGETS.filter(
          (target) => target.x !== current.x || target.y !== current.y,
        );
        return choices[Math.floor(Math.random() * choices.length)];
      });
      timer = setTimeout(schedule, 520 + Math.random() * 780);
    };
    timer = setTimeout(schedule, 250);
    return () => clearTimeout(timer);
  }, [active, initialX, initialY]);

  return look;
}

export function useTemporaryLook(active: boolean) {
  const [looking, setLooking] = useState(false);

  useEffect(() => {
    if (!active) {
      setLooking(false);
      return;
    }
    setLooking(true);
    const timer = setTimeout(() => setLooking(false), 800);
    return () => clearTimeout(timer);
  }, [active]);

  return looking;
}
