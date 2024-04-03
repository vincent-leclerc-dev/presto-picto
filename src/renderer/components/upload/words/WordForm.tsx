import React from 'react';

interface WordFormProps {
  newWordInputRef: React.RefObject<HTMLInputElement>;
  newWord: string;
  setNewWord: (newWord: string) => void;
  wordInputError: string;
  handleAddWord: (word: string) => void;
  canEdit: boolean;
}

export default function WordForm({
  newWordInputRef,
  newWord,
  setNewWord,
  wordInputError,
  handleAddWord,
  canEdit,
}: WordFormProps) {
  return (
    <div className="flex flex-col items-center justify-center dark:bg-blue-100 p-2 rounded">
      <div className="flex flex-row items-center justify-center">
        <input
          type="text"
          onChange={(e) => setNewWord(e.target.value)}
          value={newWord}
          placeholder="Ajouter un mot"
          ref={newWordInputRef}
          readOnly={!canEdit}
          className={` p-2 text-center text-black border-none outline-none rounded ${
            canEdit
              ? 'dark:bg-white cursor-text'
              : 'dark:bg-gray-300 text-gray-500 cursor-default'
          }`}
        />
        <button
          className={`
                flex flex-row justify-center items-center
                h-10 w-10 rounded-full ml-2
                 text-white
                ${
                  canEdit
                    ? 'dark:bg-sky-500 dark:hover:bg-sky-400 cursor-pointer'
                    : 'dark:bg-gray-500 cursor-default'
                }
              `}
          type="button"
          disabled={!canEdit}
          onClick={() => handleAddWord(newWord)}
        >
          <i className="fas fa-plus" />
        </button>
      </div>

      <div
        className={`
        ${
          wordInputError
            ? 'transition-opacity duration-300 ease-in opacity-100'
            : 'transition-opacity duration-300 ease-out opacity-0'
        }
        pt-2 text-rose-500`}
      >
        {wordInputError}
      </div>
    </div>
  );
}
