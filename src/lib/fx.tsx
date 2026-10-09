import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ---------------------------------- hooks --------------------------------- */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.18 },
  once = true,
): [React.RefObject<T>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.unobserve(e.target);
        } else if (!once) {
          setInView(false);
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

/* --------------------------------- Reveal --------------------------------- */

type RevealProps = {
  as?: keyof HTMLElementTagNameMap;
  children?: ReactNode;
  className?: string;
  delay?: number;
  dir?: "up" | "left" | "right";
  id?: string;
};

export function Reveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  dir = "up",
  id,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });
  const dirClass = dir === "left" ? "rv rv-left" : dir === "right" ? "rv rv-right" : "rv";
  return createElement(
    as,
    {
      ref,
      id,
      className: `${dirClass} ${inView ? "rv-in" : ""} ${className}`,
      style: { ["--rv-delay" as string]: `${delay}ms` },
    },
    children,
  );
}

/* ----------------------------- Scramble decode ----------------------------- */

const GLYPHS = "▮▯◢◣◤◥‹›/\\<>+=*#§ΔΞΨ01";

export function Scramble({
  text,
  className = "",
  speed = 34,
  startDelay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  as?: keyof HTMLElementTagNameMap;
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.3 });
  const [out, setOut] = useState(reduced ? text : "");
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    if (!inView) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      frame.current = 0;
      interval = setInterval(() => {
        frame.current += 1;
        const locked = Math.floor(frame.current / 2.4);
        if (locked >= text.length) {
          setOut(text);
          if (interval) clearInterval(interval);
          return;
        }
        let s = text.slice(0, locked);
        for (let i = locked; i < text.length; i++) {
          s += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [inView, text, reduced, speed, startDelay]);

  return createElement(
    as,
    { ref, className },
    out || (reduced ? text : "\u00A0"),
  );
}

/* --------------------------------- CountUp --------------------------------- */

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [val, setVal] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {prefix}
      {String(val).padStart(2, "0")}
      {suffix}
    </span>
  );
}

/* ------------------------------- Scroll spy ------------------------------- */

export function useScrollSpy(ids: string[], offset = 140): string {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);
  return active;
}

/* ------------------------------ Section kicker ----------------------------- */

export function Kicker({
  index,
  label,
  tone = "teal",
  className = "",
}: {
  index: string;
  label: string;
  tone?: "teal" | "ember";
  className?: string;
}) {
  const toneCls = tone === "teal" ? "text-teal" : "text-ember";
  const rule = tone === "teal" ? "bg-teal/40" : "bg-ember/40";
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className={`font-display text-[11px] tracking-[0.35em] ${toneCls}`}>
        ‹ {index} ›
      </span>
      <span className="font-cond text-sm font-medium uppercase tracking-[0.42em] text-fog">
        {label}
      </span>
      <span className={`h-px w-16 ${rule}`} />
    </div>
  );
}

export function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      setCopied(false);
    }
  }, []);
  return [copied, copy];
}


