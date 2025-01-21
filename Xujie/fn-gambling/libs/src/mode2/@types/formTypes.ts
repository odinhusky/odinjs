export interface FormRef {
  handleSubmit: () => void;
  getFormValue: (field: string) => void;
  setFormValues: (values: any) => void;
  validateFormValue: (field: string) => Error | undefined;
}
