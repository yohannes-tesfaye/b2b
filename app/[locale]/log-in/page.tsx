import LogInForm from "@/components/Auth/LogInForm";
import BackButton from "@/components/Auth/BackButton";

function LogInPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <BackButton />
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <LogInForm />
        </div>
      </div>
    </main>
  );
}

export default LogInPage;