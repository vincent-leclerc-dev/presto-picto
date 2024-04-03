import { useContext, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
import {
  UploadFormContext,
  UploadFormContextType,
} from '../../../contexts/UploadFormProvider';
import WordForm from './WordForm';
import { IWord } from './WordModel';
import { WordInputErrorState, WordsAtom } from './WordsState';

export default function WordFormContainer() {
  const { canEdit } = useContext(UploadFormContext) as UploadFormContextType;
  const [words, setWords] = useRecoilState(WordsAtom);
  const [wordInputError, setWordInputError] =
    useRecoilState(WordInputErrorState);

  const [newWord, setNewWord] = useState<string>('');

  const newWordInputRef = useRef<HTMLInputElement>(null);

  const handleAddWord = (inputWord: string): void => {
    const cleanInputWord = { id: v4(), value: inputWord.trim() };
    if (cleanInputWord.value === '') {
      setWordInputError('Veuillez saisir un mot');
      return;
    }

    if (
      words.find((word: IWord) => word.value.trim() === cleanInputWord.value)
    ) {
      setWordInputError('Ce mot est déjà dans la liste');
      return;
    }

    setWordInputError('');

    const newWords = [...words, cleanInputWord];
    setWords(newWords);
    setNewWord(inputWord);
  };

  return (
    <WordForm
      newWordInputRef={newWordInputRef}
      newWord={newWord}
      setNewWord={setNewWord}
      wordInputError={wordInputError}
      handleAddWord={handleAddWord}
      canEdit={canEdit}
    />
  );
}
