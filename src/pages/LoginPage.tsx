"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { signInAdmin } from "@/features/auth/auth.service";


interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
  hidden?: boolean;
}

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
  hidden = false,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };

    // If forced look direction is provided, use that instead of mouse tracking
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  if (hidden) return null;

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};




interface EyeBallProps {
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

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  isClosed = false,
  forceLookX,
  forceLookY
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    // If forced look direction is provided, use that instead of mouse tracking
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: (isClosed || isBlinking) ? `${Math.max(3, size * 0.14)}px` : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
        transform: (isClosed || isBlinking) ? 'scaleX(0.92)' : 'scaleX(1)',
        transition: 'height 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {!(isClosed || isBlinking) && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};





function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [orangeWanderLook, setOrangeWanderLook] = useState({ x: -12, y: -2 });
  const [yellowWanderLook, setYellowWanderLook] = useState({ x: -11, y: -3 });
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect for purple character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000; // Random between 3-7 seconds

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150); // Blink duration 150ms
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking effect for black character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000; // Random between 3-7 seconds

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150); // Blink duration 150ms
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Looking at each other animation when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => {
        setIsLookingAtEachOther(false);
      }, 800); // Look at each other for 1.5 seconds, then back to tracking mouse
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple sneaky peeking animation when typing password and it's visible
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => {
            setIsPurplePeeking(false);
          }, 800); // Peek for 800ms
        }, Math.random() * 3000 + 2000); // Random peek every 2-5 seconds
        return peekInterval;
      };

      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodyRotation: 0 };

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3; // Focus on head area

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    // Face movement (limited range)
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));

    // Body lean (skew for lean while keeping bottom straight) - negative to lean towards mouse
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);
  const isPasswordPeekMode = password.length > 0 && showPassword;

  useEffect(() => {
    if (!isPasswordFocused) {
      setOrangeWanderLook({ x: -12, y: -2 });
      setYellowWanderLook({ x: -11, y: -3 });
      return;
    }

    const wanderingTargets = [
      { x: -12, y: -5 },
      { x: -10, y: 7 },
      { x: -7, y: -10 },
      { x: -14, y: 3 },
      { x: -9, y: 11 },
      { x: -6, y: -1 },
    ];

    let timeoutId: ReturnType<typeof setTimeout>;

    const pickTarget = (current: { x: number; y: number }) => {
      const candidates = wanderingTargets.filter(
        (target) => target.x !== current.x || target.y !== current.y,
      );

      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const scheduleWander = () => {
      setOrangeWanderLook((current) => pickTarget(current));
      setYellowWanderLook((current) => pickTarget(current));

      timeoutId = setTimeout(scheduleWander, 520 + Math.random() * 780);
    };

    timeoutId = setTimeout(scheduleWander, 250);

    return () => clearTimeout(timeoutId);
  }, [isPasswordFocused]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const session = await signInAdmin(username.trim(), password);
      console.log("✅ Login successful!");
      login(session);
      await navigate({ to: "/admin/dashboard", replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Connexion impossible.");
      console.log("❌ Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      {/* Left Content Section */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground">
        <div className="relative z-20">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="size-8 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <span>YourBrand</span>
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[800px]">
          {/* Cartoon Characters */}
          <div className="relative" style={{ width: '935px', height: '680px', perspective: '800px' }}>
            {/* Purple tall rectangle character - Back layer */}
            <div 
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '119px',
                width: '306px',
                height: (isTyping || (password.length > 0 && !showPassword)) ? '748px' : '680px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: isPasswordPeekMode
                  ? `skewX(0deg)`
                  : (isTyping || (password.length > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 10}deg) translateX(68px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Eyes */}
              <div 
                className="absolute flex gap-14 transition-all duration-700 ease-in-out"
                style={{
                  left: isPasswordPeekMode ? `${34}px` : isLookingAtEachOther ? `${94}px` : `${76 + purplePos.faceX}px`,
                  top: isPasswordPeekMode ? `${60}px` : isLookingAtEachOther ? `${110}px` : `${68 + purplePos.faceY}px`,
                }}
              >
                <EyeBall 
                  size={30} 
                  pupilSize={11} 
                  maxDistance={8} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isPurpleBlinking}
                  isClosed={isPasswordFocused}
                  forceLookX={isPasswordPeekMode ? (isPurplePeeking ? 7 : -7) : isLookingAtEachOther ? 5 : undefined}
                  forceLookY={isPasswordPeekMode ? (isPurplePeeking ? 9 : -7) : isLookingAtEachOther ? 7 : undefined}
                />
                <EyeBall 
                  size={30} 
                  pupilSize={11} 
                  maxDistance={8} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isPurpleBlinking}
                  isClosed={isPasswordFocused}
                  forceLookX={isPasswordPeekMode ? (isPurplePeeking ? 7 : -7) : isLookingAtEachOther ? 5 : undefined}
                  forceLookY={isPasswordPeekMode ? (isPurplePeeking ? 9 : -7) : isLookingAtEachOther ? 7 : undefined}
                />
              </div>
            </div>

            {/* Black tall rectangle character - Middle layer */}
            <div 
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '408px',
                width: '204px',
                height: '527px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: isPasswordPeekMode
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 9}deg) translateX(34px)`
                    : (isTyping || (password.length > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Eyes */}
              <div 
                className="absolute flex gap-10 transition-all duration-700 ease-in-out"
                style={{
                  left: isPasswordPeekMode ? `${17}px` : isLookingAtEachOther ? `${54}px` : `${44 + blackPos.faceX}px`,
                  top: isPasswordPeekMode ? `${48}px` : isLookingAtEachOther ? `${20}px` : `${54 + blackPos.faceY}px`,
                }}
              >
                <EyeBall 
                  size={27} 
                  pupilSize={10} 
                  maxDistance={7} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isBlackBlinking}
                  isClosed={isPasswordFocused}
                  forceLookX={isPasswordPeekMode ? -7 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={isPasswordPeekMode ? -7 : isLookingAtEachOther ? -7 : undefined}
                />
                <EyeBall 
                  size={27} 
                  pupilSize={10} 
                  maxDistance={7} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isBlackBlinking}
                  isClosed={isPasswordFocused}
                  forceLookX={isPasswordPeekMode ? -7 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={isPasswordPeekMode ? -7 : isLookingAtEachOther ? -7 : undefined}
                />
              </div>
            </div>

            {/* Orange semi-circle character - Front left */}
            <div 
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '408px',
                height: '340px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '204px 204px 0 0',
                transform: isPasswordFocused
                  ? `skewX(${(orangePos.bodySkew || 0) * 0.35}deg) translateX(-10px)`
                  : isPasswordPeekMode
                    ? `skewX(0deg)` 
                    : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-14 transition-all duration-500 ease-in-out"
                style={{
                  left: isPasswordFocused ? `${139 + (orangePos.faceX || 0)}px` : isPasswordPeekMode ? `${85}px` : `${139 + (orangePos.faceX || 0)}px`,
                  top: isPasswordFocused ? `${153 + (orangePos.faceY || 0)}px` : isPasswordPeekMode ? `${145}px` : `${153 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil
                  size={20}
                  maxDistance={8}
                  pupilColor="#2D2D2D"
                  forceLookX={isPasswordFocused ? orangeWanderLook.x : isPasswordPeekMode ? -9 : undefined}
                  forceLookY={isPasswordFocused ? orangeWanderLook.y : isPasswordPeekMode ? -7 : undefined}
                />
                <Pupil
                  size={20}
                  maxDistance={8}
                  pupilColor="#2D2D2D"
                  forceLookX={isPasswordFocused ? orangeWanderLook.x : isPasswordPeekMode ? -9 : undefined}
                  forceLookY={isPasswordFocused ? orangeWanderLook.y : isPasswordPeekMode ? -7 : undefined}
                />
              </div>
            </div>

            {/* Yellow tall rectangle character - Front right */}
            <div 
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '527px',
                width: '238px',
                height: '391px',
                backgroundColor: '#E8D754',
                borderRadius: '119px 119px 0 0',
                zIndex: 4,
                transform: isPasswordFocused
                  ? `skewX(${(yellowPos.bodySkew || 0) * 0.4}deg) translateX(8px)`
                  : isPasswordPeekMode
                    ? `skewX(0deg)` 
                    : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-10 transition-all duration-500 ease-in-out"
                style={{
                  left: isPasswordFocused ? `${88 + (yellowPos.faceX || 0)}px` : isPasswordPeekMode ? `${34}px` : `${88 + (yellowPos.faceX || 0)}px`,
                  top: isPasswordFocused ? `${68 + (yellowPos.faceY || 0)}px` : isPasswordPeekMode ? `${60}px` : `${68 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil
                  size={20}
                  maxDistance={8}
                  pupilColor="#2D2D2D"
                  forceLookX={isPasswordFocused ? yellowWanderLook.x : isPasswordPeekMode ? -9 : undefined}
                  forceLookY={isPasswordFocused ? yellowWanderLook.y : isPasswordPeekMode ? -7 : undefined}
                />
                <Pupil
                  size={20}
                  maxDistance={8}
                  pupilColor="#2D2D2D"
                  forceLookX={isPasswordFocused ? yellowWanderLook.x : isPasswordPeekMode ? -9 : undefined}
                  forceLookY={isPasswordFocused ? yellowWanderLook.y : isPasswordPeekMode ? -7 : undefined}
                />
              </div>
              <div 
                className="absolute w-32 h-[7px] bg-[#2D2D2D] rounded-full transition-all duration-500 ease-in-out"
                style={{
                  left: isPasswordFocused ? `${68 + (yellowPos.faceX || 0)}px` : isPasswordPeekMode ? `${17}px` : `${68 + (yellowPos.faceX || 0)}px`,
                  top: isPasswordFocused ? `${150 + (yellowPos.faceY || 0)}px` : isPasswordPeekMode ? `${150}px` : `${150 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Contact
          </a>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Right Login Section */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[480px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <span>YourBrand</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-[400px] flex-col space-y-8 pt-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-base font-medium">Identifiant</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="h-14 bg-background border-border/60 px-4 text-base focus:border-primary"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  className="h-14 bg-background border-border/60 px-4 pr-12 text-base focus:border-primary"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-medium" 
              size="lg" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Log in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
export const Component = LoginPage;
