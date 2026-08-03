import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { SignOutButton } from "@/app/admin/sign-out-button";

interface NavItem {
  href: string;
  label: string;
  ownerOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "דשבורד" },
  { href: "/admin/professionals", label: "בעלי מקצוע" },
  { href: "/admin/banners", label: "באנרים" },
  { href: "/admin/articles", label: "מאמרים" },
  { href: "/admin/users", label: "משתמשים", ownerOnly: true },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-l border-border bg-background p-4">
        <div className="mb-6 text-lg font-semibold text-brand">ניהול האתר</div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.filter((item) => !item.ownerOnly || admin.role === "owner").map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm hover:bg-border/50"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="mt-8 border-t border-border pt-4 text-xs text-muted">
          <div className="mb-2">{admin.email}</div>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
