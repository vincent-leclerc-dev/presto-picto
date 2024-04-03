import React, { useRef } from 'react';
import InputFile from './InputFile';

interface IInputFileContainerProps {
  setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
  handleSubmitFile: ({ file }: { file: FileList | null }) => void;
}

export default function InputFileContainer({
  setFieldValue,
  handleSubmitFile,
}: IInputFileContainerProps) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    hiddenFileInput.current!.click();
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const fileUploaded = event.target as HTMLInputElement;
    if (fileUploaded.files?.length === 0) {
      return;
    }
    if (setFieldValue) {
      setFieldValue('file', fileUploaded.files);
    }
    handleSubmitFile({ file: fileUploaded.files });
  };

  return (
    <InputFile
      hiddenFileInput={hiddenFileInput}
      handleClick={handleClick}
      handleChange={handleChange}
      title="Choisir une image"
    />
  );
}
