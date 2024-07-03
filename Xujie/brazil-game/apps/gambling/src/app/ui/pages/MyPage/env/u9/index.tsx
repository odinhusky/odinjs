import { environment } from '../../../../../../environments/environment';
import { Avatar } from '../../../../components/Avatar';
import { CopyIcon } from '../../../../components-bs/Icons/CopyIcon';
import { ProgressBar } from '../../../../components-bs/ProgressBar';
import './index.scss';
import { useMyBase } from '../../useMyBase';
import { formatLocaleMoney } from '../../../../utils/format';
import { GetVIPInfoResponse } from '../../../../../external/UserEndpoint';

export const MyPage = ({
  userVIPInfo,
}: {
  userVIPInfo: GetVIPInfoResponse;
}) => {
  const { uiState, handleClick, onRefresh } = useMyBase();
  const flowProgress = userVIPInfo?.data?.flow_progress || 0;
  const nextLevelFlow = userVIPInfo?.data?.next_level_flow || 0;

  return (
    <div className="my">
      {/*頭像與個人資訊*/}
      <div className="userinfo">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="avatar" />
            <div className="">
              <div className="flex items-center">
                <div className="text-sm font-medium">
                  ID: {uiState.userInfo.user_id}
                </div>
                <CopyIcon
                  copyText={uiState.userInfo.user_id}
                  icon={
                    <img
                      alt="copy"
                      className="w-3 h-3 ml-1"
                      src={`assets/${environment.uVersion}/icon_copy.png`}
                    />
                  }
                />
              </div>
              <div className="text-sm font-medium">
                Conta: {uiState.userInfo.nickname}
              </div>
              <div className="flex items-center">
                <img
                  className="w-4 h-4"
                  src={`assets/${environment.uVersion}/icon_banlance.png`}
                  alt="mail"
                />
                <div className="amount">
                  {formatLocaleMoney(uiState.userInfo.withdraw_amount)}
                </div>
                <img
                  className="w-4 h-4"
                  src={`assets/${environment.uVersion}/icon_reset.png`}
                  alt="mail"
                  onClick={onRefresh}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img
              className="w-7 h-7"
              src={`assets/${environment.uVersion}/icon_mail.png`}
              alt="mail"
            />
            <div className="text-sm">Notificação</div>
          </div>
        </div>
        <div className="setting-list">
          {uiState.settingList.map((v, i: number) => {
            return (
              <div
                key={i}
                className="setting-item"
                onClick={() => handleClick(v)}
              >
                <img src={v.url} alt="" className="w-7 h-7" />
                <div>{v.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/*VIP 資訊*/}
      <div className="common vip-box">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={`assets/${environment.uVersion}/${environment.mVersion}/icon_vip_level_${userVIPInfo.data.vip_level}.png`}
              className="w-9 h-9 mr-2"
            />
            <div>
              <div className="flex flex-col text-xs">
                <div className="flex items-center">
                  {/* TODO userVIPInfo.data + 1 需要判斷一下最大等級 */}
                  <div>
                    Para o próximo nível{' '}
                    <span className="yellow">
                      VIP{userVIPInfo.data.vip_level + 1}
                    </span>
                  </div>
                  <div>
                    Aposte mais{' '}
                    <span className="yellow">
                      {formatLocaleMoney(nextLevelFlow)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>Aposta necessária</div>
                  <ProgressBar
                    className="h-3"
                    progress={flowProgress}
                    progressClassName=""
                  />
                </div>
              </div>
            </div>
          </div>
          <img
            src={`assets/${environment.uVersion}/icon_back.png`}
            className="w-3 h-3"
          />
        </div>
        <div className="list">
          {uiState.vipList.map((v, i: number) => {
            return (
              <div key={i} className="item" onClick={() => handleClick(v)}>
                <img src={v.url} alt="" className="w-7 h-7 mb-1" />
                <div>{v.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/*導航*/}
      <div className="common menu-box">
        <div className="menu-list">
          {uiState.menuList.map((v, i: number) => {
            return (
              <div key={i} className="menu-item" onClick={() => handleClick(v)}>
                <div className="flex items-center">
                  <img src={v.url} className="w-4 h-4 mr-2" />
                  <div>{v.text}</div>
                </div>
                <img
                  src={`assets/${environment.uVersion}/icon_back.png`}
                  className="w-3 h-3"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
