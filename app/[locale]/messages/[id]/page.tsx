import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { userDashboardPath } from "@/lib/dashboard-paths";

export default async function MessagesRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return redirect(`/log-in?next=${encodeURIComponent(`/messages/${id}`)}`);
  }
  return redirect(`${userDashboardPath(user.id)}/messages/${id}`);
}
