export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  companyName?: string | null;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  industry?: string | null;
  companySize?: string | null;
  createdAt?: string | Date | null;
};
