interface CardCoverProps {
  monogram: string;
  hidden: boolean;
}

const CardCover = ({ monogram, hidden }: CardCoverProps) => {
  return (
    <>
      <div className='card-cover-front card-paper' aria-hidden={hidden}>
        <span className='card-frame' aria-hidden />
        <span className='card-cover-ornament' aria-hidden />
        <p className='card-cover-title'>Happy Birthday</p>
        <span className='card-cover-rule' aria-hidden />
        <span className='card-seal' aria-hidden>
          {monogram}
        </span>
      </div>
      <div className='card-cover-back' aria-hidden />
    </>
  );
};

export default CardCover;
