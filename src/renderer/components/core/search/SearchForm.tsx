import { Colors, colors } from '../../../ui';

interface ISearchFormProps {
  handleOnChange: (term: string) => void;
  searchTerm: string;
  searchIsLoading: boolean;
  color?: Colors;
}

function SearchForm({
  handleOnChange,
  searchTerm,
  searchIsLoading,
  color = SearchForm.defaultProps.color,
}: ISearchFormProps) {
  return (
    <form className="my-2 w-[320px] md:w-[600px] flex flex-row justify-center items-center rounded search">
      <div className="flex flex-col w-full h-auto">
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center pl-4 pointer-events-none">
            <i className="fas fa-magnifying-glass w-4 h-4 inset-y-0 start-0 flex items-center pointer-events-none dark:text-neutral-300" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleOnChange(e.target.value)}
            placeholder="Recherche"
            className={`h-10 w-full p-3 pl-10 text-center dark:placeholder-neutral-500 dark:text-neutral-300 border-none focus:outline focus:outline-offset-0 focus:outline-2 dark:focus:outline-sky-500 ${colors[color].bgSecondary} cursor-text rounded`}
          />
          {searchIsLoading && (
            <div className="absolute inset-y-0 end-0 flex items-center pr-4 pointer-events-none">
              <i
                className={`fa-solid fa-circle-notch animate-spin h-4 w-4 ${colors[color].textSecondary}`}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

SearchForm.defaultProps = {
  color: Colors.SKY,
};

export default SearchForm;
