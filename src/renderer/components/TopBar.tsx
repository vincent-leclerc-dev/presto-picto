import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export default function TopBar() {
  const { pathname } = useLocation();

  return (
    <div
      id="topbar"
      className="fixed top-0 left-0 z-10 flex flex-row justify-start items-center h-[42px] w-full dark:bg-[#121212]"
    >
      <div className="ml-4 text-neutral-300 whitespace-nowrap">
        Presto Picto
      </div>
      <Link
        to="/"
        className={twMerge(
          'flex flex-row items-center justify-center text-center focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500 py-1 px-2 hover:dark:bg-neutral-800 dark:active:text-sky-300',
          pathname === '/'
            ? 'menuItem text-sky-500'
            : 'menuItem text-neutral-300',
        )}
      >
        <i className="fa-solid fa-file-lines" />
        <div className="ml-2 whitespace-nowrap hidden md:block">Editeur</div>
      </Link>
      <Link
        to="/picto"
        className={twMerge(
          'flex flex-row items-center justify-center text-center focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500 py-1 px-2 hover:dark:bg-neutral-800 dark:active:text-sky-300',
          pathname === '/picto'
            ? 'menuItem text-sky-500'
            : 'menuItem text-neutral-300',
        )}
      >
        <i className="fa-solid fa-circle-plus" />
        <div className="ml-2 whitespace-nowrap hidden md:block">
          Ajouter un picto
        </div>
      </Link>
      <Link
        to="/pictos"
        className={twMerge(
          'flex flex-row items-center justify-center text-center focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500 py-1 px-2 hover:dark:bg-neutral-800 dark:active:text-sky-300',
          pathname === '/pictos'
            ? 'menuItem text-sky-500'
            : 'menuItem text-neutral-300',
        )}
      >
        <i className="fa-solid fa-grip" />
        <div className="ml-2 whitespace-nowrap hidden md:block">Mes pictos</div>
      </Link>
      <Link
        to="/import"
        className={twMerge(
          'flex flex-row items-center justify-center text-center focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500  py-1 px-2 hover:dark:bg-neutral-800 dark:active:text-sky-300',
          pathname === '/import'
            ? 'menuItem text-sky-500'
            : 'menuItem text-neutral-300',
        )}
      >
        <i className="fa-solid fa-download" />
        <div className="ml-2 whitespace-nowrap hidden md:block">Import</div>
      </Link>
    </div>
  );
}
