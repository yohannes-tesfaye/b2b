import { requireAdmin } from "@/lib/dashboard-access";
import { getApprovalSettings } from "@/features/listings/approval";
import { ApprovalSettingsForm } from "@/components/dashboard/approval-settings-form";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getApprovalSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Control how new listings are reviewed before going live.
        </p>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <ApprovalSettingsForm initial={settings} />
      </div>
    </div>
  );
}
