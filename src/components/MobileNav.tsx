import React from "react";
import { Bookmark, Code2, Compass, Home, Search } from "lucide-react";
import { cn } from "../lib/utils";
import type { NavTab } from "./Navbar";

export default function MobileNav({
  activeTab,
  onTabChange,
}: {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "browse", label: "Browse", icon: Compass },
    { id: "search", label: "Search", icon: Search },
    { id: "mylist", label: "My List", icon: Bookmark },
    { id: "explorer", label: "Code", icon: Code2 },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#09090b]/95 backdrop-blur-2xl md:hidden safe-bottom">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
        {tabs.map((t) => {
          const active = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id as NavTab)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 transition-colors cursor-pointer",
                active ? "text-white font-bold" : "text-zinc-500"
              )}
            >
              <Icon
                className={cn("h-4 w-4 transition-all", active && "scale-115 text-brand")}
              />
              <span className="text-[10px] tracking-wide">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
