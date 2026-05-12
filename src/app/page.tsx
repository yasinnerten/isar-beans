import Link from "next/link";
import ShopsMapWrapper from "@/components/ShopsMapWrapper";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream text-coffee-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-5 pt-16 pb-20 text-center sm:pt-24">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-coffee-100">
            <img src="/grabthebeans-logo.png" alt="grabthebeans" className="h-14 w-14 object-contain" />
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-coffee-900 sm:text-6xl">
            Collect Beans.<br />
            <span className="text-coffee-500">Earn Free Coffee.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-coffee-600">
            grabthebeans is the loyalty app for coffee shops.
            Scan a QR code, collect beans, and your rewards live right in your Apple Wallet.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/register" className="btn-primary">
              Register your shop + 50 free beans
            </Link>
            <a href="#how-it-works" className="btn-ghost">
              How it works
            </a>
          </div>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-coffee-100 pt-8 text-left">
            <Stat value="50" label="Free beans on signup" />
            <Stat value="🍎" label="Apple Wallet powered" />
            <Stat value="QR" label="Instant scan & collect" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-sand py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How grabthebeans Works</h2>
            <p className="mt-3 text-coffee-600">Three simple steps to free coffee</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { icon: "📱", title: "Scan the QR", desc: "Use your iPhone camera to scan the grabthebeans QR code at your favourite coffee shop. No app needed." },
              { icon: "☕", title: "Show your code", desc: "A unique coffee-themed code appears in your Apple Wallet card. Show it to the barista. They approve your bean in seconds." },
              { icon: "🎁", title: "Earn rewards", desc: "Beans stack up in your Wallet card. Reach the shop threshold and claim your free coffee or discount!" },
            ].map((s, i) => (
              <div key={i} className="surface p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sand text-2xl">{s.icon}</div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-coffee-500">Step {i + 1}</p>
                <h3 className="mt-1 text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-coffee-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Shop Owners */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">For Coffee Shop Owners</h2>
            <p className="mt-3 text-coffee-600">Everything you need to reward loyal customers</p>
            <ul className="mt-7 space-y-3">
              {[
                "Simple web dashboard – no special hardware",
                "Approve bean collections with one click",
                "Set your own reward threshold",
                "Buy beans in bulk or subscribe for daily beans",
                "See all your loyal customers at a glance",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-coffee-900 text-[11px] font-bold text-cream">✓</span>
                  <span className="text-coffee-800">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="btn-primary mt-8 inline-block">
              Register your shop — it&apos;s free ☕
            </Link>
          </div>

          <div className="grid gap-4">
            <div className="surface p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-coffee-500">Starter</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">€50<span className="text-sm font-normal text-coffee-500">/mo</span></p>
              <p className="mt-2 text-sm text-coffee-600">50 beans / day</p>
            </div>
            <div className="surface relative p-6 ring-2 ring-coffee-900">
              <span className="absolute -top-2.5 right-4 rounded-full bg-coffee-900 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cream">Popular</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-coffee-500">Pro</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">€100<span className="text-sm font-normal text-coffee-500">/mo</span></p>
              <p className="mt-2 text-sm text-coffee-600">100 beans / day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="bg-sand py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Find grabthebeans Shops</h2>
            <p className="mt-3 text-coffee-600">Discover which coffee shops accept grabthebeans right now</p>
          </div>
          <div className="mt-10 rounded-2xl overflow-hidden shadow-lg border border-coffee-200" style={{ height: 450 }}>
            <ShopsMapWrapper />
          </div>
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5">
          <div className="surface coffee-gradient p-12 text-center text-cream">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sign up & get 50 free beans</h2>
            <p className="mx-auto mt-3 max-w-lg text-coffee-100/90">
              Register your coffee shop today and start rewarding your customers immediately. No credit card required.
            </p>
            <Link
              href="/auth/register"
              className="mt-7 inline-block rounded-full bg-cream px-6 py-3 font-semibold text-coffee-900 transition hover:bg-white"
            >
              Get started — 50 beans free ☕ →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold tracking-tight text-coffee-900">{value}</p>
      <p className="mt-1 text-xs text-coffee-600">{label}</p>
    </div>
  );
}
