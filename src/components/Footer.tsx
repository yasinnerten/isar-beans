import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-coffee-100 bg-cream py-12">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <div className="flex flex-col items-center gap-2">
          <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-9 w-9 object-contain" />
          <h3 className="text-lg font-bold tracking-tight text-coffee-900">grabthebeans</h3>
          <p className="max-w-md text-sm text-coffee-600">The loyalty app for coffee lovers.</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-coffee-700">
          <Link href="/auth/login" className="hover:text-coffee-900">Shop Login</Link>
          <Link href="/auth/register" className="hover:text-coffee-900">Register</Link>
          <Link href="/scan" className="hover:text-coffee-900">Scan QR</Link>
        </div>
        <p className="mt-8 text-xs text-coffee-500">© {new Date().getFullYear()} grabthebeans</p>
      </div>
    </footer>
  );
}
