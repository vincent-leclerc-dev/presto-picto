import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  DarkModeContext,
  DarkModeContextType,
} from '../contexts/DarkModeProvider';

export default function DarkModeToggleButton() {
  const { darkMode, toggleDarkMode } = useContext(
    DarkModeContext,
  ) as DarkModeContextType;

  return (
    <button
      className="text-white ml-2 dark:hover:bg-[#212121] rounded"
      type="button"
      onClick={toggleDarkMode}
    >
      <div
        className={twMerge(
          !darkMode ? 'hidden' : 'flex flex-row justify-center items-center',
          'dark:bg-white',
          'w-8 h-8',
          'rounded',
        )}
      >
        <i className={twMerge('fa-solid', 'fa-sun', 'dark:text-black')} />
      </div>
      <div
        className={twMerge(
          darkMode ? 'hidden' : 'flex flex-row justify-center items-center',
          'dark:bg-black',
          'w-8 h-8',
          'rounded',
        )}
      >
        <i className={twMerge('fa-solid', 'fa-moon', 'dark:text-white')} />
      </div>
    </button>
  );
}
