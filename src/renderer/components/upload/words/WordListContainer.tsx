import { useContext, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  UploadFormContext,
  UploadFormContextType,
} from '../../../contexts/UploadFormProvider';
import useIsDirty from '../../../hooks/useIsDirty';
import WordList from './WordList';
import { InitialWordsAtom, WordListErrorState, WordsAtom } from './WordsState';

export default function WordListContainer() {
  const [words, setWords] = useRecoilState(WordsAtom);
  const [wordListError, setWordListError] = useRecoilState(WordListErrorState);
  const [initialWords] = useRecoilState(InitialWordsAtom);
  const [wordsHasChanged, setWordsHasChanged] = useState(false);
  const { canEdit } = useContext(UploadFormContext) as UploadFormContextType;
  const stateIsDirty = useIsDirty(words, initialWords);
  useEffect(() => {
    setWordsHasChanged(stateIsDirty);
    if (words.length === 0) {
      setWordListError('Veuillez ajouter au moins un mot.');
    } else {
      setWordListError('');
    }
  }, [initialWords, words, setWordListError, stateIsDirty]);

  const handleRemoveWord = (wordId: string): void => {
    const newWords = [...words];
    const targetId = newWords.findIndex((newWord) => newWord.id === wordId);

    newWords.splice(targetId, 1);
    setWords(newWords);
  };

  const handleResetWords = (): void => {
    setWords(initialWords);
    setWordListError('');
  };

  return (
    <WordList
      words={words}
      wordListError={wordListError}
      handleRemoveWord={handleRemoveWord}
      handleResetWords={handleResetWords}
      wordsHasChanged={wordsHasChanged}
      canEdit={canEdit}
    />
  );
}
