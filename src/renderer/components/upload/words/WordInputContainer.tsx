import { useContext } from 'react';
import { useRecoilState } from 'recoil';
import {
  UploadFormContext,
  UploadFormContextType,
} from '../../../contexts/UploadFormProvider';
import WordInput from './WordInput';
import { IWord } from './WordModel';
import { WordItemErrorState, WordsAtom } from './WordsState';

interface WordInputContainerProps {
  index: number;
  word: IWord;
  handleRemoveWord: (wordId: string) => void;
}

export default function WordInputContainer({
  index,
  word,
  handleRemoveWord,
}: WordInputContainerProps) {
  const { canEdit } = useContext(UploadFormContext) as UploadFormContextType;
  const [words, setWords] = useRecoilState(WordsAtom);
  const [, setWordItemError] = useRecoilState(WordItemErrorState);

  const handleUpdateWord = (inputWord: string): void => {
    const wordAlreadyExists = words.find(
      (initialWord, initialIndex) =>
        initialWord.value === inputWord.trim() && initialIndex !== index,
    );

    if (typeof wordAlreadyExists !== 'undefined') {
      setWordItemError({ index, error: 'Ce mot est déjà dans la liste' });
    } else if (inputWord === '') {
      setWordItemError({ index, error: 'Veuillez saisir un mot' });
    } else {
      setWordItemError({ index, error: '' });
    }

    const newWords = [...words];
    const targetId = newWords.findIndex((newWord) => newWord.id === word.id);
    newWords[targetId] = { id: newWords[targetId].id, value: inputWord };
    setWords(newWords);
  };

  return (
    <WordInput
      word={word}
      handleUpdateWord={handleUpdateWord}
      handleRemoveWord={handleRemoveWord}
      canEdit={canEdit}
    />
  );
}
