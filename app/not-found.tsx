import { Link } from "@/i18n/navigation";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-8xl font-bold text-muted-foreground/20">404</span>
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the
          URL or head back to the homepage.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          render={<Link href="/" />}
          nativeButton={false}
        >
          <Home className="h-4 w-4" />
          Go home
        </Button>
        <Button
          variant="outline"
          render={<Link href="/products" />}
          nativeButton={false}
        >
          <Search className="h-4 w-4" />
          Browse products
        </Button>
      </div>
    </div>
  );
}
