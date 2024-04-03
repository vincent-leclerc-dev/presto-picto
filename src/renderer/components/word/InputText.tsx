import {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { twMerge } from 'tailwind-merge';

import { WordType } from '../../../types/Picto';
import { IPicto, pictoDb } from '../../models/Picto';
import ImageContainer from '../core/image/ImageContainer';
import { CurrentFocusIndexAtom, WordListAtom } from '../page/PageState';
import AutoComplete from './AutoComplete';

interface IInputTextProps {
  index: any;
  mode: string;
  wordInput?: WordType;
  options?: { width?: string; customStyles?: string };
}

const InputText = forwardRef(
  ({ index, mode, wordInput, options }: IInputTextProps, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(wordInput?.word || '');
    const [picto, setPicto] = useState<IPicto | undefined>(wordInput?.picto);
    const [autoComplete, setAutoComplete] = useState<string[][]>([]);
    const [pictos, setPictos] = useState<IPicto[]>([]);
    const [pictoIndex, setPictoIndex] = useState(0);
    const [inputTextWidth, setInputTextWidth] = useState('100%');
    const [wordlist, setWordList] = useRecoilState<WordType[]>(WordListAtom);
    const [, setCurrentFocusIndex] = useRecoilState<number>(
      CurrentFocusIndexAtom,
    );
    const [isFocused, setIsFocused] = useState(false);
    const [backspaceCounter, setBackspaceCounter] = useState(0);

    useEffect(() => {
      if (isFocused || value.length === 0) {
        setInputTextWidth('100%');
      } else {
        setInputTextWidth(`${value.length * 10}px`);
      }

      if (pictos.length && pictoIndex > -1) {
        setPicto(pictos[pictoIndex]);
      }
    }, [setPicto, pictos, pictoIndex, value.length, isFocused]);

    useImperativeHandle(
      ref, // forwarded ref
      () => {
        return {
          focus() {
            inputRef.current!.focus();
          },
          blur() {
            inputRef.current!.blur();
          },
        }; // the forwarded ref value
      },
      [],
    );

    const getPictosStartWith = async (term: string): Promise<IPicto[]> => {
      if (term.length < 2) {
        return [];
      }

      const pictosFromDb = await pictoDb.pictos
        .filter((pictoItem) => {
          const words =
            pictoItem.words.find((wordItem) =>
              wordItem.startsWith(term.trim()),
            ) || [];

          return words?.length > 0;
        })
        .toArray();

      setPictos(pictosFromDb);

      return pictosFromDb;
    };

    async function handleChange(e: ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
      setPicto(undefined);
      setAutoComplete([]);

      const pictosFromDb = await getPictosStartWith(e.target.value);

      if (pictosFromDb.length > 0) {
        setPicto(pictosFromDb[0]);
      } else {
        setPicto(undefined);
      }

      const pictoWords = pictosFromDb.map((pictoItem) =>
        pictoItem.words.map((w) => w),
      );

      if (pictoWords.length === 1) {
        if (pictoWords[0].includes(e.target.value)) {
          setAutoComplete([]);
        }
      } else if (pictoWords.length > 1) {
        pictoWords.push(['aucun picto']);
        setAutoComplete(pictoWords);
      } else {
        setAutoComplete([]);
      }
    }

    function handleFocus() {
      setCurrentFocusIndex(index);
      setIsFocused(true);
    }

    function handleBlur() {
      // keep the focus if an autocomplete is open
      if (autoComplete.length === 0) {
        return;
      }

      // close autocomplete
      setAutoComplete([]);

      setIsFocused(false);
    }
    async function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      switch (e.code) {
        case 'Space':
          console.log('[InputText] Space -> mode:', mode);
          console.log('[InputText] Space -> index', index);
          console.log('[InputText] Space -> value.length', value.length);

          if (mode === 'create' && value.length > 0) {
            // add word to the list
            setWordList([
              ...wordlist,
              {
                word: value.trim(),
                picto,
              },
            ]);

            // reset word and picto
            setValue('');
            setPicto(undefined);
            setPictos([]);
            setAutoComplete([]);

            // set the focus on the next word
            if (index < wordlist.length + 1) {
              setCurrentFocusIndex(index + 1);
            }
          } else if (mode === 'update' && value.length > 0) {
            // update picto list
            const cloneWordList = [...wordlist];
            cloneWordList[index] = {
              word: value.trim(),
              picto,
            };
            setWordList(cloneWordList);

            // set the focus on the next word
            if (index < wordlist.length) {
              setCurrentFocusIndex(index + 1);
            }
          }

          break;

        case 'Backspace':
          console.log('[InputText] Backspace -> mode:', mode);
          console.log('[InputText] Backspace -> index', index);
          console.log('[InputText] Backspace -> value', value);
          console.log('[InputText] Backspace -> value.length', value.length);
          console.log(
            '[InputText] Backspace -> wordList.length',
            wordlist.length,
          );
          console.log(
            '[InputText] Backspace -> backspaceCounter',
            backspaceCounter,
          );

          if (mode === 'create' && index > 0 && value.length === 0) {
            // set the focus on the previous word
            setBackspaceCounter((prev) => prev + 1);

            if (backspaceCounter === 1) {
              setBackspaceCounter(0);
              if (index > 0) {
                setCurrentFocusIndex(index - 1);
              }
            }
          } else if (
            mode === 'update' &&
            value.length === 0 /* && index >= 0 */
          ) {
            // delete the word only when the baskspace is pressed the second time
            setBackspaceCounter((prev) => prev + 1);

            if (backspaceCounter === 1) {
              // update picto list
              const cloneWordList = [...wordlist];
              cloneWordList.splice(index, 1);
              setWordList(cloneWordList);
              // reset
              setBackspaceCounter(0);
              // set the focus on the previous word
              if (index > 0) {
                setCurrentFocusIndex(index - 1);
              }
            }
          } else if (
            mode === 'update' &&
            value.length > 0 /* && index >= 0 */
          ) {
            // update picto list
            const cloneWordList = [...wordlist];
            cloneWordList[index] = {
              word: value.trim(),
              picto,
            };
            setWordList(cloneWordList);
          }

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
      }
    }

    async function handleAutocomplete(wordAutoComplete: string) {
      const pictosFromDb = await getPictosStartWith(wordAutoComplete);
      if (pictosFromDb.length > 0) {
        setPicto(pictosFromDb[0]);
      } else {
        setPicto(undefined);
      }
      setValue(wordAutoComplete);
      setAutoComplete([]);
    }

    const Picto =
      typeof picto !== 'undefined' ? (
        <ImageContainer
          src={picto.image}
          mimetype={picto.mimetype}
          alt={picto.filename}
          options={{ ringHover: true }}
        />
      ) : (
        <ImageContainer
          src=""
          mimetype="image/png"
          alt=""
          emptyState
          options={{ ringHover: true }}
        />
      );

    return (
      <div className="flex flex-col justify-center items-center m-1 p-1 bg-white">
        {Picto}
        <div className="relative">
          <label htmlFor={`inputText${index}`}>
            <input
              id={`inputText${index}`}
              type="text"
              className={twMerge(
                'w-32 h-8 mt-4 text-md text-center rounded outline-none focus:ring-2 hover:ring-2',
                options?.customStyles,
              )}
              style={{
                width: inputTextWidth,
              }}
              value={value}
              ref={inputRef}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e)
              }
              onBlur={() => handleBlur()}
              onFocus={() => handleFocus()}
            />
          </label>
          <AutoComplete
            words={autoComplete}
            onClickWord={(w) => handleAutocomplete(w)}
            wordIndexSelected={pictoIndex}
          />
        </div>
      </div>
    );
  },
);

InputText.defaultProps = {
  wordInput: {
    word: '',
    picto: undefined,
    /* inputRef: createRef<HTMLInputElement>(), */
  },
  options: {
    width: '',
    customStyles:
      'dark:bg-white dark:text-black dark:focus:ring-amber-500 dark:focus:bg-amber-100 dark:hover:ring-sky-300',
  },
};

export default InputText;
