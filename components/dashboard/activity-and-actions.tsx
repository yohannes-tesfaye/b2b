import { RecentActivity } from "./recent-activity";
import { ActionRequired } from "./action-required";

export function ActivityAndActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentActivity />
      <ActionRequired />
    </div>
  );
}
