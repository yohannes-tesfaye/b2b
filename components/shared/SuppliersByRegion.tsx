import { Link } from "@/i18n/navigation";
import { ArrowRight, Briefcase } from "lucide-react";

const countries = [
  { name: "China", flag: "🇨🇳" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "India", flag: "🇮🇳" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Brazil", flag: "🇧🇷" },
];

function SuppliersByRegion() {
  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-12">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Suppliers By Region
      </h2>

      {/* Country Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {countries.map((country) => (
          <Link
            key={country.name}
            href={`/suppliers/${country.name.toLowerCase().replace(" ", "-")}`}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all bg-card"
          >
            <span className="text-3xl">{country.flag}</span>
            <span className="text-sm font-medium text-foreground">
              {country.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Bottom Links */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/regions"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Browse More Regions
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/trade-services"
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Briefcase className="h-4 w-4" />
          Trade Service Providers
        </Link>
      </div>
    </div>
  );
}

export default SuppliersByRegion;
