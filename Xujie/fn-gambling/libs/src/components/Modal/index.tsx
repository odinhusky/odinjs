import { cx } from '@libs/commonUtils';
import { useBaseModalStore } from '@libs/mode2/zustand/baseModalStore';
import * as React from 'react';
// import { Modal } from "antd";
import {CSSProperties, useEffect, useMemo, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';

type IModalProps = {
  children?: JSX.Element;
  className?: string;
  onClick?: VoidFunction;
  style?: CSSProperties | undefined;
};

const BaseModal = (props: IModalProps) => {
  useEffect(() => {
    document.querySelector('body')?.classList.add('overflow-hidden');
    return () => {
      document.querySelector('body')?.classList.remove('overflow-hidden');
    };
  }, []);

  const { modalIds, addModalId, clearModalIds } = useBaseModalStore();
  const [current] = useState(uuidv4);
  useEffect(() => {
    addModalId(current);
  }, [current]);
  useEffect(() => {
    return () => {
      clearModalIds(current);
    };
  }, []);
  const isShow = useMemo(() => {
    // NOTICE 解决多个modal重叠问题，按照ModalLayout从下到上的顺序显示
    if (modalIds.length > 1) {
      const elements = document.querySelectorAll('#baseModal');
      return (
        current === Array.from(elements).slice(-1)[0]?.getAttribute('data-id')
      );
    } else {
      return current === modalIds[0];
    }
  }, [modalIds, current]);
  return (
    <div id="baseModal" data-id={current}>
      {isShow && (
        <div
          className={cx(
            'z-[1005] fixed left-0 top-0 right-0 bottom-0',
            'flex flex-col items-center justify-center',
            'bgi-[var(--transparent-gray-60)]',
            props.className
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              props?.onClick?.();
            }
          }}
          style={{...props?.style}}
        >
          {props.children}
        </div>
      )}
    </div>

    // antd
    // <Modal open={true} modalRender={() => props.children} />
  );
};

export default BaseModal;
