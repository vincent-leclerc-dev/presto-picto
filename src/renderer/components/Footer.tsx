// import styles from './index.module.scss';

import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export default function Footer() {
  const { ipcRenderer } = window as any;
  const { pathname } = useLocation();

  const toogleDevTools = () => ipcRenderer.send('toogle-dev-tools');

  return (
    <div
      id="footer"
      className="fixed bottom-0 left-0 w-full h-[42px] flex flex-row justify-between items-center dark:bg-[#121212] dark:text-neutral-300"
    >
      <Link
        to="/parameters"
        className={twMerge(
          pathname === '/parameters'
            ? 'menuItem text-sky-500'
            : 'menuItem text-neutral-300',
          'focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500',
        )}
      >
        <div
          title="Paramètres"
          className="flex flex-row items-center justify-center text-center outline-none py-1 px-2 rounded hover:dark:bg-neutral-800 dark:active:text-sky-300"
        >
          <i className="fa-solid fa-gear" />
          <div className="ml-2 hidden md:block">Paramètres</div>
        </div>
      </Link>
      <Link to="/tests" className="hidden">
        Tests
      </Link>
      <button
        className="flex flex-row items-center justify-center text-center mr-2 dark:active:text-sky-300 rounded focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500"
        type="button"
        onClick={toogleDevTools}
      >
        <div
          title="Afficher les outils de développement"
          className="flex flex-row items-center justify-center text-center outline-none hover:dark:bg-neutral-800 py-1 px-2 rounded"
        >
          <i className="fa-brands fa-dev" />
          <div className="ml-2 hidden whitespace-nowrap md:block ">
            Outils de dévelopments
          </div>
        </div>
      </button>
    </div>
  );
}
