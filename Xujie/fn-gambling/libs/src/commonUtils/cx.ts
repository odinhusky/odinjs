import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const cx = (...inputs: clsx.ClassValue[]): string =>
  twMerge(clsx(inputs));

export default cx;
