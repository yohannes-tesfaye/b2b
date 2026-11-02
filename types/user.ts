export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  emailVerified: boolean;
  companyName: string | null;
  country: string | null;
  industry: string | null;
  companySize: string | null;
  createdAt: Date;
  _count: { listings: number };
};
