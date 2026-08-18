interface BlowHintProps {
  text: string;
}

const BlowHint = ({ text }: BlowHintProps) => {
  return (
    <p
      className='relative z-10 mt-2 max-w-xs text-pretty text-center text-sm leading-relaxed text-sendiment-cream/80'
      aria-live='polite'
    >
      {text}
    </p>
  );
};

export default BlowHint;
