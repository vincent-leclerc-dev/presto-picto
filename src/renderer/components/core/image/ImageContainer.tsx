import { useEffect, useState } from 'react';
import { MimeTypes } from '../../../../types';
import Image from './Image';

interface IImageContainerProps {
  src: string | Uint8Array;
  mimetype: MimeTypes;
  alt: string;
  emptyState?: boolean;
  options?: {
    ring?: boolean;
    ringHover?: boolean;
    rounded?: boolean;
  };
}

function ImageContainer({
  src,
  mimetype,
  alt,
  emptyState = ImageContainer.defaultProps.emptyState,
  options,
}: IImageContainerProps) {
  const [stringSrc, setStringSrc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof src === 'object') {
      // uint8array is empty
      if (src.length === 0) {
        setError('Image non trouvée');
        return;
      }

      // Convert uint8array to base64 string with file API
      const blob = new Blob([src], {
        type: mimetype,
      });

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        if (reader.result) {
          setStringSrc(reader.result.toString());
        }
      };
      reader.onerror = () => {
        setError("Erreur de lecture de l'image");
      };

      return;
    }

    // default case
    setStringSrc(src);
  }, [src, mimetype]);

  return (
    <Image
      stringSrc={stringSrc}
      alt={alt}
      emptyState={emptyState}
      error={error}
      options={options}
    />
  );
}

ImageContainer.defaultProps = {
  emptyState: false,
  options: {
    ring: false,
    ringHover: false,
    rounded: false,
  },
};

export default ImageContainer;
