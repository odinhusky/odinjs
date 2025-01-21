export type ResponseStructure<T> = {
  Code?: number;
  Msg?: string;
  Body?: T;
};
