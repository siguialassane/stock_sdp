import { Sparkles } from "lucide-react";

import { FrontCharacters } from "@/features/auth/login/front-characters";
import { TallCharacters } from "@/features/auth/login/tall-characters";
import { useLoginIllustration } from "@/features/auth/login/use-login-illustration";

interface LoginIllustrationProps {
  hasPassword: boolean;
  identifierFocused: boolean;
  passwordFocused: boolean;
  passwordVisible: boolean;
}

export function LoginIllustration(props: LoginIllustrationProps) {
  const animation = useLoginIllustration(props);

  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground lg:flex">
      <div className="relative z-20 flex items-center gap-2 text-lg font-semibold">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
          <Sparkles className="size-4" />
        </div>
        <span>StockFlow</span>
      </div>

      <div className="relative z-20 flex h-[800px] items-end justify-center">
        <div className="relative h-[680px] w-[935px] [perspective:800px]">
          <TallCharacters
            blackBlinking={animation.blackBlinking}
            blackPosition={animation.blackPosition}
            blackRef={animation.blackRef}
            hasHiddenPassword={props.hasPassword && !props.passwordVisible}
            identifierFocused={props.identifierFocused}
            isLookingAtEachOther={animation.isLookingAtEachOther}
            isPasswordFocused={props.passwordFocused}
            isPasswordPeekMode={animation.isPasswordPeekMode}
            pointer={animation.pointer}
            purpleBlinking={animation.purpleBlinking}
            purplePeeking={animation.purplePeeking}
            purplePosition={animation.purplePosition}
            purpleRef={animation.purpleRef}
          />
          <FrontCharacters
            isPasswordFocused={props.passwordFocused}
            isPasswordPeekMode={animation.isPasswordPeekMode}
            orangeLook={animation.orangeLook}
            orangePosition={animation.orangePosition}
            orangeRef={animation.orangeRef}
            pointer={animation.pointer}
            yellowLook={animation.yellowLook}
            yellowPosition={animation.yellowPosition}
            yellowRef={animation.yellowRef}
          />
        </div>
      </div>

      <div className="relative z-20 h-5" />
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute right-1/4 top-1/4 size-64 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 size-96 rounded-full bg-primary-foreground/5 blur-3xl" />
    </aside>
  );
}
