import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import BackButton from "@/components/Auth/BackButton";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <BackButton />
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <ResetPasswordForm token={token ?? ""} />
        </div>
      </div>
    </main>
  );
}
