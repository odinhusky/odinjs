import React, { useRef } from 'react';
import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { t } from 'i18next';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import { defaultFileSize, ImageUploadProps } from '../ImageUploadProps';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

export const ImageUpload = (props: ImageUploadProps) => {
  // TODO Ronan 再關注actionType
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = props.allowedFileTypes || [
    'image/jpg',
    'image/jpeg',
    'image/png',
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const maxFileSize = props.maxFileSize || defaultFileSize; // 默认 200KB

      const allowedFileTypesList = allowedFileTypes
        .map((type) => type.split('/')[1])
        .join(' and ');

      if (!allowedFileTypes.includes(file.type)) {
        useMessageStore
          .getState()
          .info(
            `Only ${allowedFileTypesList} images are allowed to be uploaded`
          );
        return;
      }

      if (file.size > maxFileSize) {
        useMessageStore
          .getState()
          .info(`The file size cannot exceed ${maxFileSize / 1024}KB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        props.onUpload(files[0]);
      };
      reader.readAsDataURL(files[0]); // 將圖片轉換為 Base64 格式
    }
  };

  const onClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-upload">
      <div
        className={cx(
          'w-[416px] h-[300px] border-2 border-dashed border-[var(--grayscale-50)] rounded',
          'p-3 box-border',
          'flex items-center justify-center',
          props.className
        )}
        style={props.styles}
      >
        <input
          type="file"
          accept={allowedFileTypes.join(',') || 'image/png, image/jpg'}
          disabled={props.disabled}
          onChange={handleFileChange}
          ref={fileInputRef}
          className="!hidden"
        />

        {props.imageUrl ? (
          <img
            src={props.imageUrl}
            alt="Selected"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center">
            <BaseCacheImg
              className="w-20 h-20 mb-3"
              src={getImgUrl(EResourceLevel.V, 'choose_image')}
              alt=""
              style={{ objectFit: 'contain' }}
              onClick={onClick}
            />
            {/* TODO i18n */}
            <span className="text-base font-medium bgi-text-[var(--grayscale-70)]">
              Upload your image here
            </span>
          </div>
        )}
      </div>

      {props.showBtn && props.imageUrl ? (
        <div className="flex justify-center">
          <BasePrimaryBtn
            className="w-[166px] h-[46px] mt-4"
            classNameText="text-lg font-medium"
            onClick={onClick}
          >
            {t('balance_record_deposit_record_receipt_reupload')}
          </BasePrimaryBtn>
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
