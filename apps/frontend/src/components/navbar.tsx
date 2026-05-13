import { A } from "@solidjs/router";
import { User, Shield } from "lucide-solid";
import { useAuthSession } from "@/features/auth/hooks";
import { cn } from "@/lib/cn";

const routes = [
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "About", path: "/about" },
];

export function Navbar() {
  const auth = useAuthSession();

  return (
    <header class="mb-8 flex items-center justify-between">
      <div class="flex items-baseline gap-4 sm:gap-10">
        <A href="/" class="flex items-center group">
          <h2 class="text-xl leading-tight font-bold sm:text-2xl">decktype</h2>
        </A>

        <nav class="flex items-center gap-3 sm:gap-8">
          {routes.map((route) => {
            return (
              <A
                href={route.path}
                activeClass="text-(--main)"
                inactiveClass="text-(--sub) hover:text-(--text)"
                class="transition"
              >
                <p class="text-sm leading-normal sm:text-base">
                  {route.label.toLowerCase()}
                </p>
              </A>
            );
          })}
          {auth.isAdmin() && (
            <A
              href="/admin"
              activeClass="text-(--main)"
              inactiveClass="text-(--sub) hover:text-(--text)"
              class="flex items-center gap-1 transition"
            >
              <Shield size={14} strokeWidth={2} />
              <p class="text-sm leading-normal sm:text-base">admin</p>
            </A>
          )}
        </nav>
      </div>

      <div class="flex items-center text-(--sub)">
        <A
          href={
            auth.isAuthenticated() ? `/profile/${auth.username()}` : "/profile"
          }
          activeClass="text-(--text)"
          inactiveClass="hover:text-(--text)"
          class="flex items-center gap-1.5 sm:gap-2 transition"
          aria-label={`Profile: ${auth.username()}`}
        >
          <User size={18} strokeWidth={2} class="shrink-0" />
          <div
            class={cn(
              "hidden sm:block transition-all",
              auth.username().length > 25
                ? "max-w-[15rem] text-xs"
                : auth.username().length > 18
                  ? "max-w-[12rem] text-xs"
                  : "max-w-[14rem] text-base",
            )}
          >
            <p class="leading-tight">{auth.username()}</p>
          </div>
        </A>
      </div>
    </header>
  );
}
