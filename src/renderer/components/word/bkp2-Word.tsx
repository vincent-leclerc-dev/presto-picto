import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { WordType } from '../../../types/Picto';
import { IPicto, pictoDb } from '../../models/Picto';

interface IWordProps {
  wordInput: WordType;
}

function Word({ wordInput }: IWordProps) {
  const [pictos, setPictos] = useState<IPicto[]>([]);
  const [pictoIndex, setPictoIndex] = useState(0);

  useEffect(() => {
    if (pictos.length && pictoIndex > -1) {
      setPicto(pictos[pictoIndex]);
    }
  }, [setPicto, pictos, pictoIndex, wordInput]);

  function onKeyUp(e: KeyboardEvent) {
    console.log('[word] key down', e.code);
    switch (e.code) {
      case 'Space': // try double space
        // TODO update word (and set focus on next picto?)
        if (word.length > 0) {
          setIsEditable(false);
        }
        break;
      case 'Insert':
        // TODO: insert text input and blank picto
        break;
      case 'Backspace':
        // TODO: remove word
        break;
      case 'F1':
        // console.log('F1');
        // console.log('pictos', pictos);
        // console.log('pictoIdx', pictoIndex);
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
    }
  }

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

    // console.log('pictosFromDb ²²²²²²²²²²²²²²', pictosFromDb);
    // setPictos(pictosFromDb);
  }

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    // console.log('onChange *****************', e.target.value);

    // avoid to change the value when space key is pressed
    if (isEditable) {
      setWord(e.target.value);
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

    // console.log('pictosFromDb ²²²²²²²²²²²²²²', pictosFromDb);
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

export default Word;
