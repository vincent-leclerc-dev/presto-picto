import { IWord } from './WordModel';

interface WordInputProps {
  word: IWord;
  handleUpdateWord: (word: string) => void;
  handleRemoveWord: (wordId: string) => void;
  canEdit: boolean;
}

export default function WordInput({
  word,
  handleUpdateWord,
  handleRemoveWord,
  canEdit,
}: WordInputProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center">
        <input
          type="text"
          onChange={(e) => handleUpdateWord(e.target.value)}
          readOnly={!canEdit}
          value={word.value}
          className={` p-2 text-center dark:text-black border-none outline-none rounded ${
            canEdit
              ? 'dark:bg-white cursor-text'
              : 'dark:bg-neutral-300 dark:text-neutral-400 cursor-default'
          }`}
        />
        <button
          type="button"
          disabled={!canEdit}
          onClick={() => handleRemoveWord(word.id)}
          className={`
                flex flex-row justify-center items-center
                h-10 w-10 rounded-full ml-2
                 text-white
                ${
                  canEdit
                    ? 'dark:bg-rose-500 dark:text-neutral-100 dark:hover:bg-rose-400 cursor-pointer'
                    : 'dark:bg-neutral-300 dark:text-neutral-400 cursor-default'
                }
              `}
        >
          <i className="fas fa-minus" />
        </button>
      </div>
      {typeof word.error !== 'undefined' && (
        <div className="pt-2 dark:text-rose-500">{word.error}</div>
      )}
    </div>
  );
}
