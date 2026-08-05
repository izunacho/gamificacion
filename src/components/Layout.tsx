import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListChecks, ScrollText, ShoppingBag } from 'lucide-react';
import { NotificationStack } from './NotificationStack';

const NAV_ITEMS = [
  { to: '/', label: 'Perfil', icon: LayoutDashboard, end: true },
  { to: '/misiones', label: 'Misiones', icon: ListChecks, end: false },
  { to: '/proyectos', label: 'Proyectos', icon: ScrollText, end: false },
  { to: '/tienda', label: 'Tienda', icon: ShoppingBag, end: false },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#161b3a,_#0b1020_60%)] text-white">
      <NotificationStack />

      <div className="mx-auto flex min-h-screen max-w-5xl md:gap-6">
        <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r border-white/10 p-4 md:flex">
          <div className="mb-4 px-2">
            <p className="text-lg font-extrabold tracking-tight text-white">LifeQuest</p>
            <p className="text-xs text-white/40">Gamifica tu vida real</p>
          </div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-indigo-500/20 text-indigo-200' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 px-4 pt-6 pb-24 md:px-0 md:pb-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-slate-950/90 backdrop-blur-md md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                isActive ? 'text-indigo-300' : 'text-white/50'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
