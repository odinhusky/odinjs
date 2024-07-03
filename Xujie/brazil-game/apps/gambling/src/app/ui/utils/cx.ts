import { twMerge } from "tailwind-merge";
import clsx from 'clsx';

declare namespace clsxType {
	type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
	type ClassDictionary = Record<string, any>;
	type ClassArray = ClassValue[];
	function clsx(...inputs: ClassValue[]): string;
}

export const cx = (...inputs: clsxType.ClassValue[]): string => twMerge(clsx(inputs));

export default cx;