import { UserLoginStatusSection } from "../../../../components-bs/UserLoginStatusSection"
import { Container } from "../u2/Container"
import { IUserLoginStatusModal } from "../../types"
import { environment } from "../../../../../../environments/environment"
import Icon from "../../../../components-bs/Icon"
import Form from "../../../../components/Form"
import Input from "../../../../components/Input"
import "./index.scss"
import { useState } from "react"
export const UserLoginStatusModal = (props: IUserLoginStatusModal) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  return (
    <div
      className={
        "z-[1100] bg-[rgba(0,0,0,.6)] viewport-fixed left-0 top-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full px-4"
      }
    >
      <div className="bg-popup rounded-lg w-full px-4 pt-2.5 pb-5">
        <div className="relative">
          <Icon
            name="x"
            color="var(--grayscale-70)"
            className="absolute right-0 top-0 cursor-pointer"
            size="12"
            onClick={props.close}
          />

          <Form className="user-login-status-form">
            <div className="flex items-center justify-center gap-2 -mt-2.5 mb-5 w-[137px] h-10 border-b-2 border-[var(--tertiary-main)]">
              <Icon name="user" color="var(--tertiary-main)" size="12" />
              <span className="text-[var(--tertiary-main)] text-xs font-bold">
                Entrar
              </span>
            </div>
            <Form.Item
              name="phone"
              validate={(value, values) => {
                console.log(value, values)
                return undefined
              }}
            >
              <Input
                placeholder="Nome de usuário"
                prefix={
                  <div className="flex items-center gap-2">
                    <Icon name="user" color="var(--grayscale-80)" size="12" />
                    <span className="text-[var(--state-error-main)]">*</span>
                  </div>
                }
                closeIcon={
                  <Icon name="x_circle" color="var(--grayscale-80)" size="12" />
                }
              />
            </Form.Item>
            <Form.Item
              name="password"
              validate={(value, values) => {
                console.log(value, values)
                return undefined
              }}
            >
              <Input
                placeholder="Nome de usuário"
                prefix={
                  <div className="flex items-center gap-2">
                    <Icon name="lock" color="var(--grayscale-80)" size="12" />
                    <span className="text-[var(--state-error-main)]">*</span>
                  </div>
                }
                suffix={
                  <Icon
                    className="cursor-pointer"
                    name={passwordVisible ? "eyes_open" : "eyes_closed"}
                    color="var(--grayscale-80)"
                    size="12"
                  />
                }
                closeIcon={
                  <Icon name="x_circle" color="var(--grayscale-80)" size="12" />
                }
              />
            </Form.Item>
            <div className="flex items-center gap-1 mt-5 w-full">
              <Icon name="uncheckbox" />
              <span className="text-[var(--transparent-100)] text-xs font-medium">
                Lembrar Senha
              </span>
            </div>
            <button
              type="submit"
              className="text-[var(--background-popup)] text-sm font-bold tertiary-button rounded-lg w-full h-9 flex items-center justify-center mt-3"
            >
              Entrar
            </button>
            <div className="w-full flex justify-between items-center mt-5 text-[var(--grayscale-70)] text-xs font-medium">
              <span>Contratar o suporte</span>
              <span>Registrar uma conta</span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
