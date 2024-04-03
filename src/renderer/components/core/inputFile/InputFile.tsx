import React from 'react';
import { ButtonSelectImage, Input } from './InputFileStyles';

interface IInputFileProps {
  hiddenFileInput: React.RefObject<HTMLInputElement>;
  handleClick: () => void;
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
  title?: string;
}

function InputFile({
  hiddenFileInput,
  handleClick,
  handleChange,
  title,
}: IInputFileProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[528px]">
      <ButtonSelectImage
        type="button"
        onClick={handleClick}
        className="flex justify-center items-center border-none rounded dark:bg-sky-500 dark:hover:bg-sky-400 text-blue-50 cursor-pointer text-lg"
      >
        {title}
      </ButtonSelectImage>
      <Input
        type="file"
        name="file"
        ref={hiddenFileInput}
        onChange={handleChange}
      />
    </div>
  );
}

export default InputFile;

InputFile.defaultProps = {
  title: 'Sélectionner un fichier',
};
