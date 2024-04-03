import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { v4 } from 'uuid';
import { UploadFileTransportType } from '../../../types';
import {
  UploadFormContext,
  UploadFormContextType,
} from '../../contexts/UploadFormProvider';
import useHasErrors from '../../hooks/useHasErrors';
import useIsDirty from '../../hooks/useIsDirty';
import { IPicto, pictoDb } from '../../models/Picto';
import { wordFromFileName } from '../../util';
import UploadForm from './UploadForm';
import {
  base64StrAtom,
  errorAtom,
  fileIsLoadedAtom,
  fileIsNewAtom,
  fileNameAtom,
  mimeTypeAtom,
  pictoIdAtom,
  pictoWasCreatedAtom,
  pictoWasUpdatedAtom,
  uint8arrayAtom,
} from './UploadFormState';
import { IWord } from './words/WordModel';
import {
  InitialWordsAtom,
  WordInputErrorState,
  WordItemErrorState,
  WordListErrorState,
  WordsAtom,
} from './words/WordsState';

interface IValues {
  file: any;
}
export default function UploadFormContainer() {
  const { ipcRenderer } = window as any;
  const [title, setTitle] = useState('Ajouter un pictogramme');
  const [fileName, setFileName] = useRecoilState(fileNameAtom);
  const [mimeType, setMimeType] = useRecoilState(mimeTypeAtom);
  const [base64str, setBase64str] = useRecoilState(base64StrAtom);
  const [fileIsLoaded, setFileIsLoaded] = useRecoilState(fileIsLoadedAtom);
  const [fileIsNew, setFileIsNew] = useRecoilState(fileIsNewAtom);
  const [pictoIsCreated, setPictoIsCreated] =
    useRecoilState(pictoWasCreatedAtom);
  const [pictoIsUpdated, setPictoIsUpdated] =
    useRecoilState(pictoWasUpdatedAtom);
  const [uint8array, setUint8array] = useRecoilState(uint8arrayAtom);

  const [pictoId, setPictoId] = useRecoilState(pictoIdAtom);
  const [error, setError] = useRecoilState(errorAtom);
  const [wordListError] = useRecoilState(WordListErrorState);
  const [wordItemError] = useRecoilState(WordItemErrorState);
  const [, setWordInputError] = useRecoilState(WordInputErrorState);
  const initialValues: IValues = { file: null };
  const [words, setWords] = useRecoilState(WordsAtom);
  const [initialWords, setInitialWords] = useRecoilState(InitialWordsAtom);
  const isDirty = useIsDirty(words, initialWords);
  const hasWordErrors = useHasErrors([[wordListError], [wordItemError]]);
  const { setCanEdit } = useContext(UploadFormContext) as UploadFormContextType;
  /* const [crop, setCrop] = useState<Crop>(); */
  const navigate = useNavigate();

  const params = useParams();
  const id = parseInt(params.pictoId || '0', 10);

  const handleResetForm = (): void => {
    setTitle('Ajouter un pictogramme');
    setFileName('');
    setMimeType('image/png');
    setUint8array(new Uint8Array());

    setBase64str('');

    setPictoId('');
    setPictoIsCreated(false);
    setPictoIsUpdated(false);
    setError('');

    setWords([]);
    setInitialWords([]);
    setWordInputError('');

    setFileIsLoaded(false);
    setFileIsNew(false);
    setCanEdit(true);
    navigate('/pictos');
  };

  const handleAddPicto = async (): Promise<void> => {
    if (hasWordErrors) return;

    const cloneWords = [...words];
    const cleanWords = cloneWords.map((newWord: IWord) => {
      return newWord.value.trim();
    });

    const pictos = await pictoDb.pictos
      .where('image')
      .equals(uint8array)
      .toArray();

    const pictoExists = pictos.length > 0;

    try {
      if (!pictoExists) {
        await pictoDb.pictos.add({
          filename: fileName,
          image: uint8array,
          mimetype: mimeType,
          words: cleanWords,
        });
        setPictoIsCreated(true);

        setCanEdit(false);

        setTimeout(() => {
          handleResetForm();
          navigate('/pictos');
        }, 1000);
      }
    } catch (e) {
      throw new Error(`Failed to add ${'test'}: ${e}`);
    }
  };

  const handleRemovePicto = async (): Promise<void> => {
    try {
      await pictoDb.pictos.where('id').equals(id).delete();
      setTimeout(() => {
        handleResetForm();
        navigate('/pictos');
      }, 1000);
    } catch (e) {
      throw new Error(`Failed to add ${'test'}: ${e}`);
    }
  };

  const handleUpdatePicto = async (): Promise<void> => {
    if (!pictoId) return;

    const cloneWords = [...words];
    const cleanWords = cloneWords.map((newWord: IWord) => {
      return newWord.value.trim();
    });

    try {
      await pictoDb.pictos.update(pictoId, {
        words: cleanWords,
      });
      setPictoIsUpdated(true);
      setTimeout(() => {
        handleResetForm();
        navigate('/pictos');
      }, 1000);
    } catch (e) {
      throw new Error(`Failed to add ${'test'}: ${e}`);
    }
  };

  const handleSubmitForm = (values: IValues) => {
    ipcRenderer.send('picto:upload:start', {
      path: values.file[0].path,
      type: values.file[0].type,
    });
  };

  useEffect(() => {
    const getPictoFromDb = async (): Promise<IPicto | undefined> => {
      return pictoDb.pictos.get(id);
    };

    getPictoFromDb()
      .then((pictoFromDb: IPicto | undefined) => {
        if (pictoFromDb) {
          // setPictoFromDb(res);

          setTitle('Modifier le pictogramme');
          setFileIsNew(false);
          if (pictoId !== pictoFromDb.id) {
            const wordsWithIds = pictoFromDb.words.map((word: string) => {
              return { id: v4(), value: word };
            });
            setInitialWords(wordsWithIds);
            setWords(wordsWithIds);
          } else if (
            words.length > 0 &&
            words.length !== pictoFromDb.words.length
          ) {
            setWords(words);
          }

          if (pictoFromDb.id) {
            setPictoId(pictoFromDb.id);
          }

          const blob = new Blob([pictoFromDb.image.buffer], {
            type: pictoFromDb.mimetype,
          });

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64data = reader.result;
            if (base64data) {
              setFileName(pictoFromDb.filename);
              setMimeType(pictoFromDb.mimetype);
              setBase64str(base64data.toString());
              setPictoIsCreated(false);
              setFileIsLoaded(true);
              setFileIsNew(false);
              setUint8array(pictoFromDb.image);
            }
          };

          return () => {
            reader.abort();
          };
        }
        return pictoFromDb;
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });

    ipcRenderer.on(
      'picto:upload:complete',
      async (event: any, data: UploadFileTransportType) => {
        const pictos = await pictoDb.pictos
          .where('image')
          .equals(data.uint8array.buffer)
          .toArray();

        if (pictos.length > 0 && typeof pictos[0].id !== 'undefined') {
          setTitle('Modifier le pictogramme');
          setFileIsNew(false);

          setError(
            'Ce pictogramme existe déjà dans la pictothèque, vous pouvez le modifier.',
          );

          setPictoId(pictos[0].id);

          const wordsWithIds = pictos[0].words.map((word: string) => {
            return { id: v4(), value: word };
          });

          setInitialWords(wordsWithIds);
          setWords(wordsWithIds);
        } else {
          setTitle('Ajouter un pictogramme');
          setFileIsNew(true);

          const generatedWords = wordFromFileName(data.filename);
          const wordsWithIds = generatedWords.map((word: string) => {
            return { id: v4(), value: word };
          });
          setInitialWords(wordsWithIds);
          setWords(wordsWithIds);
        }

        const blob = new Blob([data.uint8array.buffer], {
          type: data.mimetype,
        });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result;
          if (base64data) {
            setTitle(title);

            setFileName(data.filename);
            setMimeType(data.mimetype);
            setBase64str(base64data.toString());
            setFileIsLoaded(true);
            setUint8array(data.uint8array);
          }
        };
      },
    );

    return () => {
      ipcRenderer.off('picto:upload:complete');
    };
  }, [
    ipcRenderer,
    id,
    pictoId,
    title,
    words,
    setTitle,
    setBase64str,
    setError,
    setFileIsLoaded,
    setFileName,
    setFileIsNew,
    setInitialWords,
    setMimeType,
    setPictoId,
    setPictoIsCreated,
    setUint8array,

    setWords,
  ]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        /* auto submit on input file change event */
      }}
    >
      {({ setFieldValue }) => (
        <UploadForm
          title={title}
          filename={fileName}
          base64str={base64str}
          mimeType={mimeType}
          fileIsNew={fileIsNew}
          fileIsLoaded={fileIsLoaded}
          pictoIsCreated={pictoIsCreated}
          pictoIsUpdated={pictoIsUpdated}
          setFieldValue={setFieldValue}
          handleSubmitForm={handleSubmitForm}
          handleResetForm={handleResetForm}
          handleAddPicto={handleAddPicto}
          handleRemovePicto={handleRemovePicto}
          handleUpdatePicto={handleUpdatePicto}
          isDirty={isDirty}
          hasErrors={hasWordErrors}
          error={error}
          /* crop={crop}
          setCrop={setCrop} */
        />
      )}
    </Formik>
  );
}
