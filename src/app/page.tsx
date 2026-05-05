import Link from "next/link";
import ShopsMapWrapper from "@/components/ShopsMapWrapper";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      {/* Navigation */}
      <nav className="bg-[#5c3316] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/grabthebeans-logo.png" alt="grabthebeans logo" className="h-8 w-auto rounded" />
            <span className="text-xl font-bold tracking-wide">grabthebeans</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#how-it-works" className="text-amber-200 hover:text-white transition-colors text-sm">
              How it works
            </Link>
            <Link href="#map" className="text-amber-200 hover:text-white transition-colors text-sm">
              Find shops
            </Link>
            <Link href="/auth/login" className="text-amber-200 hover:text-white transition-colors text-sm">
              Shop Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-amber-400 hover:bg-amber-300 text-[#3b1a08] px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Register Shop
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="coffee-gradient text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/grabthebeans-logo.png" alt="grabthebeans logo" className="h-24 w-auto mx-auto mb-6 rounded-xl" />
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Collect Beans.<br />
            <span className="text-amber-200">Earn Free Coffee.</span>
          </h1>
          <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto">
            grabthebeans is the loyalty app for coffee shops.
            Scan a QR code, collect beans, and your rewards live right in your Apple Wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#how-it-works"
              className="bg-amber-400 hover:bg-amber-300 text-[#3b1a08] px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg"
            >
              🫘 How it works
            </Link>
            <Link
              href="/auth/register"
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Register your shop + 50 free beans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#5c3316] text-white py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-amber-300">50</div>
            <div className="text-amber-100 mt-1">Free beans on signup</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-300">🍎</div>
            <div className="text-amber-100 mt-1">Apple Wallet powered</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-300">QR</div>
            <div className="text-amber-100 mt-1">Instant scan &amp; collect</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5c3316] text-center mb-4">
            How grabthebeans Works
          </h2>
          <p className="text-center text-[#7d4a1e] mb-14 text-lg">Three simple steps to free coffee</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bean-card p-8 text-center">
              <div className="text-5xl mb-4">📱</div>
              <div className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-widest">Step 1</div>
              <h3 className="text-xl font-bold text-[#5c3316] mb-3">Scan the QR</h3>
              <p className="text-[#7d4a1e]">
                Use your iPhone camera to scan the grabthebeans QR code at your favourite coffee shop. No app needed.
              </p>
            </div>
            <div className="bean-card p-8 text-center">
              <div className="text-5xl mb-4">☕</div>
              <div className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-widest">Step 2</div>
              <h3 className="text-xl font-bold text-[#5c3316] mb-3">Show your code</h3>
              <p className="text-[#7d4a1e]">
                A unique coffee-themed code appears in your Apple Wallet card. Show it to the barista. They approve your bean in seconds.
              </p>
            </div>
            <div className="bean-card p-8 text-center">
              <div className="text-5xl mb-4">🎁</div>
              <div className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-widest">Step 3</div>
              <h3 className="text-xl font-bold text-[#5c3316] mb-3">Earn rewards</h3>
              <p className="text-[#7d4a1e]">
                Beans stack up in your Wallet card. Reach the shop threshold and claim your free coffee or discount!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For shop owners */}
      <section className="bg-[#f5e6d0] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#5c3316] mb-6">☕ For Coffee Shop Owners</h2>
              <ul className="space-y-4">
                {[
                  "Simple web dashboard – no special hardware",
                  "Approve bean collections with one click",
                  "Set your own reward threshold",
                  "Buy beans in bulk or subscribe for daily beans",
                  "See all your loyal customers at a glance",
                  "Get your shop listed on the map",
                  "Start with 50 free beans on registration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl mt-0.5">✓</span>
                    <span className="text-[#5c3316]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="inline-block mt-8 bg-[#5c3316] hover:bg-[#7d4a1e] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
              >
                Register your shop — it&apos;s free ☕
              </Link>
            </div>
            <div className="bean-card p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">🫘</div>
                <h3 className="text-xl font-bold text-[#5c3316]">Subscription Plans</h3>
                <p className="text-[#7d4a1e] text-sm mt-1">Scale with your café</p>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-amber-300 rounded-xl p-4 bg-amber-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#5c3316]">Starter</div>
                      <div className="text-sm text-[#7d4a1e]">50 beans / day</div>
                    </div>
                    <div className="text-2xl font-bold text-amber-700">€50<span className="text-sm font-normal">/mo</span></div>
                  </div>
                </div>
                <div className="border-2 border-[#a0622a] rounded-xl p-4 bg-amber-100 relative">
                  <div className="absolute -top-3 right-4 bg-[#5c3316] text-white text-xs px-3 py-1 rounded-full">Popular</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#5c3316]">Pro</div>
                      <div className="text-sm text-[#7d4a1e]">100 beans / day</div>
                    </div>
                    <div className="text-2xl font-bold text-amber-700">€100<span className="text-sm font-normal">/mo</span></div>
                  </div>
                </div>
                <p className="text-xs text-center text-[#7d4a1e] mt-2">Or buy beans individually in the dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[#5c3316] text-center mb-4">🗺 Find grabthebeans Shops</h2>
          <p className="text-center text-[#7d4a1e] mb-10">
            Discover which coffee shops accept grabthebeans right now
          </p>
          <div style={{ height: "450px" }} className="rounded-2xl overflow-hidden shadow-lg border-2 border-amber-200">
            <ShopsMapWrapper />
          </div>
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="coffee-gradient py-20 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Sign up &amp; get 50 free beans</h2>
          <p className="text-amber-100 text-lg mb-8">
            Register your coffee shop today and start rewarding your customers immediately. No credit card required.
          </p>
          <Link
            href="/auth/register"
            className="bg-amber-400 hover:bg-amber-300 text-[#3b1a08] px-10 py-4 rounded-full font-bold text-xl transition-colors shadow-xl inline-block"
          >
            Get started — 50 beans free ☕
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3b1f0d] text-amber-200 py-10 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-2xl font-bold mb-2">grabthebeans</div>
          <p className="text-amber-400 text-sm">The loyalty app for coffee lovers.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/auth/login" className="hover:text-white transition-colors">Shop Login</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/scan" className="hover:text-white transition-colors">Scan QR</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
