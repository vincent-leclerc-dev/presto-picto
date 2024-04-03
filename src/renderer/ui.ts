export enum Colors {
  SKY = 'sky',
  EMERALD = 'emerald',
  AMBER = 'amber',
}

// ! Tailwind classes must be written without variables due to the regex parser
export const colors = {
  disabled: 'dark:text-neutral-700',
  hover: 'dark:hover:bg-neutral-700',
  error: 'dark:bg-rose-100 dark:text-rose-500 dark:border-rose-500',
  warning: 'dark:bg-amber-100 dark:text-amber-500 dark:border-amber-500',
  success: 'dark:bg-green-100 dark:text-green-500 dark:border-green-500',
  [Colors.SKY]: {
    bgBlack: 'dark:bg-neutral-900',
    bgPrimary: 'dark:bg-sky-500',
    bgPrimaryLight: 'dark:bg-sky-200',
    textPrimary: `dark:text-sky-100`,
    textPrimaryLight: `dark:text-sky-500`,
    bgSecondary: 'dark:bg-neutral-800',
    textSecondary: `dark:text-sky-500`,
    ringPrimary: 'dark:ring-sky-500',
    ringSecondary: 'dark:ring-neutral-950',
  },
  [Colors.EMERALD]: {
    bgBlack: 'dark:bg-neutral-900',
    bgPrimary: 'dark:bg-emerald-500',
    bgPrimaryLight: 'dark:bg-emerald-200',
    textPrimary: `dark:text-emerald-100`,
    textPrimaryLight: `dark:text-emerald-600`,
    bgSecondary: 'dark:bg-neutral-800',
    textSecondary: `dark:text-emerald-500`,
    ringPrimary: 'dark:ring-emerald-500',
    ringSecondary: 'dark:ring-emerald-500',
  },
  [Colors.AMBER]: {
    bgBlack: 'dark:bg-neutral-900',
    bgPrimary: 'dark:bg-amber-500',
    bgPrimaryLight: 'dark:bg-amber-200',
    textPrimary: `dark:text-amber-950`,
    textPrimaryLight: `dark:text-amber-700`,
    bgSecondary: 'dark:bg-neutral-800',
    textSecondary: `dark:text-amber-400`,
    ringPrimary: 'dark:ring-amber-500',
    ringSecondary: 'dark:ring-amber-500',
  },
};
