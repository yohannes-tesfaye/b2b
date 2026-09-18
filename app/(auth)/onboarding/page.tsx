import OnboardingForm from "@/components/Auth/OnboardingForm";
import BackButton from "@/components/Auth/BackButton";

function OnboardingPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <BackButton />
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}

export default OnboardingPage;