import {
  CARD_IDLE_TILT_DEG,
  CARD_OPEN_OVERSHOOT_DEG,
  CARD_OPEN_REST_DEG,
  CTA_ENTER_SCALE,
  EASE_CARD_HINGE,
  EASE_OUT_EXPO,
} from './config';
import { scaleTimeline, TIMELINES } from '../experience/timelines';

function seconds(ms: number, reducedMotion: boolean): number {
  return scaleTimeline(ms, reducedMotion) / 1000;
}

export function introSceneVariants(reducedMotion: boolean) {
  return {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: seconds(TIMELINES.intro.fadeOut, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function introHeadlineVariants(reducedMotion: boolean) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: seconds(TIMELINES.intro.headlineDelay, reducedMotion),
        duration: seconds(TIMELINES.intro.headlineDuration, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function introSublineVariants(reducedMotion: boolean) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: seconds(TIMELINES.intro.sublineDelay, reducedMotion),
        duration: seconds(TIMELINES.intro.sublineDuration, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function cakeSceneVariants(reducedMotion: boolean) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: seconds(TIMELINES.motion.fadeMedium, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
    exit: {
      opacity: 0,
      y: reducedMotion ? 0 : -16,
      transition: {
        duration: seconds(TIMELINES.motion.fade, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function cakeContainerVariants(reducedMotion: boolean) {
  return {
    initial: { opacity: 0, scale: reducedMotion ? 1 : 0.85 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: seconds(TIMELINES.cakeEnter.containerDuration, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
    celebrate: {
      opacity: 0.3,
      scale: reducedMotion ? 1 : 0.92,
      transition: {
        delay: seconds(TIMELINES.celebration.cakeFadeDelay, reducedMotion),
        duration: seconds(TIMELINES.celebration.cakeFadeDuration, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function celebrationSceneVariants(reducedMotion: boolean) {
  return {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: seconds(TIMELINES.motion.fadeFast, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function cakeLayersVariants(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: { opacity: 0, y: 0 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          delay: seconds(TIMELINES.cakeEnter.layersSlideUp, true),
          duration: seconds(TIMELINES.motion.fadeFast, true),
          ease: EASE_OUT_EXPO,
        },
      },
    };
  }

  return {
    initial: { opacity: 0, y: 32 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: seconds(TIMELINES.cakeEnter.layersSlideUp, false),
        type: 'spring' as const,
        stiffness: 280,
        damping: 22,
      },
    },
  };
}

export function cakeDropInVariants(reducedMotion: boolean, index: number) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : -18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay:
          seconds(TIMELINES.cakeEnter.candlesDropIn, reducedMotion) +
          index * (TIMELINES.blowing.blowStaggerMs / 1000),
        duration: seconds(TIMELINES.motion.dropIn, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function cardRigVariants(reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0, y: 0, rotateX: 0, rotateY: 0 },
      revealed: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        transition: {
          duration: seconds(TIMELINES.cardReveal.enterDuration, true),
          ease: EASE_OUT_EXPO,
        },
      },
      open: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
      },
    };
  }

  return {
    hidden: { opacity: 0, y: 88, rotateX: 16, rotateY: CARD_IDLE_TILT_DEG },
    revealed: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: CARD_IDLE_TILT_DEG,
      transition: {
        type: 'spring' as const,
        stiffness: 150,
        damping: 18,
        mass: 0.9,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: seconds(TIMELINES.cardOpening.duration, false),
        ease: EASE_CARD_HINGE,
      },
    },
  };
}

export function cardCoverVariants(reducedMotion: boolean) {
  const closeDuration = seconds(TIMELINES.cardReplay.close, reducedMotion);
  const openDuration = seconds(TIMELINES.cardOpening.duration, reducedMotion);

  if (reducedMotion) {
    return {
      closed: {
        opacity: 1,
        rotateY: 0,
        transition: { duration: closeDuration, ease: EASE_OUT_EXPO },
      },
      open: {
        opacity: 0,
        rotateY: 0,
        transition: { duration: openDuration, ease: EASE_OUT_EXPO },
      },
    };
  }

  return {
    closed: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: closeDuration,
        ease: EASE_CARD_HINGE,
      },
    },
    open: {
      rotateY: [
        0,
        CARD_OPEN_OVERSHOOT_DEG,
        CARD_OPEN_REST_DEG,
      ],
      opacity: 1,
      transition: {
        duration: openDuration,
        times: [0, TIMELINES.cardOpening.overshootAt, 1],
        ease: EASE_CARD_HINGE,
      },
    },
  };
}

export function balloonsGroupVariants(reducedMotion: boolean) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: seconds(
          TIMELINES.cardOpen.balloonStagger,
          reducedMotion,
        ),
        delayChildren: seconds(TIMELINES.cardOpen.balloonsEnter, reducedMotion),
      },
    },
  };
}

export function balloonEnterVariants(reducedMotion: boolean) {
  return {
    hidden: {
      opacity: 0,
      x: reducedMotion ? 0 : -64,
      transition: {
        duration: seconds(TIMELINES.motion.balloonOut, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: seconds(TIMELINES.motion.balloonIn, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function messageItemVariants(reducedMotion: boolean, delayMs: number) {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: seconds(delayMs, reducedMotion),
        duration: seconds(TIMELINES.motion.fadeSlow, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function messageSparkleVariants(reducedMotion: boolean, delayMs: number) {
  return {
    hidden: {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.6,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: seconds(delayMs, reducedMotion),
        duration: seconds(TIMELINES.motion.sparkle, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function cardReplayVariants(reducedMotion: boolean, delayMs: number) {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 8,
      pointerEvents: 'none' as const,
    },
    visible: {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto' as const,
      transition: {
        delay: seconds(delayMs, reducedMotion),
        duration: seconds(TIMELINES.motion.fade, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}

export function introCtaVariants(reducedMotion: boolean) {
  return {
    initial: {
      opacity: 0,
      scale: reducedMotion ? 1 : CTA_ENTER_SCALE,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: seconds(TIMELINES.intro.ctaDelay, reducedMotion),
        duration: seconds(TIMELINES.intro.ctaDuration, reducedMotion),
        ease: EASE_OUT_EXPO,
      },
    },
  };
}
