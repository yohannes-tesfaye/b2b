import React from "react";
import {
  Car,
  Home,
  Wrench,
  BookOpen,
  Smartphone,
  Shirt,
  Trophy,
  Grid,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  interface CategoryItem {
    title: string;
    href: string;
    icon: React.ElementType;
    isActive?: boolean;
    hasSubcategories?: boolean;
  }
  const CATEGORIES: CategoryItem[] = [
    {
      title: "Automobiles",
      href: "/categories/automobiles",
      icon: Car,
      isActive: true,
    },
    {
      title: "Home appliance",
      href: "/categories/home-appliances",
      icon: Home,
    },
    {
      title: "Tools, equipments",
      href: "/categories/tools-equipment",
      icon: Wrench,
    },
    {
      title: "Books & magazines",
      href: "/categories/books-magazines",
      icon: BookOpen,
    },
    {
      title: "Electronic gadgets",
      href: "/categories/electronics",
      icon: Smartphone,
    },
    { title: "Clothing and wear", href: "/categories/clothing", icon: Shirt },
    {
      title: "Sports and outdoor",
      href: "/categories/sports-outdoors",
      icon: Trophy,
    },
    {
      title: "More category",
      href: "/categories",
      icon: Grid,
      hasSubcategories: true,
    },
  ];

  return (
    <section className="md:w-[90%] w-[95%] mx-auto mt-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col lg:flex-row gap-4">
        {/* 1. Left Column: Navigation Category Menu */}
        <div className="w-full lg:w-64 shrink-0">
          <ul className="flex flex-col gap-1">
            {CATEGORIES.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;

              return (
                <li key={categoryIndex}>
                  <Link
                    href={category.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      category.isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="w-4 h-4 text-slate-500" />
                      <span>{category.title}</span>
                    </div>
                    {category.hasSubcategories && (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 2. Center Column: Hero Banner */}
        <div className="flex-1 relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-100 via-sky-100 to-blue-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between min-h-[300px] lg:min-h-[360px]">
          {/* Text Content */}
          <div className="z-10 max-w-xs mb-6 sm:mb-0">
            <span className="text-sm font-semibold text-blue-600 block mb-1">
              New trending
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              Electronic items
            </h2>
            <button className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
              Learn more
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Graphic Placeholders (Smartphone mockup representation) */}
          <div className="relative w-full sm:w-1/2 h-48 sm:h-full flex items-center justify-center">
            {/* Back phone mockup */}
            <div className="absolute left-4 sm:left-2 w-28 h-48 bg-amber-100/90 border-2 border-amber-200 rounded-[2rem] shadow-md flex items-center justify-center transform -rotate-6">
              <div className="w-6 h-6 rounded-full border-2 border-slate-700/30 flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-700/40 rounded-full" />
              </div>
            </div>
            {/* Front phone mockup */}
            <div className="absolute right-4 sm:right-6 w-28 h-52 bg-slate-900 border-4 border-slate-800 rounded-[2.2rem] shadow-xl overflow-hidden flex flex-col items-center justify-between p-2 transform rotate-3">
              <div className="w-3 h-3 bg-slate-900 rounded-full self-end mr-2 mt-1" />
              <div className="w-full h-full bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-[1.5rem] flex items-center justify-center text-white text-xs font-mono">
                Screen
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Column: Promo Callout Card */}
        <div className="w-full lg:w-72 shrink-0 relative overflow-hidden rounded-xl bg-slate-800 text-white p-6 flex flex-col justify-between min-h-[200px] lg:min-h-[360px]">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-blue-900/40 opacity-90" />

          {/* Profile/Photo Placeholder */}
          <div className="absolute right-0 bottom-0 w-36 h-48 bg-slate-700/50 rounded-tl-full flex items-end justify-center pb-4 text-slate-400 text-xs italic">
            [Supplier Photo]
          </div>

          <div className="relative z-10">
            <p className="text-lg font-medium leading-snug max-w-[180px]">
              Get US $10 off with new supplier
            </p>
          </div>

          <div className="relative z-10 mt-6">
            <button className="border border-white/60 hover:border-white bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2 rounded-full transition-all">
              Get offer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
