import { gsap } from 'gsap';

/**
 * GSAP slide transitions.
 *  - title-slide        → zoom / fade
 *  - transition, recap  → dissolve
 *  - code-example       → subtle fade / scale
 *  - everything else    → horizontal slide / fade
 * Content inside a slide is never staggered: the slide appears as one unit.
 */

const INLINE_PROPS = 'opacity,visibility,transform,translate,scale,rotate,filter,zIndex,x,y';

let activeTimeline = null;
let activeResolve = null;

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Kill every tween on the given slides and all of their descendants. */
export function killSlideTweens(...slides) {
  slides.filter(Boolean).forEach((slide) => {
    gsap.killTweensOf(slide);
    const descendants = slide.querySelectorAll('*');
    if (descendants.length) gsap.killTweensOf(descendants);
  });
}

/** Remove GSAP inline state so CSS (.active) owns visibility again. */
export function clearSlideInline(slide) {
  if (!slide) return;
  gsap.set(slide, { clearProps: INLINE_PROPS });
}

/** Stop an in-flight transition (used by instant navigation and print). */
export function cancelTransition() {
  if (activeTimeline) {
    activeTimeline.kill();
    activeTimeline = null;
  }
  if (activeResolve) {
    const resolve = activeResolve;
    activeResolve = null;
    resolve(false);
  }
}

function variantFor(type, direction, reduced) {
  if (reduced) {
    return { from: {}, to: {}, exit: {}, duration: 0.2, ease: 'none' };
  }
  switch (type) {
    case 'title-slide':
      return {
        from: { scale: 1.06 },
        to: { scale: 1 },
        exit: { scale: 0.96 },
        duration: 0.7,
        ease: 'power2.out'
      };
    case 'transition':
    case 'recap':
      return { from: {}, to: {}, exit: {}, duration: 0.65, ease: 'power1.inOut' };
    case 'code-example':
      return {
        from: { scale: 0.985 },
        to: { scale: 1 },
        exit: { scale: 1.01 },
        duration: 0.45,
        ease: 'power2.out'
      };
    default: {
      const shift = 140 * direction;
      return {
        from: { x: shift },
        to: { x: 0 },
        exit: { x: -shift },
        duration: 0.55,
        ease: 'power3.out'
      };
    }
  }
}

/**
 * Animate from oldSlide to newSlide. Resolves true when finished,
 * false when cancelled. The caller owns the isTransitioning lock.
 */
export function runTransition(oldSlide, newSlide, direction = 1) {
  cancelTransition();
  killSlideTweens(oldSlide, newSlide);

  const v = variantFor(newSlide.dataset.type, direction >= 0 ? 1 : -1, prefersReducedMotion());

  return new Promise((resolve) => {
    activeResolve = resolve;

    // 1. Position the incoming slide (still invisible) before showing it.
    gsap.set(newSlide, { ...v.from, autoAlpha: 0, zIndex: 3, force3D: true });
    newSlide.classList.add('active');
    newSlide.setAttribute('aria-hidden', 'false');
    if (oldSlide && oldSlide !== newSlide) {
      gsap.set(oldSlide, { zIndex: 2 });
    }

    const finish = () => {
      if (oldSlide && oldSlide !== newSlide) {
        oldSlide.classList.remove('active');
        oldSlide.setAttribute('aria-hidden', 'true');
        clearSlideInline(oldSlide);
      }
      clearSlideInline(newSlide);
      activeTimeline = null;
      const done = activeResolve;
      activeResolve = null;
      if (done) done(true);
    };

    const tl = gsap.timeline({ onComplete: finish });
    activeTimeline = tl;

    if (oldSlide && oldSlide !== newSlide) {
      tl.to(oldSlide, {
        ...v.exit,
        autoAlpha: 0,
        duration: v.duration * 0.85,
        ease: v.ease,
        overwrite: 'auto'
      }, 0);
    }
    tl.to(newSlide, {
      ...v.to,
      autoAlpha: 1,
      duration: v.duration,
      ease: v.ease,
      overwrite: 'auto'
    }, 0);
  });
}
