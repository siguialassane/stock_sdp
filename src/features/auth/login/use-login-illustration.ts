import { useEffect, useRef, useState, type RefObject } from "react";

import type { PointerPosition } from "@/features/auth/login/character-eyes";
import {
  useRandomBlink,
  useTemporaryLook,
  useWanderingLook,
} from "@/features/auth/login/login-animation-hooks";
import { usePeeking } from "@/features/auth/login/use-peeking";

export interface CharacterPosition {
  bodySkew: number;
  faceX: number;
  faceY: number;
}

function getCharacterPosition(
  ref: RefObject<HTMLDivElement | null>,
  pointer: PointerPosition,
): CharacterPosition {
  if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
  const rect = ref.current.getBoundingClientRect();
  const deltaX = pointer.x - (rect.left + rect.width / 2);
  const deltaY = pointer.y - (rect.top + rect.height / 3);
  return {
    faceX: Math.max(-15, Math.min(15, deltaX / 20)),
    faceY: Math.max(-10, Math.min(10, deltaY / 30)),
    bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
  };
}

export function useLoginIllustration({
  identifierFocused,
  passwordFocused,
  passwordVisible,
  hasPassword,
}: {
  identifierFocused: boolean;
  passwordFocused: boolean;
  passwordVisible: boolean;
  hasPassword: boolean;
}) {
  const [pointer, setPointer] = useState<PointerPosition>({ x: 0, y: 0 });
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);
  const blackBlinking = useRandomBlink();
  const isLookingAtEachOther = useTemporaryLook(identifierFocused);
  const isPasswordPeekMode = hasPassword && passwordVisible;
  const orangeLook = useWanderingLook(passwordFocused, -12, -2);
  const purpleBlinking = useRandomBlink();
  const purplePeeking = usePeeking(isPasswordPeekMode);
  const yellowLook = useWanderingLook(passwordFocused, -11, -3);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => setPointer({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return {
    blackBlinking,
    blackPosition: getCharacterPosition(blackRef, pointer),
    blackRef,
    isLookingAtEachOther,
    isPasswordPeekMode,
    orangeLook,
    orangePosition: getCharacterPosition(orangeRef, pointer),
    orangeRef,
    pointer,
    purpleBlinking,
    purplePeeking,
    purplePosition: getCharacterPosition(purpleRef, pointer),
    purpleRef,
    yellowLook,
    yellowPosition: getCharacterPosition(yellowRef, pointer),
    yellowRef,
  };
}
