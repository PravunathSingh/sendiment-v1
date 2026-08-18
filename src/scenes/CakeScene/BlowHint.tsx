interface BlowHintProps {
  text: string;
}

const BlowHint = ({ text }: BlowHintProps) => {
  return (
    <p
      className='max-w-xs text-pretty text-center text-sm leading-relaxed text-sendiment-cream/80'
      aria-live='polite'
    >
      {text}
    </p>
  );
};

export default BlowHint;
