import {LeftOutlined} from "@ant-design/icons";
import React from "react";
import { twMerge } from "tailwind-merge";
import t from "apps/gambling/src/assets/constant/lang";
import { useNavigate } from 'react-router-dom';
import cx from "../../../../utils/cx";

type IProps = {
  onClick?: () => void;
  title?: React.ReactNode;
  className?: string;
}

export const BackNavigation = (props: IProps) => {

  const navigate = useNavigate();

  const handleBack = () => {
    if(props.onClick)  {
      props.onClick();
    } else { 
      navigate(-1);
    }
  };

  return (
    <div
      className={cx("relative text-xl text-left text-white",
      props.className)}
    >
      <div
        className={'flex flex-row items-center justify-start'}
        onClick={handleBack}
      >
        <LeftOutlined
          className='relative z-10 cursor-pointer'
          onClick={handleBack}
        />
        {props.title ? props.title :
          <div
            className={'ml-2 w-fit cursor-pointer'}
            onClick={handleBack}
          >
            {t['goBack']}
          </div>
        }
      </div>
    </div>
  )
}
