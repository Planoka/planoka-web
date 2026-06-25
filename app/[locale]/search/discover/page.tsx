"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DiscoverFeed } from "@/components/explore/DiscoverFeed";
import { CategoryFilter } from "@/components/explore/CategoryFilter";
import { getPlansWithDetails } from "@/lib/mock-data";

export default function DiscoverPage() {
  const router = useRouter();
  const [allPlans, setAllPlans] = useState<ReturnType<typeof getPlansWithDetails>>([]);

  useEffect(() => {
    // Shuffle the plans for a real "discover" feel
    const plans = getPlansWithDetails().filter(p => p.image_url); // Only plans with images look good in TikTok style
    for (let i = plans.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [plans[i], plans[j]] = [plans[j], plans[i]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllPlans(plans);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPlans = useMemo(() => {
    if (selectedCategory === "all") return allPlans;
    return allPlans.filter((p) => p.categorie_id === selectedCategory);
  }, [allPlans, selectedCategory]);

  return (
    <div className="relative h-[calc(100vh-64px)] md:h-screen w-full bg-black">
      {/* Category filters overlay */}
      <div className="absolute top-16 left-0 right-0 z-40 md:top-4">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          variant="glass"
        />
      </div>

      <DiscoverFeed 
        plans={filteredPlans} 
        onBack={() => router.back()} 
      />
    </div>
  );
}
