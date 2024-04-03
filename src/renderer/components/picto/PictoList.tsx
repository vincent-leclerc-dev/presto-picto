import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { IPicto } from '../../models/Picto';
import ImageContainer from '../core/image/ImageContainer';
import TagsContainer from '../core/tags/TagsContainer';

interface PictoListProps {
  pictoSlice: IPicto[];
}
export default function PictoList({ pictoSlice }: PictoListProps) {
  if (pictoSlice.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center bg-neutral-900 text-sky-500 text-xl m-8 p-4 h-64 w-64 rounded">
        Aucun picto trouvé
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <ul
          className={twMerge(
            'grid grid-cols-1',
            pictoSlice.length === 1
              ? 'sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1'
              : '',
            pictoSlice.length === 2
              ? 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'
              : '',
            pictoSlice.length === 3
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
              : '',
            pictoSlice.length > 3
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : '',
            'gap-4 p-2',
          )}
        >
          {pictoSlice?.map((picto) => {
            return (
              <Link
                to={`/picto/${picto.id}`}
                className="no-underline focus:outline focus:outline-offset-0 focus:outline-2 dark:focus:outline-sky-500"
                key={picto.id}
              >
                <li className="flex flex-col justify-center items-center dark:bg-neutral-900 rounded dark:hover:bg-neutral-800 w-64 h-64">
                  <h2 className="mb-3 text-sm text-neutral-300">
                    {picto.filename}
                  </h2>
                  <ImageContainer
                    src={picto.image}
                    mimetype={picto.mimetype}
                    alt={picto.filename}
                    options={{
                      ring: true,
                      rounded: true,
                    }}
                  />
                  <TagsContainer data={picto.words} limit={3} />
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
