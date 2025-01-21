import React, { useRef } from 'react';
import { ReactNode, createContext, useState } from 'react';

type IModalContent = JSX.Element;
export const ModalContext = createContext({
  openModal: (content: IModalContent) => {},
  closeModal: () => {},
  closeModalAll: () => {},
});

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<IModalContent>();
  const modalArrayRef = useRef<IModalContent[]>([]);
  const openModal = (content: IModalContent) => {
    !modalArrayRef.current.length && setModalContent(content);
    const isOnlyModalType = !modalArrayRef.current.find(
      (v) => v?.type?.name === content?.type?.name
    ); //防止打开重复的modal
    isOnlyModalType && modalArrayRef.current.push(content);
  };

  const closeModal = () => {
    modalArrayRef.current.shift();
    setModalContent(modalArrayRef.current[0]);
  };

  const closeModalAll = () => {
    modalArrayRef.current = [];
    setModalContent(undefined);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeModalAll }}>
      {children}
      {modalContent}
    </ModalContext.Provider>
  );
};
export default ModalProvider;
