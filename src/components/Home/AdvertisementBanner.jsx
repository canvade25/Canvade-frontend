import React from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdvertisementBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-6 md:py-7">
      <div className="mx-auto max-w-[1700px] px-4 md:px-8 lg:px-12">
        <div className="relative isolate overflow-hidden rounded-2xl bg-[#063f34] px-5 py-5 md:px-8 md:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(16,185,129,0.34),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.08),transparent_55%)]" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-50">
                <Megaphone className="h-3.5 w-3.5" />
                Advertisement
              </div>

              <h2 className="font-heading text-2xl font-semibold leading-tight text-white md:text-3xl">
                Ready to reach more students?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50/85 md:text-base">
                Promote your institute, course, or workshop with featured
                placements built for better visibility across CANVADE.
              </p>

              <button
                type="button"
                onClick={() => navigate("/get-started")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FFC107] px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#ffcf33] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/60 focus:ring-offset-2 focus:ring-offset-[#063f34]"
              >
                Explore Ads
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="pointer-events-none absolute bottom-0 right-2 hidden h-full w-[34%] max-w-[360px] md:block">
              <img
                src="/student4.png"
                alt=""
                className="absolute bottom-[-42px] right-0 h-[210px] w-[210px] object-contain opacity-95 lg:h-[240px] lg:w-[240px]"
                aria-hidden="true"
              />
              <div className="absolute right-52 top-6 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm lg:right-60">
                Featured visibility
              </div>
              <div className="absolute right-36 top-20 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-emerald-50 backdrop-blur-sm lg:right-44">
                More enquiries
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
