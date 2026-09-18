import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Back to Home
    </Link>
  );
}

export default BackButton;