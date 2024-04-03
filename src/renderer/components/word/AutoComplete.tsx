import { twMerge } from 'tailwind-merge';
import { v4 } from 'uuid';

interface IAutoCompleteProps {
  words: string[][];
  onClickWord: (word: string) => void;
  wordIndexSelected: number;
}

// TODO: split as container and presentational component
function AutoComplete({
  words,
  onClickWord,
  wordIndexSelected,
}: IAutoCompleteProps) {
  return (
    <ul
      className={twMerge(
        words.length
          ? 'flex flex-col justify-start items-start rounded'
          : 'hidden',
        'absolute top-[51px] left-0 bg-neutral-300 text-black p-1 w-[400px]',
      )}
    >
      {words.map((item, index) => (
        <li
          className={twMerge(
            /* 'dark:odd:bg-neutral-200 dark:even:bg-neutral-300 w-full cursor-pointer', */
            wordIndexSelected === index ? 'dark:bg-sky-500' : '',
          )}
          key={v4()}
        >
          <ul className="flex flex-row p-2">
            {item.map((w, i) => (
              <li key={w} className="">
                <button
                  className="text-left p-1 dark:hover:bg-sky-500 dark:hover:text-white rounded"
                  type="button"
                  onClick={() => onClickWord(w)}
                >
                  <div className="flex flex-row">
                    <span>{w}</span>
                    <span>{i + 1 === item.length ? '.' : ','}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default AutoComplete;
