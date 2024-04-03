import { twMerge } from 'tailwind-merge';

import { Colors, colors } from '../../../ui';
import { Sizes, sizes } from '../../../ux';

interface IImageProps {
  stringSrc: string;
  alt: string;
  emptyState: boolean;
  error: string;
  options?: { ring?: boolean; ringHover?: boolean; rounded?: boolean };
  size?: Sizes;
  color?: Colors;
}

function Image({
  stringSrc,
  alt,
  emptyState,
  error,
  options,
  size = Image.defaultProps.size, // TODO! use futur inspector atom
  color = Image.defaultProps.color, // TODO! use theme provider
}: IImageProps) {
  if (error) {
    return (
      <div
        className={twMerge(
          'flex flex-wrap justify-center items-center text-center',
          `${sizes[size].imgH} ${sizes[size].imgW}`,
          'text-neutral-600',
          'bg-custom',
          options?.ring ? `dark:ring-2 ${colors[color].ringPrimary}` : '',
          options?.rounded ? 'rounded-md' : '',
        )}
      >
        {error}
      </div>
    );
  }

  if (emptyState) {
    return (
      <div
        className={twMerge(
          'flex flex-wrap justify-center items-center text-center',
          `${sizes[size].imgH} w-0`,
          'bg-white',
          options?.ring ? `dark:ring-2 dark:ring-sky-300` : '',
          options?.ringHover ? `dark:hover:ring-2 dark:hover:ring-sky-300` : '',
          options?.rounded ? 'rounded-md' : '',
        )}
      />
    );
  }

  return (
    <img
      className={twMerge(
        'flex flex-wrap justify-center items-center hover:ring-2',
        `${sizes[size].imgH} ${sizes[size].imgW}`,
        'object-cover',
        options?.ring ? `dark:ring-sky-300` : '',
        options?.ringHover ? `dark:hover:ring-sky-300` : '',
        options?.rounded ? 'rounded-lg' : '',
      )}
      alt={alt}
      src={stringSrc}
    />
  );
}

Image.defaultProps = {
  options: {
    ring: false,
    ringHover: false,
    rounded: false,
  },
  size: Sizes.MD,
  color: Colors.SKY,
};

export default Image;
