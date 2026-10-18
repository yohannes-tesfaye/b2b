function TrustedBy() {
  const companies = [
    { name: "Company A", logo: "🏭" },
    { name: "Company B", logo: "🏢" },
    { name: "Company C", logo: "🏗️" },
    { name: "Company D", logo: "🏬" },
    { name: "Company E", logo: "🏭" },
    { name: "Company F", logo: "🏢" },
  ];

  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-16 bg-muted">
      <h1 className="text-2xl font-bold text-center text-foreground mb-4">
        Trusted by Leading Companies
      </h1>
      <h2 className="text-[15px] text-center text-muted-foreground mb-12">
        1.2 businesses trust us
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 max-w-7xl mx-auto">
        {companies.map((company) => (
          <div
            key={company.name}
            className="flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-4xl mb-2">{company.logo}</span>
            <span className="text-sm font-medium text-foreground">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustedBy;
