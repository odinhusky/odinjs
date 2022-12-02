
/**
 * @author odin
 * @param {string || number} value -- will be tested value(s)
 * @param { object } t -- react-i18n function to transfer the correspond to langs
 * @description Validation Functions
 * @return {string} -- '' || error message
*/
const rules =  {
  emailFormat: (email, t) => {
    const emailValidation = RegExp(
      /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
      'g'
    );
    return emailValidation.test(email) ? '' : t('emailInValid');
  },
  mustBeNumber: (value, t) => {
    return isNaN(value) ? t('mustInputNumber') : '';
  },
  required: (value, t) => (value ? '' : t('fieldRequired')),
  passwordFormat: (password, t) => {
    const passwordValidation = RegExp(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/,
      'g'
    );
    return passwordValidation.test(password)
      ? ''
      : t('passwordInvalid');
  },
  confirmPwd(password, confirmPassword, t) {
    return password === confirmPassword ? '' : t('confirmPasswordInvalid')
  }
}

export default rules;