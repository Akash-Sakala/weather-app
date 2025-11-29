// src/components/plant-landing-hero.tsx

import { Button } from "./ui/button";
import { Leaf, Sprout, Droplets, Wind } from "lucide-react";

export function PlantLandingHero() {
  const handleScrollToForecast = () => {
    const el = document.getElementById("agri-forecast");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-700/40 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 px-6 py-6 sm:px-8 sm:py-8 mb-2">
      {/* background image overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light bg-cover bg-center"
        style={{ backgroundImage: "url('/agriqnet2.jpg')" }}
      />

      {/* floating leaf orbs */}
      <div className="pointer-events-none absolute -right-8 -top-6 h-28 w-28 rounded-full border border-emerald-500/40 bg-emerald-500/10 blur-sm animate-pulse" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full border border-lime-500/40 bg-lime-500/10 blur-sm animate-ping" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* left content */}
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 px-3 py-1 text-xs font-medium text-emerald-200 border border-emerald-700/60">
            <Leaf className="h-3.5 w-3.5" />
            Smart field weather · 16-day outlook
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-emerald-50">
            Plan your crops with{" "}
            <span className="bg-gradient-to-r from-lime-300 via-emerald-200 to-amber-200 bg-clip-text text-transparent">
              plant-aware weather
            </span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/80">
            AgriQnet helps you time sowing, irrigation, and spraying using
            hyper-local forecasts and a 16-day outlook tailored for fields,
            not cities.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="sm"
              className="bg-lime-500 hover:bg-lime-600 text-emerald-950 shadow-md shadow-lime-500/30"
              onClick={handleScrollToForecast}
            >
              View 16-day field forecast
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-400/70 text-emerald-50 bg-emerald-900/40 hover:bg-emerald-800/60"
              onClick={handleScrollToForecast}
            >
              Check next rain window
            </Button>
          </div>
        </div>

        {/* right side chips */}
        <div className="mt-4 grid w-full max-w-sm grid-cols-2 gap-3 text-xs text-emerald-50 lg:mt-0">
          <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/70 px-3 py-3 flex flex-col gap-1 animate-[pulse_3s_ease-in-out_infinite]">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-lime-300" />
              <span className="font-semibold">Sowing window</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Match seed sowing with soil moisture, temp and rain-free days.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/70 px-3 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-300" />
              <span className="font-semibold">Irrigation planner</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Skip irrigation when rain is coming, save diesel & groundwater.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/70 px-3 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-cyan-300" />
              <span className="font-semibold">Spray safety</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Avoid spraying on high-wind or high-rain days to reduce drift.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/70 px-3 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-300" />
              <span className="font-semibold">Crop health</span>
            </div>
            <p className="text-[11px] text-emerald-200/80">
              Monitor humidity & heat that drive pest and disease outbreaks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
