import { twMerge } from 'tailwind-merge';

export default function PictoListEmptyState() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div
          className={twMerge(
            'grid grid-cols-1',
            'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            'gap-4 p-2',
          )}
        >
          {Array.from(Array(12).keys()).map((i) => {
            return (
              <div
                key={i}
                className="flex flex-col justify-evenly items-center dark:bg-neutral-500 rounded w-64 h-64 ease-linear duration-[0.1s] animate-pulse"
              >
                <div className="w-52 h-4 bg-neutral-400">&nbsp;</div>
                <div className="w-32 h-32 bg-neutral-400 rounded" />
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                  {Array.from(Array(4).keys()).map((j) => {
                    return (
                      <div
                        key={j}
                        className="w-16 p-1 text-xs bg-neutral-400 text-neutral-100 rounded-full text-center"
                      >
                        &nbsp;
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
