import React, { useRef } from 'react';
import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { t } from 'i18next';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import { defaultFileSize, ImageUploadProps } from '../ImageUploadProps';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

const ImageUpload = (props: ImageUploadProps) => {
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
          'w-[344px] h-[344px] border border-dashed border-[var(--grayscale-50)] rounded',
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
              className="w-12 h-12 mb-1.5"
              src={getImgUrl(EResourceLevel.V, 'choose_image')}
              alt=""
              style={{ objectFit: 'contain' }}
              onClick={onClick}
            />
            <span className="text-sm font-medium bgi-text-[var(--grayscale-50)]">
              {renderI18N(
                {
                  i18nKey:
                    'balance_record_deposit_record_receipt_screenshot_choose_imag',
                },
                t
              )}
            </span>
          </div>
        )}
      </div>

      {props.showBtn && props.imageUrl ? (
        <div className="flex justify-center">
          <button
            className="w-[120px] h-7 mt-3 text-sm font-medium rounded-full !bgi-[var(--base-3-main)]"
            onClick={onClick}
          >
            {renderI18N(
              { i18nKey: 'balance_record_deposit_record_receipt_reupload' },
              t
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
