import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Footer() {
  return (
    <footer
      className="w-full text-white"
      style={{ backgroundColor: "#0092DB" }}
      id="footer"
    >
      {/* Newsletter Section */}
      <div
        className="py-16 px-6 md:px-12 lg:px-24"
        style={{ backgroundColor: "#007AB8" }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Join our newsletter</h2>
          <p
            className="mb-8 text-base leading-relaxed"
            style={{ color: "#E0F0FF" }}
          >
            Subscribe to get special offers, free giveaways, and
            once-in-a-lifetime deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-gray-900 placeholder-gray-500 h-12"
            />
            <Button
              className="text-white font-semibold h-12 px-8 transition-all hover:opacity-90"
              style={{ backgroundColor: "#FE8614" }}
            >
              SEND
            </Button>
          </div>
          <p
            className="text-xs mt-4 leading-relaxed"
            style={{ color: "#D0E8FF" }}
          >
            We respect your privacy. View our{" "}
            <Link href="/privacy-policy" className="underline hover:text-white">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms-and-conditions"
              className="underline hover:text-white"
            >
              Terms & Conditions
            </Link>
          </p>
        </div>
      </div>

      {/* Link Sections */}
      <div className=" mx-auto px-6 md:px-12 lg:px-24 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Do You Need Help */}
          <div>
            <h3 className="font-bold text-lg mb-6">Do You Need Help?</h3>
            <ul className="space-y-3 text-sm" style={{ color: "#E0F0FF" }}>
              <li>+251 911 681 100</li>
              <li>support@globaltradehub.com</li>
              <li>Call Center: Mon-Fri 9am-6pm</li>
            </ul>
          </div>

          {/* Let Us Help You */}
          <div>
            <h3 className="font-bold text-lg mb-6">Let Us Help You</h3>
            <ul className="space-y-3 text-sm" style={{ color: "#E0F0FF" }}>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-settings"
                  className="hover:text-white transition-colors"
                >
                  Cookie Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h3 className="font-bold text-lg mb-6">Make Money with Us</h3>
            <ul className="space-y-3 text-sm" style={{ color: "#E0F0FF" }}>
              <li>
                <Link
                  href="/sell"
                  className="hover:text-white transition-colors"
                >
                  Sell on GlobalTradeHUB
                </Link>
              </li>
              <li>
                <Link
                  href="/sell-services"
                  className="hover:text-white transition-colors"
                >
                  Sell Your Services
                </Link>
              </li>
              <li>
                <Link
                  href="/business"
                  className="hover:text-white transition-colors"
                >
                  Sell on Business
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate"
                  className="hover:text-white transition-colors"
                >
                  Become an Affiliate
                </Link>
              </li>
            </ul>
          </div>

          {/* Get to Know Us */}
          <div>
            <h3 className="font-bold text-lg mb-6">Get to Know Us</h3>
            <ul className="space-y-3 text-sm" style={{ color: "#E0F0FF" }}>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About GlobalTradeHUB
                </Link>
              </li>
              <li>
                <Link
                  href="/investor-relations"
                  className="hover:text-white transition-colors"
                >
                  Investor Relations
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-white transition-colors"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* For Buyers */}
          <div>
            <h3 className="font-bold text-lg mb-6">For Buyers</h3>
            <ul className="space-y-3 text-sm" style={{ color: "#E0F0FF" }}>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <BottomFooter />
    </footer>
  );
}

function BottomFooter() {
  return (
    <div
      className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8 border-t"
      style={{ borderColor: "#007AB8" }}
    >
      <p className="text-sm" style={{ color: "#D0E8FF" }}>
        © 2026 GlobalTradeHUB. All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer;
