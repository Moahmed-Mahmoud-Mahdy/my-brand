"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface CursorContextValue {
  variant: "default" | "hover" | "text";
  setVariant: (v: "default" | "hover" | "text") => void;
}

const CursorContext = createContext<CursorContextValue | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<
    "default" | "hover" | "text"
  >("default");
  const [enabled, setEnabled] = useState(false);

  // Enable cursor only on fine-pointer (desktop) devices — done once on mount.
  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (mq.matches) {
      setEnabled(true);
      document.body.classList.add("cursor-active");
    }
    return () => {
      document.body.classList.remove("cursor-active");
    };
  }, []);

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      {enabled && <CustomCursor variant={variant} />}
      {children}
    </CursorContext.Provider>
  );
}

// useIsomorphicLayoutEffect avoids SSR warnings while running synchronously on client
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) return { setVariant: () => {} };
  return ctx;
}

function CustomCursor({
  variant,
}: {
  variant: "default" | "hover" | "text";
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let rafRing = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafRing = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafRing = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafRing);
    };
  }, []);

  const ringSize =
    variant === "hover" ? 56 : variant === "text" ? 40 : 32;
  const dotSize = variant === "text" ? 2 : 6;
  const ringOpacity = variant === "hover" ? 0.9 : variant === "text" ? 0.5 : 0.6;
  const dotOpacity = variant === "hover" ? 0 : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 will-change-transform"
        style={{
          width: ringSize,
          height: ringSize,
          transition:
            "width 0.3s cubic-bezier(0.22,1,0.36,1), height 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
          opacity: ringOpacity,
        }}
      >
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: "rgba(214, 178, 94, 0.7)",
            boxShadow:
              variant === "hover"
                ? "0 0 24px rgba(214,178,94,0.5), inset 0 0 12px rgba(214,178,94,0.25)"
                : "0 0 12px rgba(214,178,94,0.3)",
            transform: clicking ? "scale(0.8)" : "scale(1)",
            transition: "transform 0.2s ease, box-shadow 0.3s ease",
          }}
        />
      </div>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 will-change-transform"
        style={{
          width: dotSize,
          height: dotSize,
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
          opacity: dotOpacity,
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--gold-primary)",
            boxShadow:
              "0 0 8px rgba(214,178,94,0.9), 0 0 16px rgba(214,178,94,0.5)",
          }}
        />
      </div>
    </div>
  );
}
