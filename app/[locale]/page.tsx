import { AuthControls } from "@/components/common/AuthControls";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[var(--color-bg-page)] font-sans">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <span className="text-xl font-bold tracking-tight text-white">
          Planoka
        </span>
        <AuthControls />
      </header>

      {/* ── Hero ── */}
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Les meilleurs bons plans au Cameroun
        </h1>
        <p className="max-w-xl text-lg text-white/60">
          Découvrez et partagez les restaurants, sorties, promotions et services
          locaux près de chez vous.
        </p>
      </main>
    </div>
  );
}
