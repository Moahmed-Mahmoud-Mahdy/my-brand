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

// We always render the custom cursor component. It stays invisible (opacity 0)
// until the first real `mousemove` event — so on touch-only devices it never
// appears, while on any device with a mouse (including preview iframes that
// don't report `pointer: fine`) it shows up the moment the user moves the mouse.
// We hide the native cursor via the `.cursor-active` body class only when the
// device is not primarily touch-based, so mobile users keep their normal
// behaviour for form inputs etc.
function isTouchPrimary(): boolean {
  if (typeof window === "undefined") return false;
  const maxTouch = navigator.maxTouchPoints || 0;
  return maxTouch > 0 && !window.matchMedia("(any-pointer: fine)").matches;
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<
    "default" | "hover" | "text"
  >("default");

  useIsomorphicLayoutEffect(() => {
    if (!isTouchPrimary()) {
      document.body.classList.add("cursor-active");
    }
    return () => {
      document.body.classList.remove("cursor-active");
    };
  }, []);

  return (
    <CursorContext.Provider value={{ variant, setVariant }}>
      <CustomCursor variant={variant} />
      {children}
    </CursorContext.Provider>
  );
}

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
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    // Initialize position to viewport center so the cursor is visible
    // immediately even before the first mousemove.
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafRing = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafRing = requestAnimationFrame(animateRing);
    };

    // Place cursor at center initially (hidden until first mousemove)
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }

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
    variant === "hover" ? 64 : variant === "text" ? 44 : 38;
  const dotSize = variant === "text" ? 3 : 8;
  const ringOpacity = variant === "hover" ? 1 : variant === "text" ? 0.7 : 0.85;
  const dotOpacity = variant === "hover" ? 0.4 : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000]"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 will-change-transform"
        style={{
          width: ringSize,
          height: ringSize,
          transition:
            "width 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
          opacity: ringOpacity,
        }}
      >
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: "rgba(214, 178, 94, 0.85)",
            boxShadow:
              variant === "hover"
                ? "0 0 28px rgba(214,178,94,0.6), inset 0 0 16px rgba(214,178,94,0.3)"
                : "0 0 18px rgba(214,178,94,0.45), inset 0 0 8px rgba(214,178,94,0.15)",
            transform: clicking ? "scale(0.78)" : "scale(1)",
            transition: "transform 0.18s ease, box-shadow 0.3s ease",
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
              "0 0 10px rgba(214,178,94,1), 0 0 22px rgba(214,178,94,0.7), 0 0 36px rgba(214,178,94,0.35)",
          }}
        />
      </div>
    </div>
  );
}
