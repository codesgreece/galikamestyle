"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Clock3,
  FilePenLine,
  Home,
  ImageIcon,
  LogOut,
  Menu,
  Pencil,
  Settings,
  Tag,
  X,
} from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/nav";
import { logoutAction } from "@/app/admingermanika/actions/auth";

const icons = {
  home: Home,
  calendar: CalendarDays,
  clock: Clock3,
  tag: Tag,
  pen: FilePenLine,
  edit: Pencil,
  image: ImageIcon,
  chart: BarChart3,
  settings: Settings,
} as const;

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full flex-col bg-[var(--admin-navy)] text-[#fffcf7]">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/50">
          Admin
        </p>
        <p className="admin-display mt-2 text-2xl leading-tight">
          Γερμανικά με Στυλ
        </p>
        <p className="mt-1 text-sm text-white/55">Panel διαχείρισης</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
        {ADMIN_NAV.map((item) => {
          const Icon = icons[item.icon];
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="admin-sidebar-link"
              data-active={active}
              onClick={() => setOpen(false)}
            >
              <Icon size={18} aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 rounded-xl bg-white/5 px-3 py-3">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-white/55">{user.email}</p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="admin-sidebar-link w-full">
            <LogOut size={18} aria-hidden />
            Αποσύνδεση
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="admin-root min-h-screen lg:grid lg:grid-cols-[270px_1fr]">
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        {sidebar}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Κλείσιμο μενού"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(86vw,300px)] shadow-2xl">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--admin-line)] bg-[rgba(255,252,247,0.9)] px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="admin-btn admin-btn-ghost lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Άνοιγμα μενού"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--admin-muted)]">
                Γερμανικά με Στυλ
              </p>
              <p className="text-sm text-[var(--admin-ink)]">
                Διαχείριση περιεχομένου
              </p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-ghost text-sm"
          >
            Προβολή website
          </a>
        </header>
        <main className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
