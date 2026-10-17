import SignUpForm from "@/components/Auth/SignUpForm";
import BackButton from "@/components/Auth/BackButton";

function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <BackButton />
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <SignUpForm />
        </div>
      </div>
    </main>
  );
}

export default SignUpPage;