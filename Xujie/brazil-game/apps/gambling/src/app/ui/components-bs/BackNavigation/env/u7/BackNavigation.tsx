import { useNavigate } from 'react-router';
import t from 'apps/gambling/src/assets/constant/lang';
import { LeftOutlined } from '@ant-design/icons';
import cx from '../../../../utils/cx';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import styled from 'styled-components';
import { HTMLAttributes } from 'react';

type IProps = {
  onClick?: () => void;
  title?: React.ReactNode;
  className?: string;
  style?: HTMLAttributes<HTMLDivElement>['style'];
  contentClassName?: string;
};

export const U7BackNavigation = styled.div`
  margin: auto;
  max-width: 1360px;
  box-sizing: border-box;

  @media (max-width: 1680px) {
    max-width: 1360px;
  }
  @media (max-width: 1600px) {
    max-width: 1200px;
  }
  @media (max-width: 1440px) {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding-right: 32px;
    padding-left: 32px;
  }

  @media (max-width: 1220px) {
    width: 100%;
    max-width: 960px;
    margin: auto;
    padding-right: 32px;
    padding-left: 32px;
  }

  @media (max-width: 980px) {
    width: 100%;
    max-width: 760px;
    margin: auto;
    padding-right: 32px;
    padding-left: 32px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 680px;
    margin: auto;
    padding-right: 16px;
    padding-left: 16px;
  }
`;
/**
 * 注意搭配 U7PageContainer 斷點
 * @param props
 * @constructor
 */
export const BackNavigation = (props: IProps) => {
  const navigate = useNavigate();
  const pageContainerSlice = useSelector(
    (state: RootState) => state.ui.pageContainerSlice
  );
  const { width, contentWidth } = pageContainerSlice;
  const offsetY = (width - contentWidth) / 2;
  const handleBack = (e: any) => {
    e.stopPropagation();
    if (props.onClick) {
      props.onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cx('w-full', props.contentClassName)}
      style={{
        background: 'var(--transparent-black-20)',
        width: `${pageContainerSlice.width}px`,
        marginLeft: `-${offsetY}px`,
        ...props.style,
      }}
    >
      <U7BackNavigation
        className={cx(
          'flex justify-start items-center h-12',
          'font-medium text-base text-left text-[var(--grayscale-70)] hover:text-[var(--grayscale-100)] active:text-[var(--grayscale-80)]',
          props.className
        )}
      >
        <div className={'box-border w-full mx-auto'} onClick={handleBack}>
          <div
            className={
              'w-full flex flex-row items-center justify-start px-1.5 py-2'
            }
          >
            <LeftOutlined
              className="relative z-10 cursor-pointer h-4 w-4 mr-2 "
              onClick={handleBack}
            />
            {props.title ? (
              props.title
            ) : (
              <div className={'w-fit cursor-pointer'} onClick={handleBack}>
                {t['goBack']}
              </div>
            )}
          </div>
        </div>
      </U7BackNavigation>
    </div>
  );
};
