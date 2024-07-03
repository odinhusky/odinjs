import t from "apps/gambling/src/assets/constant/lang";

export const onValidatePhoneInput = (data: string, setPhoneInput: any) => {

  const valid = data.length === 10 || data.length === 11;
  if (valid) {
    setPhoneInput({
      data,
      isValidation: true,
      errorMessage: "",
    });
  } else {
    setPhoneInput({
      data,
      isValidation: false,
      errorMessage: t['phoneNumberError']
    })
  }

  if (data) {
    return true
  } else {
    return false;
  }
}

export default onValidatePhoneInput;