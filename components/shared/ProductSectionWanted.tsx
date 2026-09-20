import { ProductCard } from "./ProductCard";

export default function ProductGrid() {
  return (
    <div className="w-[90%] mx-auto mt-20">
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        Agriculture and Food Product{" "}
        <span className="text-blue-600">Supplier</span> (Available)
      </h1>{" "}
      <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
        <ProductCard type="wanted" />
        <ProductCard type="wanted" />
        <ProductCard type="wanted" />
        <ProductCard type="wanted" />
      </div>
    </div>
  );
}
