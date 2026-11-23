import {
  Building2,
  Factory,
  Globe2,
  ShieldCheck,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

/**
 * Temporary placeholder logos for the homepage trust marquee.
 * Swap an icon here to change the marquee without touching the component.
 */

export type TrustedCompany = {
  name: string;
  icon: LucideIcon;
};

export const TRUSTED_COMPANIES: TrustedCompany[] = [
  { name: "Highland Harvest Exports", icon: Factory },
  { name: "Rift Valley Trading", icon: Building2 },
  { name: "Blue Nile Logistics", icon: Truck },
  { name: "Horn of Africa Foods", icon: Warehouse },
  { name: "Addis Supply Co.", icon: Globe2 },
  { name: "Ethio Textile Group", icon: ShieldCheck },
];
