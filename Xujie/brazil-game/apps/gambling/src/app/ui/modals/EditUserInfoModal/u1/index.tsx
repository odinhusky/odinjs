import {tcx} from "../../../utils/tcx";
import {CloseICON} from "../../../components-bs/Icons/CloseICON";
import {environment} from "../../../../../environments/environment";
import React from "react";
import styled from "styled-components";
import useBreakpoint from "../../../pageTemplate/hooks/useBreakpoint";
import {Input as DesktopInput} from '../../../components-bs/Inputs/Input';
import {MobileInput} from '../../../components-bs/Inputs/MobileInput';


const CancelButton = styled.button`
  width: 100%;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 16px;
  background: linear-gradient(180deg, var(--secondary-main-from) 0%, var(--secondary-main-to) 100%);
`;
const ConfirmButton = styled.button`
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  background: linear-gradient(180deg, var(--primary-main-from) 0%, var(--primary-main-to) 99%);
  border-radius: 8px;
`;

interface EditUserInfoModalProps {
    userNickname: string;
    nickNameInvalidatedMessage: string;
    selectedAvatar: number;
    setUserNickname: React.Dispatch<React.SetStateAction<string>>;
    setNickNameInvalidatedMessage: React.Dispatch<React.SetStateAction<string>>;
    setSelectedAvatar: React.Dispatch<React.SetStateAction<number>>;
    handleConfirm: () => void;
    isLoading: boolean;
    close: () => void
}

export const EditUserInfoModalContent = ({
                                             userNickname,
                                             setUserNickname,
                                             selectedAvatar,
                                             nickNameInvalidatedMessage,
                                             setNickNameInvalidatedMessage,
                                             setSelectedAvatar,
                                             handleConfirm,
                                             isLoading,
                                             close
                                         }: EditUserInfoModalProps) => {
    const {isMobile} = useBreakpoint();

    const Input = isMobile ? MobileInput : DesktopInput;
    const avatarNumArray = Array.from({length: 12}, (_, index) => index + 1);
    const nickNameValidator = (nickName: string) => {
        if (nickName === '') {
            setNickNameInvalidatedMessage('Insira um apelido')
            return;
        }

        if (/[^0-9a-zA-Z]/.test(nickName)) {
            setNickNameInvalidatedMessage('Apenas inglês ou números são suportados')
            return;
        }

        if (nickName.length < 4 || nickName.length > 16) {
            setNickNameInvalidatedMessage('nome de usuário (4-16 letras e números)')
            return;
        }

        setNickNameInvalidatedMessage('')
    }

    return (
        <>
            <div
                className={tcx(
                    `
          flex w-[400px] md:w-[656px] flex-col items-center rounded-2xl px-8 pt-8 pb-10 text-white
          bg-gradient-to-b from-[var(--background-modal-from)] to-[var(--background-modal-to)]
          `,
                    ['w-[382px] px-6 pt-4 pb-5', isMobile]
                )}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <div className='flex justify-between w-full'>
                    <div className="w-full text-start text-lg md:text-4xl md:font-bold">Alterar apelido favrito</div>
                    <div
                        onClick={() => {
                            close();
                        }}
                    >
                        <CloseICON/>
                    </div>
                </div>

                <div className='w-full'>
                    <Input
                        prefix={<img alt='user' src={`assets/${environment.uVersion}/icon=user.png`}
                                     className="h-[14px] w-[14px] mr-2"/>}
                        className="mt-4 md:mt-8 w-full items-center rounded-full p-3 text-xs md:text-3xl bg-[var(--primary-variant)]"
                        value={userNickname}
                        onChange={(event: any) => {
                            setUserNickname(event.target.value);
                            nickNameValidator(event.target.value);
                        }}
                        validation={nickNameInvalidatedMessage === ''}
                        errorMessage={nickNameInvalidatedMessage}
                    />
                </div>

                <div className='w-full grid grid-cols-4 gap-2 md:gap-4 mb-4'>
                    {
                        // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                        avatarNumArray.map((item) => (
                            <div key={item} className='relative' onClick={() => setSelectedAvatar(item)}>
                                <img
                                    className='w-full rounded-xl md:rounded-3xl bg-transparent'
                                    alt={`avatar${item}`}
                                    src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${item}.png`}
                                />
                                {selectedAvatar === item &&
                                    <div
                                        className='absolute top-0 left-0 h-full w-full rounded-xl md:rounded-3xl border-4 border-[#FDEF70] z-10'/>
                                }
                            </div>
                        ))
                    }
                </div>

                <div className="flex w-full justify-between gap-5">
                    <CancelButton onClick={() => close()}>Cancelar</CancelButton>
                    <ConfirmButton onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Cargando' : 'Confirme'}
                    </ConfirmButton>
                </div>
            </div>
        </>
    )
}
