import { JSX, useContext, useState } from 'react';
import { ConfigType } from '../../config';
import { ConfigContext } from '../../contexts/ConfigProvider';

interface CardProps {
  children: JSX.Element;
  title?: string;
  footer?: JSX.Element | null;
}

function Card({ title, children, footer }: CardProps) {
  const config = useContext(ConfigContext) as ConfigType;
  const [headerPosition] = useState(config?.header.position);
  const [footerPosition] = useState(config?.footer.position);

  return (
    <div
      className="
        flex flex-col
        border-solid border-gray-800 w-full h-full md:w-[624px] md:h-[624px]"
    >
      <div
        className={`
          flex flex-row justify-center items-center w-full h-12 md:rounded-t-lg select-none
          dark:bg-sky-500 dark:text-blue-50 text-xl font-bold ${headerPosition}`}
      >
        {title}
      </div>
      <div
        className="flex-1 flex-col justify-center items-center
          h-[528px] w-full dark:bg-white"
      >
        {children}
      </div>
      <div
        className={`flex flex-row justify-center items-center w-full h-12
          md:rounded-b-lg dark:bg-gray-400 ${footerPosition}`}
      >
        {footer}
      </div>
    </div>
  );
}

Card.defaultProps = {
  title: '',
  footer: null,
};

export default Card;
