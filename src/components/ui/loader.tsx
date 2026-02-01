import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

// Inline simple loader animation (fallback if JSON not loaded)
const simpleLoaderData = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 100,
  h: 100,
  nm: "Loader",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 120, s: [360] },
          ],
        },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          s: { a: 0, k: [60, 60] },
          p: { a: 0, k: [0, 0] },
          nm: "Ellipse",
        },
        {
          ty: "st",
          c: { a: 0, k: [0.29, 0.38, 0.85, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 6 },
          lc: 2,
          lj: 1,
          ml: 4,
          d: [
            { n: "d", nm: "dash", v: { a: 0, k: 47 } },
            { n: "g", nm: "gap", v: { a: 0, k: 140 } },
            { n: "o", nm: "offset", v: { a: 0, k: 0 } },
          ],
          nm: "Stroke",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
};

export function Loader({ size = "md", className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Lottie
        animationData={simpleLoaderData}
        loop
        className={sizeMap[size]}
      />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
