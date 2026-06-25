import { Metadata } from "next";
import { getPlanById } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const plan = getPlanById(params.id);

  if (!plan) {
    return {
      title: "Planoka - Plan non trouvé",
      description: "Ce bon plan n'existe pas ou a été supprimé.",
    };
  }

  const ogUrl = `https://planoka.com/${params.locale}/plans/${params.id}`;
  const ogTitle = `${plan.titre} | Planoka`;
  const ogDescription =
    plan.description.length > 150 ? `${plan.description.substring(0, 150)}...` : plan.description;
  const ogImage = plan.image_url || "https://planoka.com/og-image.jpg";

  return {
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: plan.titre,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default function PlanDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
