import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMaintenance } from "@/contexts/MaintenanceContext";

/**
 * Full-screen Under Maintenance page. Flat vector scene built from inline SVG,
 * colored with semantic tokens so it adapts to light/dark automatically.
 *
 * Sanctioned quirky surface (§10.5-style exception): the illustration itself may
 * loop slowly; copy stays short, dry, and professional. All interactive motion
 * follows the global motion rules.
 */

const STATUS_LINES = [
  "Oiling the data pipelines…",
  "Telling Aan to stretch its legs…",
  "Recounting your pennies — twice…",
  "Aligning the profit stars…",
  "Dusting off the servers (they sneeze)…",
  "Sharpening every chart to a fine point…",
];

function useMountedAt() {
  const [startedAt] = useState(() => new Date());
  return startedAt;
}

export default function UnderMaintenance() {
  const navigate = useNavigate();
  const location = useLocation();
  const { maintenanceMode, setMaintenanceMode } = useMaintenance();
  const startedAt = useMountedAt();
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_LINES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  const isDemoRoute = location.pathname === "/maintenance";

  const handleExit = () => {
    if (maintenanceMode && !isDemoRoute) {
      setMaintenanceMode(false);
      navigate("/", { replace: true });
      return;
    }
    navigate(-1);
  };

  const startedTime = startedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Subtle dot field */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        {/* Maintenance badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
            Scheduled tune-up
          </span>
        </div>

        {/* Flat vector scene */}
        <svg
          viewBox="0 0 480 260"
          className="w-full max-w-md mb-8"
          role="img"
          aria-label="Flat illustration of a workbench with gears being tuned"
        >
          <style>{`
            .maint-gear-a { transform-origin: 150px 132px; animation: maint-rot-a 26s linear infinite; }
            .maint-gear-b { transform-origin: 258px 172px; animation: maint-rot-b 17s linear infinite reverse; }
            .maint-wrench { transform-origin: 356px 150px; animation: maint-wrench 3.4s ease-in-out infinite alternate; }
            .maint-card { transform-origin: 356px 96px; animation: maint-float 4.6s ease-in-out infinite alternate; }
            @keyframes maint-rot-a { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes maint-rot-b { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes maint-wrench { from { transform: rotate(-9deg); } to { transform: rotate(9deg); } }
            @keyframes maint-float { from { transform: translateY(0px); } to { transform: translateY(-7px); } }
            @media (prefers-reduced-motion: reduce) {
              .maint-gear-a, .maint-gear-b, .maint-wrench, .maint-card { animation: none !important; }
            }
          `}</style>

          {/* Workbench */}
          <rect x="24" y="208" width="432" height="16" rx="8" fill="hsl(var(--muted))" />
          <rect x="52" y="224" width="12" height="24" rx="4" fill="hsl(var(--muted-foreground) / 0.35)" />
          <rect x="416" y="224" width="12" height="24" rx="4" fill="hsl(var(--muted-foreground) / 0.35)" />

          {/* Big gear */}
          <g className="maint-gear-a">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x="144"
                y="70"
                width="12"
                height="20"
                rx="3"
                fill="hsl(var(--primary) / 0.55)"
                transform={`rotate(${i * 45} 150 132)`}
              />
            ))}
            <circle cx="150" cy="132" r="52" fill="hsl(var(--primary) / 0.16)" stroke="hsl(var(--primary))" strokeWidth="3" />
            <circle cx="150" cy="132" r="30" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
            <circle cx="150" cy="132" r="12" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="3" />
          </g>

          {/* Small counter gear */}
          <g className="maint-gear-b">
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x="252"
                y="126"
                width="10"
                height="14"
                rx="3"
                fill="hsl(var(--muted-foreground) / 0.55)"
                transform={`rotate(${i * 60} 258 172)`}
              />
            ))}
            <circle cx="258" cy="172" r="32" fill="hsl(var(--muted-foreground) / 0.14)" stroke="hsl(var(--muted-foreground) / 0.7)" strokeWidth="3" />
            <circle cx="258" cy="172" r="8" fill="hsl(var(--background))" stroke="hsl(var(--muted-foreground) / 0.7)" strokeWidth="3" />
          </g>

          {/* Blueprint card, floating */}
          <g className="maint-card">
            <rect x="306" y="58" width="100" height="76" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
            <rect x="320" y="74" width="52" height="6" rx="3" fill="hsl(var(--primary) / 0.6)" />
            <rect x="320" y="90" width="70" height="5" rx="2.5" fill="hsl(var(--muted-foreground) / 0.4)" />
            <rect x="320" y="102" width="62" height="5" rx="2.5" fill="hsl(var(--muted-foreground) / 0.4)" />
            <rect x="320" y="114" width="40" height="5" rx="2.5" fill="hsl(var(--muted-foreground) / 0.4)" />
          </g>

          {/* Wrench, gently turning */}
          <g className="maint-wrench">
            <path
              d="M348 176 L348 128 Q348 122 354 122 L358 122 Q364 122 364 128 L364 176 Z"
              fill="hsl(var(--muted-foreground) / 0.75)"
            />
            <circle cx="356" cy="120" r="14" fill="hsl(var(--muted-foreground) / 0.75)" />
            <circle cx="356" cy="120" r="6" fill="hsl(var(--background))" />
            <rect x="353" y="112" width="6" height="10" rx="2" fill="hsl(var(--background))" />
          </g>

          {/* Bolt on the bench */}
          <circle cx="96" cy="200" r="8" fill="hsl(var(--primary) / 0.4)" />
          <rect x="92" y="196" width="8" height="8" rx="1.5" fill="hsl(var(--background))" transform="rotate(24 96 200)" />
        </svg>

        {/* Copy */}
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-3">
          We're under the hood.
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6">
          Anarix is getting a tune-up. Everything is safe — back before your coffee cools.
        </p>

        {/* Status ticker */}
        <div className="h-6 flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span
              key={statusIdx}
              className="animate-in fade-in duration-500"
            >
              {STATUS_LINES[statusIdx]}
            </span>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
            Usually back in ~30 minutes
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground tabular-nums">
            Tune-up started at {startedTime}
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
            Your data is safe
          </span>
        </div>

        {/* Exit affordance */}
        <p className="text-xs text-muted-foreground mb-2">
          {maintenanceMode && !isDemoRoute
            ? "You turned this on from Preferences. It's off again the moment you say so."
            : "Just previewing? Head straight back."}
        </p>
        <Button variant="ghost" onClick={handleExit}>
          {maintenanceMode && !isDemoRoute ? "Turn off maintenance mode" : "Back to Anarix"}
        </Button>
      </div>
    </div>
  );
}
