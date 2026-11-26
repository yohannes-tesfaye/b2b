import { requireUser } from "@/lib/dashboard-access";
import ProfileView from "@/components/profile/ProfileView";

export default async function UserDashboardProfilePage() {
  const user = await requireUser();

  return (
    <ProfileView
      user={{
        id: user.id,
        name: user.name,
        email: user.email ?? "",
        image: user.image,
        role: user.role,
        companyName: user.companyName,
        phone: user.phone,
        website: user.website,
        country: user.country,
        industry: user.industry,
        companySize: user.companySize,
        createdAt: user.createdAt,
      }}
    />
  );
}
