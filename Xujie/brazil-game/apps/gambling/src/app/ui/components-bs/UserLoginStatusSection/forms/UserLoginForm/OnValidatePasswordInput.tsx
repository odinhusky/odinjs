import t from "apps/gambling/src/assets/constant/lang";

export const onValidatePasswordInput = (data: string, setPasswordInput: any) => {

  // const passwordRex = /^[a-zA-Z0-9]+$/;
  const valid = !data.includes(' ') && data.length >= 4 && data.length <= 16;
  if (valid) {
    setPasswordInput({
      data,
      isValidation: true,
      errorMessage: "",
    });
  } else {
    setPasswordInput({
      data,
      isValidation: false,
      errorMessage: t['pwdError'],
    })
  }

  if (valid) {
    return true
  } else {
    return false;
  }
}

export default onValidatePasswordInput;