import React, { useEffect, useState } from "react";
import BannerCard from "./BannerCard";
import { LIST_EVENT, readListItems, removeFromList, type ListItem } from "../lib/progress";

export default function MyListRail({
  onSelectAnime,
  onManage,
}: {
  onSelectAnime: (slug: string) => void;
  onManage: () => void;
}) {
  const [items, setItems] = useState<ListItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readListItems().slice(0, 12));
    sync();
    window.addEventListener(LIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mt-6 flex w-full flex-col">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-4 pb-2 pt-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
            <span
              className="h-5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(229,48,60,0.5)]"
              aria-hidden
            />
            My List
          </h2>
          <span className="text-[11px] font-semibold text-zinc-500">Saved on this device</span>
        </div>
        <button
          onClick={onManage}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          Manage List
        </button>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 py-2 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {items.map((item) => (
          <BannerCard
            key={item.slug}
            className="w-[240px] shrink-0 sm:w-[260px] md:w-[280px]"
            onSelect={() => onSelectAnime(item.slug)}
            item={item}
            onRemove={() => removeFromList(item.slug)}
          />
        ))}
      </div>
    </div>
  );
}
