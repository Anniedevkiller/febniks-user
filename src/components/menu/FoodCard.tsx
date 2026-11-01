"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FALLBACK_MEAL_IMAGE, formatNaira, getMealImageUrl } from "@/lib/supabase/meals";

interface FoodCardProps {
  id: string;
  slug?: string | null;
  name: string;
  description: string | null;
  price: number;
  image?: string | null;
  badge?: string;
  onAdd: (e?: React.MouseEvent) => void;
  onClick?: () => void;
}

const MotionImage = motion(Image);

export function FoodCard({
  id,
  slug,
  name,
  description,
  price,
  image,
  badge,
  onAdd,
  onClick,
}: FoodCardProps) {
  const resolvedImage = getMealImageUrl(image);
  const [imgSrc, setImgSrc] = useState<string>(resolvedImage);

  useEffect(() => {
    setImgSrc(getMealImageUrl(image));
  }, [image]);

  const detailHref = `/menu/${encodeURIComponent(slug || id)}`;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="group relative bg-white rounded-[1.5rem] p-3 border border-gray-100 hover:border-gray-200 hover:shadow-[0_12px_32px_rgb(0,0,0,0.06)] cursor-pointer transition-all duration-300 flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-52 w-full rounded-[1.25rem] overflow-hidden mb-3.5 bg-gray-100">
        <MotionImage
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          layoutId={`food-image-${id}`}
          onError={() => {
            if (imgSrc !== FALLBACK_MEAL_IMAGE) {
              setImgSrc(FALLBACK_MEAL_IMAGE);
            }
          }}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />

        {badge && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[var(--color-primary)] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
            {badge}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${name} to cart`}
          onClick={(e) => {
            e.stopPropagation();
            onAdd(e);
          }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white text-gray-900 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all active:scale-90"
        >
          <Plus className="w-5 h-5 font-black" />
        </button>
      </div>

      <div className="px-1.5 pb-1 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-[17px] text-gray-900 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
            {name}
          </h3>
        </div>
        <p className="text-[13px] text-gray-500 line-clamp-2 mb-3 font-medium leading-relaxed flex-grow">
          {description ||
            "Freshly prepared farm-to-table fish delicacy with signature Febniks spices."}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="font-black text-gray-900 text-base tracking-tight">
            {formatNaira(price)}
          </span>
          <Link
            href={detailHref}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-bold text-[var(--color-primary)] hover:underline group-hover:translate-x-0.5 transition-transform"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
