import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-coffee-100/80 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-9 w-9 object-contain" />
          <span className="text-base font-bold tracking-tight text-coffee-900">grabthebeans</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <a href="/#how-it-works" className="text-coffee-700 hover:text-coffee-900">How it works</a>
          <a href="/#map" className="text-coffee-700 hover:text-coffee-900">Find shops</a>
          <Link href="/auth/login" className="text-coffee-700 hover:text-coffee-900">Shop Login</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/register"
            className="hidden rounded-full bg-coffee-900 px-4 py-2 text-sm font-semibold text-cream transition hover:bg-coffee-800 md:inline-block"
          >
            Register Shop
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-coffee-900 px-3 py-1.5 text-xs font-semibold text-cream md:hidden"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
