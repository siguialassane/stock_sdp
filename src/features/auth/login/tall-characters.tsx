import type { RefObject } from "react";

import { EyeBall, type PointerPosition } from "@/features/auth/login/character-eyes";
import type { CharacterPosition } from "@/features/auth/login/use-login-illustration";

interface TallCharactersProps {
  blackBlinking: boolean;
  blackPosition: CharacterPosition;
  blackRef: RefObject<HTMLDivElement | null>;
  hasHiddenPassword: boolean;
  identifierFocused: boolean;
  isLookingAtEachOther: boolean;
  isPasswordFocused: boolean;
  isPasswordPeekMode: boolean;
  pointer: PointerPosition;
  purpleBlinking: boolean;
  purplePeeking: boolean;
  purplePosition: CharacterPosition;
  purpleRef: RefObject<HTMLDivElement | null>;
}

export function TallCharacters({
  blackBlinking,
  blackPosition,
  blackRef,
  hasHiddenPassword,
  identifierFocused,
  isLookingAtEachOther,
  isPasswordFocused,
  isPasswordPeekMode,
  pointer,
  purpleBlinking,
  purplePeeking,
  purplePosition,
  purpleRef,
}: TallCharactersProps) {
  const charactersReactToIdentifier = identifierFocused || hasHiddenPassword;

  return (
    <>
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 119,
          width: 306,
          height: charactersReactToIdentifier ? 748 : 680,
          backgroundColor: "#6C3FF5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: isPasswordPeekMode
            ? "skewX(0deg)"
            : charactersReactToIdentifier
              ? `skewX(${purplePosition.bodySkew - 10}deg) translateX(68px)`
              : `skewX(${purplePosition.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-14 transition-all duration-700 ease-in-out"
          style={{
            left: isPasswordPeekMode ? 34 : isLookingAtEachOther ? 94 : 76 + purplePosition.faceX,
            top: isPasswordPeekMode ? 60 : isLookingAtEachOther ? 110 : 68 + purplePosition.faceY,
          }}
        >
          {[0, 1].map((eye) => (
            <EyeBall
              key={eye}
              pointer={pointer}
              size={30}
              pupilSize={11}
              maxDistance={8}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={purpleBlinking}
              isClosed={isPasswordFocused}
              forceLookX={isPasswordPeekMode ? (purplePeeking ? 7 : -7) : isLookingAtEachOther ? 5 : undefined}
              forceLookY={isPasswordPeekMode ? (purplePeeking ? 9 : -7) : isLookingAtEachOther ? 7 : undefined}
            />
          ))}
        </div>
      </div>

      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: 408,
          width: 204,
          height: 527,
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform: isPasswordPeekMode
            ? "skewX(0deg)"
            : isLookingAtEachOther
              ? `skewX(${blackPosition.bodySkew * 1.5 + 9}deg) translateX(34px)`
              : charactersReactToIdentifier
                ? `skewX(${blackPosition.bodySkew * 1.5}deg)`
                : `skewX(${blackPosition.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-10 transition-all duration-700 ease-in-out"
          style={{
            left: isPasswordPeekMode ? 17 : isLookingAtEachOther ? 54 : 44 + blackPosition.faceX,
            top: isPasswordPeekMode ? 48 : isLookingAtEachOther ? 20 : 54 + blackPosition.faceY,
          }}
        >
          {[0, 1].map((eye) => (
            <EyeBall
              key={eye}
              pointer={pointer}
              size={27}
              pupilSize={10}
              maxDistance={7}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={blackBlinking}
              isClosed={isPasswordFocused}
              forceLookX={isPasswordPeekMode ? -7 : isLookingAtEachOther ? 0 : undefined}
              forceLookY={isPasswordPeekMode ? -7 : isLookingAtEachOther ? -7 : undefined}
            />
          ))}
        </div>
      </div>
    </>
  );
}
