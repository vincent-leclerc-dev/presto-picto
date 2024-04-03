import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { WordType } from '../../../types/Picto';
import InputText from '../word/InputText';
import { CurrentFocusIndexAtom, WordListAtom } from './PageState';

interface IKeyboardEvent {
  key: string;
  code: string;
  keyCode: number;
}

export default function Page() {
  const [wordlist] = useRecoilState<WordType[]>(WordListAtom);
  const [currentFocusIndex, setCurrentFocusIndex] = useRecoilState<number>(
    CurrentFocusIndexAtom,
  );

  const inputRefs = useRef<any>([]);

  const onKeyUp = useCallback((e: IKeyboardEvent) => {
    switch (e.code) {
      // TODO! manage cursor position or limit complexity of keyboard events.
      /*
        case 'ArrowLeft':
          if (currentFocusIndex > 0) {
            setCurrentFocusIndex((prev) => prev - 1);
          } else {
            // reset to last picto of list to loop
            setCurrentFocusIndex(wordlist.length);
          }

          break;
        case 'ArrowRight':
          if (currentFocusIndex < wordlist.length) {
            setCurrentFocusIndex((prev) => prev + 1);
          } else {
            // reset to first picto of list to loop
            setCurrentFocusIndex(0);
          }

          break;
        */
      case 'F1':
        break;
      default:
      // nothing to do
    }
  }, []);

  useEffect(() => {
    if (inputRefs.current[currentFocusIndex]) {
      inputRefs.current[currentFocusIndex].focus();
    }

    document.addEventListener('keydown', onKeyUp, false);
    return () => {
      document.removeEventListener('keydown', onKeyUp, false);
    };
  }, [wordlist, currentFocusIndex, setCurrentFocusIndex, onKeyUp]);
  if (!wordlist) {
    return null;
  }

  // TODO! create a player to read sentences.
  /*
  const handleBlur = (value: string) => {
    console.log('handleBlur', value);
    utterThis.text = value;
    utterThis.voice = voice;
    synth.speak(utterThis);
  };
  */

  return (
    <div className="flex flex-col mx-auto w-[210mm] bg-white p-2">
      <div className="flex flex-wrap justify-start items-start bg-white">
        {wordlist.map((word: WordType, index) => {
          return (
            <InputText
              key={v4()}
              wordInput={word}
              index={index}
              ref={(element: any) => {
                inputRefs.current[index] = element;
                return inputRefs;
              }}
              mode="update"
              options={{
                customStyles:
                  word.word.length === 0 ? 'dark:bg-neutral-100' : 'dark:white',
                width: `${
                  word.word.length === 0 ? '50px' : word.word.length * 10
                }`,
              }}
            />
          );
        })}
        <InputText
          index={wordlist.length === 0 ? 0 : wordlist.length}
          ref={(element: any) => {
            inputRefs.current[wordlist.length] = element;
            return inputRefs;
          }}
          mode="create"
          options={{
            customStyles:
              'dark:bg-neutral-100 dark:focus:ring-amber-500 dark:focus:bg-amber-100 dark:hover:ring-sky-300',
          }}
        />
      </div>
    </div>
  );
}
