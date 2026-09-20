import { Star } from "lucide-react";

const reviews = [
  {
    name: "John Smith",
    company: "Tech Corp",
    rating: 5,
    text: "Excellent platform for finding reliable suppliers. The verification system gives us confidence in our partnerships.",
  },
  {
    name: "Sarah Johnson",
    company: "Global Imports",
    rating: 4,
    text: "Great selection of products and responsive suppliers. Has streamlined our procurement process significantly.",
  },
  {
    name: "Michael Chen",
    company: "Asia Trade",
    rating: 5,
    text: "The regional search feature is fantastic. Found exactly what we needed in China with verified suppliers.",
  },
  {
    name: "John Smith",
    company: "Tech Corp",
    rating: 5,
    text: "Excellent platform for finding reliable suppliers. The verification system gives us confidence in our partnerships.",
  },
  {
    name: "Sarah Johnson",
    company: "Global Imports",
    rating: 4,
    text: "Great selection of products and responsive suppliers. Has streamlined our procurement process significantly.",
  },
  {
    name: "Michael Chen",
    company: "Asia Trade",
    rating: 5,
    text: "The regional search feature is fantastic. Found exactly what we needed in China with verified suppliers.",
  },
];

function Reviews() {
  return (
    <div className="w-full px-6 md:px-12 lg:px-24 py-16">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {review.text}
            </p>

            <div className="border-t border-gray-100 pt-4">
              <p className="font-semibold text-gray-900 text-sm">
                {review.name}
              </p>
              <p className="text-gray-500 text-xs">{review.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
