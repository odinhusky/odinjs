import { defineStore } from "pinia"
import { ref } from "vue"

const defaultPasswordForm = () => ({
  username: "",
  password: ""
})

const defaultSmsForm = () => ({
  countryCode: "",
  phoneNumber: "",
  verifyCode: ""
})

const defaultPhonePasswordForm = () => ({
  countryCode: "",
  phoneNumber: "",
  password: ""
})

export const useLoginStore = defineStore("loginStore", () => {
  const passwordForm = ref(defaultPasswordForm())
  const smsForm = ref(defaultSmsForm())
  const phonePasswordForm = ref(defaultPhonePasswordForm())

  function resetPasswordForm() {
    passwordForm.value = defaultPasswordForm()
  }

  function resetSmsForm() {
    smsForm.value = defaultSmsForm()
  }

  function resetPhonePasswordForm() {
    phonePasswordForm.value = defaultPhonePasswordForm()
  }

  return {
    passwordForm,
    smsForm,
    phonePasswordForm,
    resetPasswordForm,
    resetSmsForm,
    resetPhonePasswordForm
  }
})
