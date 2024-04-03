import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { WordType } from '../../../types/Picto';
import { IPicto, pictoDb } from '../../models/Picto';
import { WordListAtom } from '../page/PageState';

function WordForm() {
  const [isEditable, setIsEditable] = useState(true);
  const [word, setWord] = useState('');
  const [picto, setPicto] = useState<IPicto | undefined>(undefined);

  const [pictos, setPictos] = useState<IPicto[]>([]);
  // or
  const [wordlist, setWordList] = useRecoilState<WordType[]>(WordListAtom);

  const [pictoIndex, setPictoIndex] = useState(0);
  const [, setAutoComplete] = useState<string[][]>([]);

  useEffect(() => {
    if (pictos.length && pictoIndex > -1) {
      setPicto(pictos[pictoIndex]);
    }
  }, [setPicto, pictos, pictoIndex, word]);

  // TODO! remove
  function onKeyDown(e: KeyboardEvent) {
    console.log('key down', e.code);
    switch (e.code) {
      case 'Space':
        if (word.length > 0) {
          setIsEditable(false);
          setWordList([...wordlist, { word, picto }]);
          setPicto(undefined);
          setWord('');
        }
        break;
      case 'Backspace':
        if (word) setWordList(wordlist.filter((w) => w.word !== word));
        break;
      case 'F1':
        // use < instead of <= to allow an undefined value (empty picto case)
        if (pictoIndex < pictos.length) {
          setPictoIndex((prev) => prev + 1);
        } else {
          // reset to first picto of list
          setPictoIndex(0);
        }
        break;
      default:
        // nothing to do
        setIsEditable(true);
    }
  }

  // TODO! remove
  async function onClick(e: MouseEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;

    const wordTarget = target.value;

    const pictosFromDb = await pictoDb.pictos
      .filter((pictoItem) => {
        const words =
          pictoItem.words.find((wordItem) =>
            wordItem.startsWith(wordTarget.trim()),
          ) || [];

        return words?.length > 0;
      })
      .toArray();

    setPictos(pictosFromDb);
    setAutoComplete([]);
  }

  // TODO! remove
  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    // avoid to change the value when space key is pressed
    if (isEditable) {
      setWord(e.target.value);
    }

    // avoid to request all pictos
    if (e.target.value.trim() === '') {
      setAutoComplete([]);
      return;
    }

    const pictosFromDb = await pictoDb.pictos
      .filter((pictoItem) => {
        const words =
          pictoItem.words.find((wordItem) =>
            wordItem.startsWith(e.target.value.trim()),
          ) || [];

        return words?.length > 0;
      })
      .toArray();

    const pictoWords = pictosFromDb.map((pictoItem) =>
      pictoItem.words.map((w) => w),
    );

    if (pictoWords.length === 1) {
      if (pictoWords[0].includes(e.target.value)) {
        setAutoComplete([]);
      }
    } else if (pictoWords.length > 1) {
      setAutoComplete(pictoWords);
    } else {
      setAutoComplete([]);
    }

    setPictos(pictosFromDb);
    setPictoIndex(0);
    if (pictosFromDb.length > 0) {
      setPicto(pictosFromDb[0]);
    } else {
      setPicto(undefined);
    }
  }
}

export default WordForm;
