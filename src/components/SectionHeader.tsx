import React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

export default function SectionHeader({
  title,
  badge,
  badgeColor = "bg-brand",
  subtitle,
  onViewMore,
  icon: Icon,
}: {
  title: string;
  badge?: string;
  badgeColor?: string;
  subtitle?: string;
  onViewMore?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
          {badge && (
            <span
              className={`flex items-center gap-1.5 rounded-full ${badgeColor} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm`}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-[13px] text-zinc-500">{subtitle}</p>}
      </div>
      {onViewMore && (
        <button
          onClick={onViewMore}
          className="group flex cursor-pointer items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          View all
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}
