"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Lines shown one after another. Arabic is fine — the canvas shapes it. */
  messages: string[];
  /** Approximate number of dot rows across the screen height. */
  rows?: number;
  /** Seconds each message holds before the next. */
  hold?: number;
  /** Scroll long messages instead of flipping. */
  marquee?: boolean;
  className?: string;
  ariaLabel?: string;
  weight?: number;
};

/**
 * An LED dot-matrix display. Text is rendered to an offscreen canvas, sampled
 * on a grid, and drawn as glowing dots. Pauses off-screen; static when the
 * visitor prefers reduced motion.
 */
export function LedScreen({ messages, rows = 22, hold = 2.6, marquee = false, className = "", ariaLabel, weight = 800 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const msgs = useRef(messages);
  msgs.current = messages;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true })!;

    let w = 0, h = 0, cols = 0, cell = 0, raf = 0, visible = true;
    let start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      cell = h / rows;
      cols = Math.ceil(w / cell);
    };

    // Rasterise a message into a boolean grid `rows` tall.
    const cache = new Map<string, { grid: Uint8Array; width: number }>();
    const raster = (text: string) => {
      const key = `${text}|${rows}`;
      const hit = cache.get(key);
      if (hit) return hit;
      const fontPx = rows * 0.78;
      octx.font = `${weight} ${fontPx}px ${getComputedStyle(document.body).fontFamily}`;
      const tw = Math.ceil(octx.measureText(text).width) + 2;
      off.width = Math.max(1, tw);
      off.height = rows;
      octx.font = `${weight} ${fontPx}px ${getComputedStyle(document.body).fontFamily}`;
      octx.fillStyle = "#000";
      octx.fillRect(0, 0, off.width, rows);
      octx.fillStyle = "#fff";
      octx.textBaseline = "middle";
      octx.fillText(text, 1, rows / 2 + rows * 0.04);
      const data = octx.getImageData(0, 0, off.width, rows).data;
      const grid = new Uint8Array(off.width * rows);
      for (let i = 0; i < grid.length; i++) grid[i] = data[i * 4] > 110 ? 1 : 0;
      const out = { grid, width: off.width };
      cache.set(key, out);
      return out;
    };

    const draw = (now: number) => {
      const list = msgs.current.length ? msgs.current : [" "];
      const t = (now - start) / 1000;
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      let text: string, offset: number, fade = 1;
      if (marquee) {
        text = list.join("   ·   ") + "   ·   ";
        const { width } = raster(text);
        offset = reduce ? 0 : Math.floor((t * 14) % width);
      } else {
        // Each message either holds centred (fits) or scrolls right-to-left once (too wide).
        const speed = 16; // dot columns per second
        const durs = list.map((m) => {
          const wd = raster(m).width;
          return wd > cols ? (wd + cols) / speed : hold;
        });
        const total = durs.reduce((a, b) => a + b, 0);
        let local = reduce ? 0 : t % total;
        let idx = 0;
        while (idx < list.length - 1 && local >= durs[idx]) local -= durs[idx++];
        text = list[idx];
        const { width } = raster(text);
        if (width > cols) {
          offset = reduce ? 0 : Math.floor(-cols + local * speed);
        } else {
          if (!reduce) fade = Math.max(0, Math.min(1, local / 0.25, (durs[idx] - local) / 0.25));
          offset = Math.floor((width - cols) / 2); // centre it
        }
      }
      const { grid, width } = raster(text);
      const r = cell * 0.36;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let sx = x + offset;
          if (marquee) sx = ((sx % width) + width) % width;
          const on = sx >= 0 && sx < width && grid[y * width + sx] === 1;
          const cx = x * cell + cell / 2, cy = y * cell + cell / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          if (on) {
            ctx.fillStyle = `rgba(255, 246, 228, ${0.95 * fade})`;
            ctx.shadowColor = "rgba(255, 238, 205, 0.85)";
            ctx.shadowBlur = cell * 0.9 * fade;
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.055)";
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); cache.clear(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    document.fonts?.ready.then(() => cache.clear());
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      start = 0;
    };
  }, [rows, hold, marquee, weight]);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} role="img" aria-label={ariaLabel ?? messages.join(" — ")} />;
}
