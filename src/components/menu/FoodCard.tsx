"use client";
import { Plus } from "lucide-react";
import Image from "next/image";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  onAdd: () => void;
  onClick?: () => void;
}

export function FoodCard({ name, description, price, image, onAdd, onClick }: FoodCardProps) {
  return (
    <div 
      className="group relative bg-white cursor-pointer active:scale-[0.98] transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-56 lg:h-48 xl:h-56 w-full rounded-[1.5rem] overflow-hidden mb-4 shadow-sm border border-gray-100 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover:border-transparent transition-all duration-300">
        <Image 
          src={image} 
          alt={name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white text-gray-900 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all active:scale-90 opacity-90 group-hover:opacity-100 group-hover:scale-110"
        >
          <Plus className="w-5 h-5 font-black" />
        </button>
      </div>
      
      <div className="px-1 pr-2">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="font-bold text-[17px] text-gray-900 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{name}</h3>
        </div>
        <p className="text-[13px] text-gray-500 line-clamp-1 mb-2.5 font-medium leading-relaxed">{description}</p>
        <div className="flex items-center gap-2">
          <span className="font-black text-gray-900 text-[15px] tracking-tight">₦{price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
