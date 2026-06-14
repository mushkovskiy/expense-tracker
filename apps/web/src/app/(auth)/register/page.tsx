export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Register</h1>
        {/* TODO: build register form and submit to /api/auth/register */}
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input id="name" name="name" type="text" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <button type="submit" className="w-full rounded bg-black px-3 py-2 text-white">
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
