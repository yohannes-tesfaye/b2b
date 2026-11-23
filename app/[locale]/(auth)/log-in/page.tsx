import LogInForm from "@/components/Auth/LogInForm";
import BackButton from "@/components/Auth/BackButton";
import { safeInternalPath } from "@/lib/safe-redirect";

type SearchParams = Promise<{ next?: string | string[] }>;

async function LogInPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeInternalPath(rawNext);

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <BackButton />
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <LogInForm next={next} />
        </div>
      </div>
    </main>
  );
}

export default LogInPage;
