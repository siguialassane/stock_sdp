import type { RefObject } from "react";

import { Pupil, type PointerPosition } from "@/features/auth/login/character-eyes";
import type { CharacterPosition } from "@/features/auth/login/use-login-illustration";

interface FrontCharactersProps {
  isPasswordFocused: boolean;
  isPasswordPeekMode: boolean;
  orangeLook: PointerPosition;
  orangePosition: CharacterPosition;
  orangeRef: RefObject<HTMLDivElement | null>;
  pointer: PointerPosition;
  yellowLook: PointerPosition;
  yellowPosition: CharacterPosition;
  yellowRef: RefObject<HTMLDivElement | null>;
}

export function FrontCharacters({
  isPasswordFocused,
  isPasswordPeekMode,
  orangeLook,
  orangePosition,
  orangeRef,
  pointer,
  yellowLook,
  yellowPosition,
  yellowRef,
}: FrontCharactersProps) {
  return (
    <>
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 0,
          width: 408,
          height: 340,
          zIndex: 3,
          backgroundColor: "#FF9B6B",
          borderRadius: "204px 204px 0 0",
          transform: isPasswordFocused
            ? `skewX(${orangePosition.bodySkew * 0.35}deg) translateX(-10px)`
            : isPasswordPeekMode
              ? "skewX(0deg)"
              : `skewX(${orangePosition.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-14 transition-all duration-500 ease-in-out"
          style={{
            left: isPasswordFocused ? 139 + orangePosition.faceX : isPasswordPeekMode ? 85 : 139 + orangePosition.faceX,
            top: isPasswordFocused ? 153 + orangePosition.faceY : isPasswordPeekMode ? 145 : 153 + orangePosition.faceY,
          }}
        >
          {[0, 1].map((eye) => (
            <Pupil
              key={eye}
              pointer={pointer}
              size={20}
              maxDistance={8}
              pupilColor="#2D2D2D"
              forceLookX={isPasswordFocused ? orangeLook.x : isPasswordPeekMode ? -9 : undefined}
              forceLookY={isPasswordFocused ? orangeLook.y : isPasswordPeekMode ? -7 : undefined}
            />
          ))}
        </div>
      </div>

      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 527,
          width: 238,
          height: 391,
          backgroundColor: "#E8D754",
          borderRadius: "119px 119px 0 0",
          zIndex: 4,
          transform: isPasswordFocused
            ? `skewX(${yellowPosition.bodySkew * 0.4}deg) translateX(8px)`
            : isPasswordPeekMode
              ? "skewX(0deg)"
              : `skewX(${yellowPosition.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-10 transition-all duration-500 ease-in-out"
          style={{
            left: isPasswordFocused ? 88 + yellowPosition.faceX : isPasswordPeekMode ? 34 : 88 + yellowPosition.faceX,
            top: isPasswordFocused ? 68 + yellowPosition.faceY : isPasswordPeekMode ? 60 : 68 + yellowPosition.faceY,
          }}
        >
          {[0, 1].map((eye) => (
            <Pupil
              key={eye}
              pointer={pointer}
              size={20}
              maxDistance={8}
              pupilColor="#2D2D2D"
              forceLookX={isPasswordFocused ? yellowLook.x : isPasswordPeekMode ? -9 : undefined}
              forceLookY={isPasswordFocused ? yellowLook.y : isPasswordPeekMode ? -7 : undefined}
            />
          ))}
        </div>
        <div
          className="absolute h-[7px] w-32 rounded-full bg-[#2D2D2D] transition-all duration-500 ease-in-out"
          style={{
            left: isPasswordFocused ? 68 + yellowPosition.faceX : isPasswordPeekMode ? 17 : 68 + yellowPosition.faceX,
            top: isPasswordFocused ? 150 + yellowPosition.faceY : 150,
          }}
        />
      </div>
    </>
  );
}
