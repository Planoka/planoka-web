import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="z-10 mt-8">
        <h1 className="text-5xl font-black tracking-wide text-black md:text-7xl">
          OUPS !
        </h1>
        <p className="mt-4 text-lg font-bold leading-snug text-black md:text-xl">
          La page que vous cherchez
          <br />a pris des vacances...
        </p>
      </div>

      <div className="relative my-8 w-full max-w-2xl">
        <Image
          src="/images/404.png"
          alt="Erreur 404 - Page introuvable"
          width={800}
          height={500}
          className="mx-auto h-auto w-full object-contain"
          priority
        />
      </div>

      <Link href={`/${locale}`}>
        <button className="flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[var(--color-primary)] px-8 py-3.5 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none">
          Retour à l&apos;accueil
          <ArrowRight className="h-5 w-5 stroke-[2.5]" />
        </button>
      </Link>
    </div>
  );
}
