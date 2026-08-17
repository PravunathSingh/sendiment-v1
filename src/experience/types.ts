export type ExperienceStage =
  | 'intro'
  | 'cake-enter'
  | 'blowing'
  | 'celebration'
  | 'card-reveal'
  | 'card-opening'
  | 'card-open'
  | 'message'
  | 'complete';

export type ExperienceAction =
  | { type: 'START_EXPERIENCE' }
  | { type: 'CAKE_ENTER_COMPLETE' }
  | { type: 'ALL_CANDLES_OUT' }
  | { type: 'CELEBRATION_COMPLETE' }
  | { type: 'CARD_SETTLED' }
  | { type: 'CARD_OPEN_COMPLETE' }
  | { type: 'BALLOONS_SETTLED' }
  | { type: 'MESSAGE_REVEAL_COMPLETE' };

export type MicStatus =
  | 'idle'
  | 'starting'
  | 'active'
  | 'denied'
  | 'unsupported';

export type InteractionMode = 'microphone' | 'tap-hold';

export type BlowProgression = {
  litCount: number;
  totalBlowableCandles: number;
  autoFinishing: boolean;
};

export type StageCluster = 'intro' | 'cake' | 'celebration' | 'card';

const STAGE_CLUSTERS: Record<ExperienceStage, StageCluster> = {
  intro: 'intro',
  'cake-enter': 'cake',
  blowing: 'cake',
  celebration: 'celebration',
  'card-reveal': 'card',
  'card-opening': 'card',
  'card-open': 'card',
  message: 'card',
  complete: 'card',
};

const LOCKED_STAGES = new Set<ExperienceStage>([
  'cake-enter',
  'celebration',
  'card-reveal',
  'card-opening',
]);

export function getStageCluster(stage: ExperienceStage): StageCluster {
  return STAGE_CLUSTERS[stage];
}

export function isInteractionLocked(stage: ExperienceStage): boolean {
  return LOCKED_STAGES.has(stage);
}

export function isCakeStage(stage: ExperienceStage): boolean {
  return stage === 'cake-enter' || stage === 'blowing';
}

export function isCardStage(stage: ExperienceStage): boolean {
  return getStageCluster(stage) === 'card' && stage !== 'intro';
}

export function isCardOpenStage(stage: ExperienceStage): boolean {
  return (
    stage === 'card-opening' ||
    stage === 'card-open' ||
    stage === 'message' ||
    stage === 'complete'
  );
}

export function isMessageStage(stage: ExperienceStage): boolean {
  return stage === 'message' || stage === 'complete';
}
