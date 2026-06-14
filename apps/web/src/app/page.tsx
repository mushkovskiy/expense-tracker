import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="text-4xl font-bold">Expense Tracker</h1>
      <p className="text-muted-foreground">Track your expenses, categories, and budgets.</p>
      <div className="flex gap-4">
        <Link className="underline" href="/login">
          Login
        </Link>
        <Link className="underline" href="/register">
          Register
        </Link>
      </div>
    </main>
  );
}
