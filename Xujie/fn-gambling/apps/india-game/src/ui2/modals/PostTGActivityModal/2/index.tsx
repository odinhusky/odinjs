import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import usePostTGActivityModalStore from '@mode2/zustand/modal/PostTGActivityModal';
import usePostTGActivityModalBase from '@libs/mode2/usecase/modal/usePostTGActivityModalBase';
import usePostTGActivityModalAction from '@mode2/action/postTGActivityModalAction/usePostTGActivityModalAction';
import {
  handlePostTGActivityModalCloseBtnClick,
  handlePostTGActivityModalImgClick,
} from '@mode2/action/actionTypes';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

export const PostTGActivityModal = () => {
  usePostTGActivityModalBase();
  const { handlePostTGActivityModalClick } = usePostTGActivityModalAction();
  const isShowPostTGActivityModal = usePostTGActivityModalStore(
    (state) => state.isShowPostTGActivityModal
  );
  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  return isShowPostTGActivityModal ? (
    <BaseModal
      onClick={() => {
        handlePostTGActivityModalClick({
          actionName: handlePostTGActivityModalCloseBtnClick,
        });
      }}
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div className="w-96">
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handlePostTGActivityModalClick({
                actionName: handlePostTGActivityModalCloseBtnClick,
              });
            }}
          />
        </div>

        <BaseCacheImg
          className={cx('w-96 cursor-pointer')}
          src={getImgUrl(
            EResourceLevel.POPUP_BANNER,
            'popup_subscribe_telegram'
          )}
          imgName="popup_subscribe_telegram"
          alt={'popup_subscribe_telegram'}
          onClick={() => {
            handlePostTGActivityModalClick({
              actionName: handlePostTGActivityModalImgClick,
            });
          }}
          onLoad={() => {}}
          onError={(e) => {}}
        />
      </div>
    </BaseModal>
  ) : null;
};

export default PostTGActivityModal;
