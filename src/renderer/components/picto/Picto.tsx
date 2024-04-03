import { IPicto } from '../../models/Picto';
import ImageContainer from '../core/image/ImageContainer';

interface PictoProps {
  picto: IPicto | undefined;
}
export default function Picto({ picto }: PictoProps) {
  return (
    <div className="flex flex-col w-full h-full text-center p-2 bg-white">
      <h1>Picto {picto?.id}</h1>
      <div className="flex flex-col justify-center items-center h-full w-full bg-rose-500">
        {picto && (
          <ImageContainer
            src={picto.image}
            mimetype={picto.mimetype}
            alt={picto.filename}
          />
        )}
      </div>
    </div>
  );
}
