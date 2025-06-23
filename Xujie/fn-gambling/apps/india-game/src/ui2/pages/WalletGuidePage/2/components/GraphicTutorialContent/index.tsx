import { EResourceLevel, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import renderI18N from '@commonUtils/renderI18N';
import { I18NContent } from '@mode2/@types/i18nType';
import { Trans, useTranslation } from 'react-i18next';
import Icon from '@components/Icon';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import sdkUtils from '@libs/mode2/utils/sdk';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import useWalletGuidePageActions from '@libs/mode2/action/walletGuidePageAction/useWalletGuidePageAction';
import { handleWalletGuidePageRewardsButtonClickAction } from '@mode2/action/actionTypes';
import { useWalletGuidePageStore } from '@mode2/zustand/page/WalletGuidePage/useWalletGuidePageStore';

interface TutorialItemProps {
  step: number;
  title: I18NContent;
  descriptions: I18NContent[];
  imgPath?: string;
}

const TutorialItem = (props: TutorialItemProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 bgi-text-[var(--base-2-variant1)] text-lg font-medium">
      <div
        className={cx(
          'flex items-center justify-between',
          'border-b border-[var(--transparent-white-10)]'
        )}
      >
        <div className="flex items-center gap-1.5 italic">
          <div className="w-[52px] h-[41px] relative flex items-center justify-center">
            <BaseCacheImg
              className="object-contain w-[52px] h-[41px] flex-shrink-0"
              alt={'step_title'}
              src={getImgUrl(EResourceLevel.V, 'step_title')}
              imgName="step_title"
            />
            <p
              className={cx(
                'text-xl font-medium bgi-text-[var(--base-1-main)]',
                'absolute'
              )}
            >
              {props.step < 10 ? `0${props.step}` : props.step}
            </p>
          </div>
          <p className="text-xl font-medium bgi-text-[var(--base-1-main)]">
            {t(renderI18N(props.title, t))}
          </p>
        </div>
        <Icon name={'ic_arrow_right_6'} className="w-7 h-7" />
      </div>

      <div className="flex flex-col gap-0.5">
        {props.descriptions.map((item, index) => (
          <p
            key={index}
            className={cx('text-base font-medium', {
              'numbered-item': props.descriptions.length > 1,
            })}
          >
            {renderI18N(item, t)}
            {props.step === 2 ? (
              <span className="block bgi-text-[var(--base-2-variant2)]">
                {renderI18N(
                  {
                    i18nKey: 'watch_learn_view_graphic_step_2_desc',
                  },
                  t
                )}
              </span>
            ) : null}
          </p>
        ))}
      </div>

      {props.imgPath ? (
        <BaseCacheImg
          className={cx(
            // 'bgi-[var(--linear-2)] rounded-[6px]',
            // 'max-h-[240px]',
            'w-full',
            'object-contain'
          )}
          alt={'step_title'}
          src={getImgUrl(EResourceLevel.V, props.imgPath)}
          imgName={props.imgPath}
        />
      ) : null}
    </div>
  );
};

export const GraphicTutorialContent = () => {
  const { t } = useTranslation();
  const { handleWalletGuidePageClick } = useWalletGuidePageActions();

  const tutorialStatusResult = useWalletGuidePageStore(
    (state) => state.tutorialStatusResult
  );

  const steps: TutorialItemProps[] = [
    {
      step: 1,
      title: { i18nKey: 'watch_learn_view_graphic_step_1_title' },
      descriptions: [
        { i18nKey: 'watch_learn_view_graphic_step_1_1' },
        { i18nKey: 'watch_learn_view_graphic_step_1_2' },
        { i18nKey: 'watch_learn_view_graphic_step_1_3' },
        { i18nKey: 'watch_learn_view_graphic_step_1_4' },
      ],
      imgPath: 'graphic_tutorial_step_1',
    },
    {
      step: 2,
      title: { i18nKey: 'watch_learn_view_graphic_step_2_title' },
      descriptions: [
        {
          i18nKey: 'watch_learn_view_graphic_step_2',
        },
      ],
      imgPath: 'graphic_tutorial_step_2',
    },
    {
      step: 3,
      title: { i18nKey: 'watch_learn_view_graphic_step_3_title' },
      descriptions: [
        { i18nKey: 'watch_learn_view_graphic_step_3_1' },
        { i18nKey: 'watch_learn_view_graphic_step_3_2' },
      ],
      imgPath: 'graphic_tutorial_step_3',
    },
    // {
    //   step: 4,
    //   descriptions: [{ i18nKey: 'watch_learn_view_graphic_step_4' }],
    //   imgPath: '',
    // },
    // {
    //   step: 5,
    //   descriptions: [{ i18nKey: 'watch_learn_view_graphic_step_5' }],
    //   imgPath: '',
    // },
    // {
    //   step: 6,
    //   descriptions: [
    //     {
    //       i18nKey: 'watch_learn_view_graphic_step_6',
    //     },
    //   ],
    //   imgPath: '',
    // },
    // {
    //   step: 7,
    //   descriptions: [
    //     { i18nKey: 'watch_learn_view_graphic_step_7_1' },
    //     { i18nKey: 'watch_learn_view_graphic_step_7_2' },
    //     { i18nKey: 'watch_learn_view_graphic_step_7_3' },
    //   ],
    //   imgPath: '',
    // },
  ];

  const noteList = [
    {
      i18nKey: 'watch_learn_view_graphic_note_1',
    },
    {
      i18nKey: 'watch_learn_view_graphic_note_2',
    },
    {
      i18nKey: 'watch_learn_view_graphic_note_3',
    },
    {
      i18nKey: 'watch_learn_view_graphic_note_4',
      i18nOption: {
        customer: 'Live Support',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-9 py-4 box-border">
      {steps.map((item, index) => {
        return <TutorialItem key={`${item.step}_${index}`} {...item} />;
      })}

      <div className="bgi-text-[var(--base-2-variant2)] text-sm font-medium">
        <div>{t('deposit_important_notes')}</div>
        <div className="pl-1.5 box-border">
          {noteList.map((item, index) => {
            if (item.i18nKey === 'watch_learn_view_graphic_note_4') {
              return (
                <div>
                  <div key={index} className={cx('numbered-item')}>
                    <div className="cursor-pointer">
                      <Trans
                        i18nKey={item.i18nKey}
                        values={{
                          customer: 'Live Support',
                        }}
                        components={{
                          tag: (
                            <span
                              className={cx(
                                'bgi-text-[var(--state-success-main)] underline'
                              )}
                              onClick={() => sdkUtils.openChat(() => {})}
                            ></span>
                          ),
                        }}
                      />
                    </div>
                  </div>
                  {/* TODO Evan 暫時不給領取 */}
                  {/*<div className={cx('w-full', 'mt-9')}>*/}
                  {/*  /!* // TODO I18N *!/*/}
                  {/*  /!* // TODO disabled 條件未明確 *!/*/}
                  {/*  <BasePrimaryBtn*/}
                  {/*    disabled={!tutorialStatusResult.isEnable}*/}
                  {/*    className={cx('w-full h-[46px]', 'text-xl')}*/}
                  {/*    children={'Get Reward'}*/}
                  {/*    onClick={() => {*/}
                  {/*      handleWalletGuidePageClick({*/}
                  {/*        actionName:*/}
                  {/*          handleWalletGuidePageRewardsButtonClickAction,*/}
                  {/*      });*/}
                  {/*    }}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>
              );
            }
            return (
              <div key={index} className={cx('numbered-item')}>
                {t(renderI18N(item, t))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GraphicTutorialContent;
