import WordInputContainer from './WordInputContainer';
import { IWord } from './WordModel';

interface WordListProps {
  words: IWord[];
  wordListError: string;
  handleRemoveWord: (wordId: string) => void;
  handleResetWords: () => void;
  wordsHasChanged: boolean;
  canEdit: boolean;
}
export default function WordList({
  words,
  wordListError,
  handleRemoveWord,
  handleResetWords,
  wordsHasChanged,
  canEdit,
}: WordListProps) {
  const ResetButton = wordsHasChanged ? (
    <button
      type="button"
      disabled={!canEdit}
      onClick={() => handleResetWords()}
      className={`border-none bg-none underline ${
        canEdit
          ? 'dark:text-blue-500 dark:hover:text-blue-400 cursor-pointer'
          : 'dark:text-gray-500 cursor-default'
      }
      `}
    >
      Réinitialiser
    </button>
  ) : null;

  return (
    <div className="flex flex-col w-full h-full md:h-[432px] text-center overflow-y-auto p-2">
      {ResetButton}
      <ul className="flex flex-col justify-center items-center">
        {words.map((word, i) => (
          <li
            key={word.id}
            className="flex flex-row justify-center items-center mt-2 p-2 dark:bg-blue-100 rounded"
          >
            <WordInputContainer
              word={word}
              index={i}
              handleRemoveWord={handleRemoveWord}
            />
          </li>
        ))}
      </ul>
      {wordListError ? (
        <div className="pt-2 text-rose-500">{wordListError}</div>
      ) : null}
    </div>
  );
}
