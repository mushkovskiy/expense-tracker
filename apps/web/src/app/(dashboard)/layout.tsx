import Link from 'next/link';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 border-r p-4">
        <nav className="flex flex-col gap-2">
          <Link href="/expenses">Expenses</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/budgets">Budgets</Link>
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
