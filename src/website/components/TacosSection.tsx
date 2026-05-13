import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * Editorial side-profile taco. A smooth bite is removed from the upper-right
 * (~30% of silhouette area) via an animated SVG mask. Mature linework, muted
 * palette, single composed object.
 */
const BittenTaco = ({ progress }: { progress: number }) => {
  // Bite ellipse grows from 0 -> full radius
  const biteRx = 78 * progress;
  const biteRy = 70 * progress;
  // Crumbs fall after bite forms
  const crumbT = Math.max(0, (progress - 0.55) / 0.45);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[360/260]">
      <svg
        viewBox="0 0 360 260"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Taco with a 30% bite removed"
      >
        <defs>
          {/* Bite mask: white reveals, black hides */}
          <mask id="taco-bite-mask">
            <rect width="360" height="260" fill="white" />
            <ellipse
              cx="262"
              cy="78"
              rx={biteRx}
              ry={biteRy}
              fill="black"
              transform="rotate(-18 262 78)"
            />
          </mask>

          {/* Soft ground shadow */}
          <radialGradient id="taco-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
          </radialGradient>

          {/* Filling depth gradients */}
          <linearGradient id="shell-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(36 48% 70%)" />
            <stop offset="100%" stopColor="hsl(34 44% 55%)" />
          </linearGradient>
          <linearGradient id="lettuce-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(140 26% 52%)" />
            <stop offset="100%" stopColor="hsl(142 24% 42%)" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="180" cy="222" rx="130" ry="9" fill="url(#taco-shadow)" />

        <g mask="url(#taco-bite-mask)">
          {/* Back shell (slightly darker, peeks above filling) */}
          <path
            d="M52 198 Q 180 14 308 198 Z"
            fill="hsl(34 40% 50%)"
          />

          {/* Filling group — sits inside the shell */}
          <g>
            {/* Sour cream / cream backdrop */}
            <path
              d="M70 192 Q 180 70 290 192 Z"
              fill="hsl(40 30% 92%)"
            />

            {/* Lettuce ribbon */}
            <path
              d="M72 188
                 Q 95 150 118 174
                 Q 138 142 162 168
                 Q 186 138 210 168
                 Q 234 144 258 174
                 Q 280 150 290 188 Z"
              fill="url(#lettuce-grad)"
            />

            {/* Cheese strands */}
            <g stroke="hsl(40 65% 62%)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
              <line x1="92" y1="178" x2="86" y2="200" />
              <line x1="118" y1="172" x2="116" y2="202" />
              <line x1="148" y1="170" x2="150" y2="202" />
              <line x1="180" y1="166" x2="180" y2="204" />
              <line x1="212" y1="170" x2="214" y2="202" />
              <line x1="244" y1="172" x2="246" y2="202" />
              <line x1="272" y1="178" x2="276" y2="200" />
            </g>

            {/* Tomato dice — small, restrained */}
            <g fill="hsl(8 52% 52%)">
              <rect x="108" y="172" width="9" height="9" rx="1.5" transform="rotate(8 112 176)" />
              <rect x="156" y="166" width="9" height="9" rx="1.5" transform="rotate(-6 160 170)" />
              <rect x="200" y="170" width="9" height="9" rx="1.5" transform="rotate(12 204 174)" />
              <rect x="240" y="174" width="9" height="9" rx="1.5" transform="rotate(-10 244 178)" />
            </g>
          </g>

          {/* Front shell (foreground curve, defines silhouette) */}
          <path
            d="M52 198
               Q 180 14 308 198
               L 296 200
               Q 180 36 64 200 Z"
            fill="url(#shell-grad)"
          />

          {/* Subtle shell texture lines */}
          <g stroke="hsl(34 38% 42%)" strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round">
            <path d="M70 188 Q 180 36 290 188" />
            <path d="M82 178 Q 180 56 278 178" />
          </g>

          {/* Ink outline for definition */}
          <path
            d="M52 198 Q 180 14 308 198"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeOpacity="0.75"
            strokeLinecap="round"
          />
          <path
            d="M52 198 L 308 198"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        </g>

        {/* Bite-edge highlight: thin arc traces the bite where it meets the taco */}
        {progress > 0.05 && (
          <ellipse
            cx="262"
            cy="78"
            rx={biteRx}
            ry={biteRy}
            transform="rotate(-18 262 78)"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.18"
            strokeWidth="1.25"
            strokeDasharray="2 4"
          />
        )}

        {/* Crumbs — three falling specks from the bite area */}
        <g fill="hsl(34 44% 55%)">
          {[
            { x: 248, y: 110, dy: 26, delay: 0 },
            { x: 268, y: 122, dy: 38, delay: 0.15 },
            { x: 232, y: 132, dy: 44, delay: 0.3 },
          ].map((c, i) => {
            const t = Math.max(0, Math.min(1, crumbT - c.delay));
            const ease = 1 - Math.pow(1 - t, 2);
            return (
              <circle
                key={i}
                cx={c.x}
                cy={c.y + c.dy * ease}
                r={2.2}
                opacity={t > 0 ? 1 - t : 0}
              />
            );
          })}
        </g>
      </svg>

      {/* 30% badge — appears near the bite once bite is mostly formed */}
      <div
        className="absolute"
        style={{
          top: "14%",
          right: "8%",
          opacity: Math.max(0, (progress - 0.35) / 0.65),
          transform: `translateY(${(1 - Math.min(1, progress)) * 8}px)`,
          transition: "none",
        }}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-bold text-foreground tabular-nums leading-none">
            {Math.round(progress * 30)}
          </span>
          <span className="text-xl sm:text-2xl font-semibold text-muted-foreground leading-none">%</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
          bite taken
        </div>
      </div>
    </div>
  );
};

const TacosSection = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1400;
    const start = performance.now();
    // cubic-bezier(0.2, 0, 0, 1) approximation via easeOutQuart for value
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easeOut(t));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.p
          className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-10"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          TACoS · Total Advertising Cost of Sales
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.2, 0, 0, 1] }}
        >
          <BittenTaco progress={progress} />
        </motion.div>

        <motion.h2
          className="text-3xl sm:text-5xl font-bold text-foreground mt-12 leading-[1.1]"
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.2, 0, 0, 1] }}
        >
          We take a{" "}
          <span className="text-gradient-primary tabular-nums">
            {Math.round(progress * 30)}%
          </span>{" "}
          bite out of yours.
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-muted-foreground mt-5 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          One bite for us. The rest stays on your plate. TACoS is the only ad-spend
          ratio your CFO actually cares about — and we're built to shrink it.
        </motion.p>
      </div>
    </section>
  );
};

export default TacosSection;
