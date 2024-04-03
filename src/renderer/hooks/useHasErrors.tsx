export default function useHasErrors(
  errors: (string | { index: number; error: string })[][],
) {
  let errorsCounter: number = 0;
  errors.forEach((items) => {
    items.forEach((item) => {
      if (typeof item === 'string') {
        if (item !== '') {
          errorsCounter += items.length;
        }
      } else if (typeof item === 'object') {
        if (item.error !== '') errorsCounter += items.length;
      }
    });
  });
  return errorsCounter > 0;
}
