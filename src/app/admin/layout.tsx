"use client";
import Link from "next/link";
import { LayoutDashboard, Utensils, ListOrdered, Settings, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Menu Items", icon: Utensils, href: "#" },
    { label: "Orders", icon: ListOrdered, href: "#" },
    { label: "Settings", icon: Settings, href: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            FEBNIKS <span className="text-[var(--color-primary)]">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = idx === 0; 
            return (
              <a 
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-[var(--color-primary)] text-white" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center shrink-0">
          <Link href="/" className="text-xl font-black tracking-tighter text-white">
            FEBNIKS <span className="text-[var(--color-primary)]">ADMIN</span>
          </Link>
          <Link href="/" className="text-gray-400 p-2 hover:text-white bg-gray-800 rounded-lg">
            <LogOut className="w-5 h-5" />
          </Link>
        </header>
        
        <div className="flex-grow overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
