import React, { ReactNode, useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export default function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [coords, setCoords] = useState({ x: 0, y: 0, side: "top" as "top" | "bottom" });

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Flip side based on distance to top of screen
      const side = rect.top < 150 ? "bottom" : "top";
      
      // Mid-point of trigger
      let x = rect.left + rect.width / 2;
      
      // Horizontal clamping for screen edges
      const minPadding = 20;
      if (x < minPadding) x = minPadding;
      if (x > viewportWidth - minPadding) x = viewportWidth - minPadding;

      setCoords({
        x,
        y: side === "top" ? rect.top : rect.bottom,
        side
      });
    }
  };

  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResizeScroll = () => updatePosition();
      window.addEventListener("scroll", handleResizeScroll, true);
      window.addEventListener("resize", handleResizeScroll);
      return () => {
        window.removeEventListener("scroll", handleResizeScroll, true);
        window.removeEventListener("resize", handleResizeScroll);
      };
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  return (
    <div
      ref={triggerRef}
      className="inline-flex shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <div
              className="fixed pointer-events-none z-[999999]"
              style={{
                left: coords.x,
                top: coords.y,
              }}
            >
              {/* Layer 2: Static Centering (Safe from Framer Motion) */}
              <div 
                style={{
                  transform: coords.side === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
                }}
              >
                {/* Layer 3: Animations */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: coords.side === "top" ? 8 : -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className={`relative px-2.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded-lg shadow-2xl whitespace-nowrap ${
                    coords.side === "top" ? "mb-2.5" : "mt-2.5"
                  }`}
                >
                  {content}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 border-[5px] border-transparent ${
                      coords.side === "top"
                        ? "top-full border-t-slate-900 dark:border-t-white"
                        : "bottom-full border-b-slate-900 dark:border-b-white"
                    }`}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
