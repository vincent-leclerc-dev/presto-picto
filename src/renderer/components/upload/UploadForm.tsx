import { MimeTypes } from '../../../types';
import Card from '../core/Card';
import ImageContainer from '../core/image/ImageContainer';
import InputFileContainer from '../core/inputFile/InputFileContainer';
import WordFormContainer from './words/WordFormContainer';
import WordListContainer from './words/WordListContainer';

interface UploadFormProps {
  title: string;
  // formik
  setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
  // file
  handleSubmitForm: ({ file }: { file: FileList | null }) => void;
  handleResetForm: () => void;
  isDirty: boolean;
  hasErrors: boolean;
  error: string;
  // picto
  filename: string;
  base64str: string;
  mimeType: MimeTypes;
  fileIsNew: boolean;
  fileIsLoaded: boolean;
  pictoIsCreated: boolean;
  pictoIsUpdated: boolean;
  handleAddPicto: () => void;
  handleRemovePicto: () => void;
  handleUpdatePicto: () => void;
  /*
  crop: Crop | undefined;
  setCrop: (crop: Crop) => void;
  */
}

export default function UploadForm({
  title,
  setFieldValue,
  isDirty,
  hasErrors,
  error,
  filename,
  base64str,
  mimeType,
  fileIsNew,
  fileIsLoaded,
  pictoIsCreated,
  pictoIsUpdated,
  handleSubmitForm,
  handleResetForm,
  handleAddPicto,
  handleRemovePicto,
  handleUpdatePicto /*
  crop,
  setCrop,
  */,
}: UploadFormProps) {
  const picto =
    base64str !== '' ? (
      /* <ReactCrop crop={crop} onChange={(c) => setCrop(c)}> */
      <ImageContainer src={base64str} mimetype={mimeType} alt="Picto" />
    ) : /* </ReactCrop> */
    null;

  const addButton = (
    <button
      type="button"
      onClick={() => {
        handleAddPicto();
      }}
      disabled={hasErrors}
      className={`rounded text-white py-2 px-4 mx-2 ${
        !hasErrors
          ? 'dark:bg-sky-500 dark:hover:bg-sky-400'
          : 'dark:bg-gray-300 dark:text-gray-500 cursor-default'
      }`}
    >
      Ajouter
    </button>
  );

  const updateButton = (
    <button
      type="button"
      onClick={() => {
        handleUpdatePicto();
      }}
      disabled={!isDirty || hasErrors}
      className={` rounded text-white py-2 px-4 mx-2 ${
        isDirty && !hasErrors
          ? 'dark:bg-sky-500 dark:hover:bg-sky-400'
          : 'dark:bg-neutral-300 dark:text-neutral-400 cursor-default'
      }`}
    >
      Modifier
    </button>
  );

  const removeButton = !fileIsNew ? (
    <button
      className="rounded dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-neutral-100 py-2 px-4 mx-2"
      type="button"
      onClick={() => {
        handleRemovePicto();
      }}
    >
      Supprimer
    </button>
  ) : null;

  const actionButton = fileIsNew ? addButton : updateButton;

  const footerActions = !fileIsLoaded ? null : (
    <>
      <button
        className="rounded dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-neutral-600 py-2 px-4 mx-2"
        type="button"
        onClick={() => {
          handleResetForm();
        }}
      >
        Retour
      </button>
      {actionButton}
      {removeButton}
    </>
  );

  const footer =
    pictoIsCreated || pictoIsUpdated ? (
      <div className="dark:bg-green-100 border dark:border-green-500 p-2 m-2 text-center dark:text-green-500 rounded">
        Le picto a bien été {pictoIsCreated ? 'créé' : 'mis à jour'}
      </div>
    ) : (
      footerActions
    );

  return (
    <Card title={title} footer={footer}>
      {!fileIsLoaded ? (
        <InputFileContainer
          setFieldValue={setFieldValue}
          handleSubmitFile={handleSubmitForm}
        />
      ) : (
        <div className="flex flex-col w-full h-full md:h-[528px]">
          <div className="flex flex-row w-full justify-start items-center h-12 dark:bg-white">
            <div className="m-8 dark:text-black">Fichier:</div>
            <div className="m-8 dark:text-gray-500">{filename}</div>
          </div>
          <div className="flex flex-row h-full">
            <div className="flex flex-col justify-around items-center h-[432px] w-1/2 dark:bg-blue-300 overflow-y-auto">
              {error && (
                <div className="text-center p-2 m-2 dark:text-yellow-500 dark:bg-amber-100 border-2 dark:border-yellow-500 rounded">
                  {error}
                </div>
              )}
              {picto}
              <WordFormContainer />
            </div>
            <div className="flex flex-col justify-center items-center h-full w-1/2 dark:bg-blue-200">
              <div className="fixed top-0 flex flex-row h-12 w-full justify-center items-center dark:text-blue-500">
                Mot(s) associé(s):
              </div>
              <div className="h-full w-full">
                <WordListContainer />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
