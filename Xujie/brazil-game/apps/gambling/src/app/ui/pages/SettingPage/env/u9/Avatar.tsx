import { Modal } from 'antd';
import { environment } from '../../../../../../environments/environment';
import { useState } from 'react';

export const Avatar = ({
  onClose,
  onData,
}: {
  onClose: () => void;
  onData: (value: number) => void;
}) => {
  const [current, setCurrent] = useState(1);

  const onAvatar = () => {
    onData(current);
    onClose();
  };

  return (
    <div className="avatar-component">
      <img
        src={`assets/${environment.uVersion}/icon_x.png`}
        alt="icon-close"
        className="icon-close"
        onClick={onClose}
      />
      <div className="title">Mudar Avatar</div>
      <div className="avatar-list">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((index) => (
          <div
            onClick={() => setCurrent(index)}
            className="avatar-item"
            key={index}
          >
            <img
              className="avatar_img"
              src={`assets/${environment.uVersion}/${environment.mVersion}/avatar_${index}.png`}
              alt={`avatar${index}`}
            />
            {current == index ? (
              <img
                className="active"
                src={`assets/${environment.uVersion}/${environment.mVersion}/icon_selected.png`}
                alt="icon_selected"
              />
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
      <button className="save change-avatar" onClick={onAvatar}>
        Salvar
      </button>
    </div>
  );
};

export const showAvatarModal = ({
  onData,
}: {
  onData: (value: number) => void;
}) => {
  const modal = Modal.info({
    className: '!max-w-[564px] !w-[80vw]',
    maskClosable: true,
    modalRender: () => (
      <div style={{ pointerEvents: 'auto' }}>
        <Avatar onClose={() => modal.destroy()} onData={onData} />
      </div>
    ),
  });
};
