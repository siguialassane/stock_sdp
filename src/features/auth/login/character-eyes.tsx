import { useRef } from "react";

export interface PointerPosition {
  x: number;
  y: number;
}

interface EyeProps {
  pointer: PointerPosition;
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  isClosed?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

function getOffset(
  element: HTMLDivElement | null,
  pointer: PointerPosition,
  maxDistance: number,
) {
  if (!element) return { x: 0, y: 0 };
  const rect = element.getBoundingClientRect();
  const deltaX = pointer.x - (rect.left + rect.width / 2);
  const deltaY = pointer.y - (rect.top + rect.height / 2);
  const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
  const angle = Math.atan2(deltaY, deltaX);
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}

export function EyeBall({
  pointer,
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  isClosed = false,
  forceLookX,
  forceLookY,
}: EyeProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const closed = isClosed || isBlinking;
  const offset = forceLookX === undefined || forceLookY === undefined
    ? getOffset(eyeRef.current, pointer, maxDistance)
    : { x: forceLookX, y: forceLookY };

  return (
    <div
      ref={eyeRef}
      className="flex items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: closed ? Math.max(3, size * 0.14) : size,
        backgroundColor: eyeColor,
        transform: closed ? "scaleX(0.92)" : "scaleX(1)",
        transition: "height 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {!closed ? (
        <div
          className="rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            backgroundColor: pupilColor,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: "transform 100ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}

export function Pupil({
  pointer,
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: Omit<EyeProps, "pupilSize" | "eyeColor" | "isBlinking" | "isClosed">) {
  const pupilRef = useRef<HTMLDivElement>(null);
  const offset = forceLookX === undefined || forceLookY === undefined
    ? getOffset(pupilRef.current, pointer, maxDistance)
    : { x: forceLookX, y: forceLookY };

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: pupilColor,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 100ms ease-out",
      }}
    />
  );
}
