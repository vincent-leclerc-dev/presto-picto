import {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
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
import { WordListAtom } from '../page/PageState';
import InputText from './InputText';

export interface IPrestoPictoHandle {
  prestoPicto: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}
export interface IProps {
  wordInput: string;
  pictoInput: IPicto | undefined;
  children: ReactNode;
}

const Container = forwardRef<IPrestoPictoHandle, IProps>(
  ({ wordInput, pictoInput, children }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [word, setWord] = useState(wordInput);
    const [pictos, setPictos] = useState<IPicto[]>([]);
    const [pictoIndex, setPictoIndex] = useState(0);
    const [picto, setPicto] = useState<IPicto | undefined>(pictoInput);
    const [wordlist, setWordList] = useRecoilState<WordType[]>(WordListAtom);

    useEffect(() => {
      setPicto(pictos[pictoIndex]);
    }, [setPicto, pictos, pictoIndex]);

    useImperativeHandle(
      ref, // forwarded ref
      () => ({
        onKeyDown: (e: KeyboardEvent) => {
          if (e.code === 'F1') {
            console.log('F1');
            console.log('pictos', pictos);
            console.log('pictoIdx', pictoIndex);
            // use < instead of <= to allow an undefined value (empty picto case)
            if (pictoIndex < pictos.length) {
              setPictoIndex((prev) => prev + 1);
            } else {
              // reset to first picto of list
              setPictoIndex(0);
            }
          } else if (e.code === 'Enter') {
            console.log(`Enter`);

            console.log('word', word);
            if (word && picto) {
              setWordList([...wordlist, { word, picto }]);
              setPicto({
                filename: '',
                image: new Uint8Array(),
                mimetype: 'image/png',
                words: [],
              });
              setWord('');
            }
          }
        },
        onChange: async (e: ChangeEvent<HTMLInputElement>) => {
          console.log('onChange *****************', e.target.value);
          setWord(e.target.value);
          const pictosFromDb = await pictoDb.pictos
            .filter((pictoItem) => {
              const words =
                pictoItem.words.find((wordItem) =>
                  wordItem.startsWith(e.target.value.trim()),
                ) || [];

              return words?.length > 0;
            })
            .toArray();

          console.log('pictosFromDb ²²²²²²²²²²²²²²', pictosFromDb);
          setPictos(pictosFromDb);
          setPictoIndex(0);
          setPicto(pictosFromDb[0]);
        },
        prestoPicto: () => {
          console.log('presto picto');
        },
        focus: () => {
          divRef.current!.focus();
        },
        scrollIntoView: () => {
          divRef.current!.scrollIntoView();
        },
      }),
      [pictoIndex, pictos, picto, word, setWordList, wordlist],
    ); // the forwarded ref value

    const img =
      typeof picto?.image === 'undefined' ? (
        <ImageContainer
          src=""
          mimetype="image/png"
          alt=""
          emptyState
          options={{ ringHover: true }}
        />
      ) : (
        <ImageContainer
          src={picto.image}
          mimetype={picto.mimetype}
          alt={picto.filename}
          options={{ ringHover: true }}
        />
      );

    return (
      <div ref={divRef}>
        {img}
        {children}
      </div>
    );
  },
);

interface IWordProps {
  wordInput: string;
  pictoInput: IPicto | undefined;
}

function Word({ wordInput, pictoInput }: IWordProps) {
  const elRef = useRef<IPrestoPictoHandle>(null); // assign null makes it compatible with elements.

  console.log('--- wordInput', wordInput);
  console.log('--- pictoInput', pictoInput);

  // const [word, setWord] = useState(wordInput);

  const handleSelectRef = () => {
    elRef.current!.prestoPicto();
  };

  const handleChangeRef = (e: ChangeEvent<HTMLInputElement>) => {
    elRef.current!.onChange(e);
  };

  const handleKeyDownRef = (e: KeyboardEvent<HTMLInputElement>) => {
    elRef.current!.onKeyDown(e);
  };

  useEffect(() => {
    console.log('useEffect');
    if (wordInput) {
      // console.log('setWord', wordInput);
      // setWord(wordInput);
    }
    if (pictoInput) {
      // console.log('setPicto', pictoInput);
      // setPicto(pictoInput);
    }
    /*
    console.log('pictoIndex ue', pictoIndex);
    console.log('pictos', pictos);
    console.log('pictoIndex after', pictoIndex);
    console.log('picto', pictos[pictoIndex]);
    */
    // setPicto(pictos[pictoIndex]);
  }, [wordInput, pictoInput]);

  return (
    <Container ref={elRef} pictoInput={pictoInput} wordInput={wordInput}>
      <div
        className={twMerge(
          'flex flex-col justify-center items-center',
          'bg-white',
          'm-1 p-1',
        )}
      >
        <InputText wordInput={word.word} pictoInput={pictoInput} />
      </div>
    </Container>
  );
}

export default Word;
