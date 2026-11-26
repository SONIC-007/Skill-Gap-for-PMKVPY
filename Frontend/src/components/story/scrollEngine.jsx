"use client";
// [FRONTEND] Native React + JS Scroll Choreography Engine | Zero external dependencies
// Provides GPU-damped scroll progress refs/callbacks, masked typographic reveals, and eased anchor jumps.

import { useEffect, useRef, useState } from "react";

/**
 * Clamp a number between min and max.
 */
export function clamp01(value) {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
}

/**
 * Compute smooth scroll progress (0 -> 1) through an element's viewport travel,
 * with exponential damping via requestAnimationFrame and zero React re-renders per frame.
 * Mode "span": 0 when element top hits bottom of viewport, 1 when element bottom leaves top.
 * Mode "sticky": 0 when element top hits top of viewport (pin start), 1 when bottom hits bottom (pin end).
 */
export function useScrollProgress(elementRef, { mode = "span", damping = 0.11, onProgress } = {}) {
    const callbackRef = useRef(onProgress);

    useEffect(() => {
        callbackRef.current = onProgress;
    }, [onProgress]);

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let current = 0;
        let target = 0;
        let rafId = null;

        const measure = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || 800;

            if (mode === "sticky") {
                const scrollable = Math.max(1, el.offsetHeight - vh);
                target = clamp01(-rect.top / scrollable);
            } else {
                const total = Math.max(1, vh + el.offsetHeight);
                target = clamp01((vh - rect.top) / total);
            }

            if (reducedMotion) {
                current = target;
                el.style.setProperty("--p", current.toFixed(4));
                if (callbackRef.current) callbackRef.current(current);
                return;
            }

            if (!rafId) {
                rafId = window.requestAnimationFrame(tick);
            }
        };

        const tick = () => {
            const diff = target - current;
            if (Math.abs(diff) < 0.0006) {
                current = target;
                el.style.setProperty("--p", current.toFixed(4));
                if (callbackRef.current) callbackRef.current(current);
                rafId = null;
                return;
            }
            current += diff * damping;
            el.style.setProperty("--p", current.toFixed(4));
            if (callbackRef.current) callbackRef.current(current);
            rafId = window.requestAnimationFrame(tick);
        };

        measure();
        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure, { passive: true });

        return () => {
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [elementRef, mode, damping]);
}

/**
 * Masked upward line/word typographic reveal triggered smoothly on scroll entry.
 */
export function RevealLine({ children, delayMs = 0, className = "" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <span ref={ref} className={`inline-block overflow-hidden align-bottom pb-[0.16em] -mb-[0.16em] ${className}`}>
            <span
                className="inline-block will-change-transform transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    transitionDelay: `${delayMs}ms`,
                    transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 108%, 0)",
                    opacity: visible ? 1 : 0,
                }}
            >
                {children}
            </span>
        </span>
    );
}

/**
 * Subtle editorial paragraph or metadata reveal without repetitive card popups.
 */
export function RevealBlock({ children, delayMs = 0, className = "", yOffset = 22 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.14, rootMargin: "0px 0px -4% 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`will-change-transform transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
            style={{
                transitionDelay: `${delayMs}ms`,
                transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${yOffset}px, 0)`,
                opacity: visible ? 1 : 0,
            }}
        >
            {children}
        </div>
    );
}

/**
 * Smooth eased scroll-to-section helper with cubic easing (no external dependency).
 */
export function scrollToSection(id) {
    if (typeof window === "undefined") return;
    const target = document.getElementById(id);
    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    const duration = Math.min(1150, Math.max(600, Math.abs(distance) * 0.45));
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        window.scrollTo(0, startY + distance * easeInOutCubic(t));
        if (t < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
}

/**
 * Smooth IntersectionObserver-triggered numeric counter (for Statistics section).
 */
export function AnimatedCounter({ value, suffix = "", prefix = "", durationMs = 1300 }) {
    const ref = useRef(null);
    const [displayVal, setDisplayVal] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let started = false;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    const startTime = performance.now();
                    const tick = (now) => {
                        const progress = Math.min(1, (now - startTime) / durationMs);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setDisplayVal(Math.round(eased * value));
                        if (progress < 1) {
                            window.requestAnimationFrame(tick);
                        }
                    };
                    window.requestAnimationFrame(tick);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [value, durationMs]);

    return (
        <span ref={ref}>
            {prefix}
            {displayVal}
            {suffix}
        </span>
    );
}
