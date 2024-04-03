import { twMerge } from 'tailwind-merge';
import { colors, Colors } from '../../../ui';
import { sizes, Sizes } from '../../../ux';

interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  handleCurrentPage: (page: number) => void;
  handleRecordsPerPage: (recordsPerPage: number) => void;
  recordsPerPageRange: number[];
  recordsPerPage: number;
  size?: Sizes;
  color?: Colors;
}

function Pagination({
  totalPages,
  currentPage,
  handleCurrentPage,
  handleRecordsPerPage,
  recordsPerPageRange,
  recordsPerPage,
  size = Pagination.defaultProps.size,
  color = Pagination.defaultProps.color, // TODO use theme provider
}: IPaginationProps) {
  const btnClasses = twMerge(
    'flex-row justify-evenly items-center',
    `${sizes[size].px} ${sizes[size].hContainer} `,
    `${colors[color].bgSecondary} ${colors[color].textSecondary}`,
    'select-none rounded',
    'focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500',
  );

  const firstPageButton = (
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => handleCurrentPage(1)}
      className={twMerge(
        'hidden lg:flex',
        btnClasses,
        sizes[size].ml,
        currentPage === 1 ? colors.disabled : colors.hover,
      )}
    >
      Première page
    </button>
  );

  const previousButton = (
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => handleCurrentPage(currentPage - 1)}
      className={twMerge(
        btnClasses,
        sizes[size].ml,
        sizes[size].wContainer,
        currentPage === 1 ? colors.disabled : colors.hover,
      )}
    >
      <i className="fa-solid fa-arrow-left-long" />
    </button>
  );

  const nextButton = (
    <button
      type="button"
      disabled={currentPage === totalPages}
      onClick={() => handleCurrentPage(currentPage + 1)}
      className={twMerge(
        btnClasses,
        sizes[size].mr,
        sizes[size].wContainer,
        currentPage === totalPages ? colors.disabled : colors.hover,
      )}
    >
      <i className="fa-solid fa-arrow-right-long" />
    </button>
  );

  const lastPageButton = (
    <button
      type="button"
      disabled={currentPage === totalPages}
      onClick={() => handleCurrentPage(totalPages)}
      className={twMerge(
        'hidden lg:flex',
        btnClasses,
        sizes[size].mr,
        currentPage === totalPages ? colors.disabled : colors.hover,
      )}
    >
      Dernière page
    </button>
  );

  const pages = (
    <div
      className={`flex flex-row justify-center items-center select-none rounded
      ${sizes[size].ml} ${sizes[size].px} ${sizes[size].hContainer}
      ${colors[color].bgSecondary} ${colors[color].textSecondary}`}
    >
      <div className={`hidden md:block ${sizes[size].mr}`}>Page</div>
      <div>
        {currentPage}/{totalPages}
      </div>
    </div>
  );

  const perPage = (
    <div
      className={`flex flex-row justify-center items-center rounded
    ${sizes[size].px} ${sizes[size].mx} ${sizes[size].hContainer}
    ${colors[color].bgSecondary} ${colors[color].textSecondary}
    `}
    >
      <div className={`hidden md:block ${sizes[size].mr} cursor-default`}>
        Par page
      </div>
      <select
        id="recordsPerPage"
        value={recordsPerPage}
        onChange={(e) => handleRecordsPerPage(parseInt(e.target.value, 10))}
        className={`${sizes[size].px} ${sizes[size].hElement}
        text-center rounded cursor-pointer outline-none
        focus:outline focus:outline-offset-0 focus:outline-1 dark:focus:outline-sky-500
        ${colors[color].bgBlack} ${colors[color].textSecondary}`}
      >
        {recordsPerPageRange.map((value: number) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    totalPages > 0 && (
      <div
        className={`flex flex-row justify-center items-center
        ${sizes[size].hContainer} ${sizes[size].my}
        `}
      >
        {firstPageButton}
        {previousButton}
        {pages}
        {perPage}
        {nextButton}
        {lastPageButton}
      </div>
    )
  );
}

Pagination.defaultProps = {
  size: Sizes.MD,
  color: Colors.SKY,
};

export default Pagination;
