import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Users,
  Sparkles,
  Tag,
  UserCog,
  Clock,
  Quote,
  Images,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Logo from "@/components/site/Logo";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/panel", label: "Pulpit", icon: LayoutDashboard, exact: true },
  { to: "/panel/grafik", label: "Grafik i obecność", icon: CalendarDays, staff: true },
  { to: "/panel/treningi", label: "Treningi 1:1", icon: UserRound },
  { to: "/panel/klienci", label: "Klientki", icon: Users, staff: true },
  { to: "/panel/oferta", label: "Oferta", icon: Sparkles },
  { to: "/panel/cennik", label: "Cennik i promocje", icon: Tag },
  { to: "/panel/zespol", label: "Zespół", icon: UserCog },
  { to: "/panel/dostepnosc", label: "Dostępność", icon: Clock, staff: true },
  { to: "/panel/opinie", label: "Opinie", icon: Quote },
  { to: "/panel/galeria", label: "Galeria", icon: Images },
  { to: "/panel/ustawienia", label: "Ustawienia", icon: Settings },
];

export const Route = createFileRoute("/_authed/panel")({
  component: PanelLayout,
});

function PanelLayout() {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = user?.role === "admin";
  const nav = NAV.filter((item) => isAdmin || item.staff);

  const isActive = (item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="min-h-screen bg-[#F3EFE8] text-graphite">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-graphite/10 bg-bone px-5 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <p className="mt-6 text-[0.58rem] uppercase tracking-[0.2em] text-graphite/35">
          Panel studia
        </p>
        <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 text-[0.82rem] transition-colors",
                  isActive(item)
                    ? "bg-graphite text-bone"
                    : "text-graphite/65 hover:bg-sand/50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-graphite/10 pt-4">
          <p className="truncate text-[0.75rem] text-graphite/60">{user?.email}</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link to="/" className="flex items-center gap-2 py-1 text-[0.75rem] text-graphite/50 hover:text-graphite">
              <ArrowLeft className="h-3.5 w-3.5" /> Strona studia
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-2 py-1 text-[0.75rem] text-graphite/50 hover:text-graphite"
            >
              <LogOut className="h-3.5 w-3.5" /> Wyloguj
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-graphite/10 bg-bone/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/panel">
              <Logo size="sm" />
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/" aria-label="Strona studia" className="text-graphite/50">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <button type="button" onClick={() => logout()} aria-label="Wyloguj" className="text-graphite/50">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.72rem] transition-colors",
                  isActive(item)
                    ? "border-graphite bg-graphite text-bone"
                    : "border-graphite/20 text-graphite/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}