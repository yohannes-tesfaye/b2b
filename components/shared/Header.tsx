import { DesktopHeader } from "./header/DesktopHeader";
import { MobileHeader } from "./header/MobileHeader";

/**
 * Shared site header. Sticky, cream, hairline-bottomed.
 * Navigation data lives in lib/config/navigation.ts.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <MobileHeader />
      <DesktopHeader />
    </header>
  );
}
