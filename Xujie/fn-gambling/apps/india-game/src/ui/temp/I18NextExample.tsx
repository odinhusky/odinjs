import { useTranslation } from 'react-i18next';
import { EN } from '@/constant';
import cx from '@commonUtils/cx';

export const I18NextExample = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className={cx('bg-[aqua] w-full p-4')}>
      <h1 className={cx('text-2xl text-[red]')}>I18next Example Area</h1>

      <h4 className={cx('text-xl text-[yellow]')}>
        直接使用 i18next 的詞條替換內容
      </h4>
      <p>{t('odin')}</p>

      <h4 className={cx('text-xl text-[yellow]')}>
        如果沒有配對到的key可以先設定好預設值
      </h4>
      <p>{t('odin2', 'This is default value for odin2')}</p>

      <h4 className={cx('text-xl text-[yellow]')}>插值 Interpolation</h4>
      <p>{t('test', { name: 'answerrrr', html: '<i>Awesome</i>' })}</p>
      {/* 預設會把html標籤做 escape，如果不希望做 escape 的話可以有兩種設定 */}
      {/* 第一種是在定義的地方做，在前方加上 - => test: 'Use English interpolation as {{name}} and {{-html}}' */}
      {/* 第二種是在使用的地方加上設定 */}
      <p>
        {t('test', {
          name: 'answerrrr',
          html: '<i>Awesome</i>',
          interpolation: { escapeValue: false },
        })}
      </p>

      <h4 className={cx('text-xl text-[yellow]')}>複數 Pluralization</h4>
      <p>{t('cake', { count: 0 })}</p>
      <p>{t('cake', { count: 1 })}</p>
      <p>{t('cake', { count: 2 })}</p>
      <p>{t('cake_many', { count: 7 })}</p>
      <p>{t('cake_few', { count: 3 })}</p>
      <p>{t('cake', { count: 11 })}</p>

      <h4 className={cx('text-xl text-[yellow]')}>格式化 Formatting</h4>
      <p>{t('useNumber', { val: 10000 })}</p>
      <p>{t('plus1', { val: 1 })}</p>

      <h4 className={cx('text-xl text-[yellow]')}>Context</h4>
      <p>{t('ctx', { context: 'cake', count: 1 })}</p>
      <p>{t('ctx', { context: 'muffin', count: 1 })}</p>
      <p>{t('ctx', { context: 'cake', count: 2 })}</p>
      <p>{t('ctx', { context: 'muffin', count: 3 })}</p>
      <p>{t('ctx', { context: 'anyway' })}</p>

      <h4 className={cx('text-xl text-[yellow]')}>Switch Language</h4>
      <button
        className={cx(
          { 'bg-[yellow]': i18n.resolvedLanguage === 'es' },
          'mr-3'
        )}
        onClick={() => {
          i18n.changeLanguage('es');
        }}
        disabled={i18n.resolvedLanguage === 'es'}
      >
        Espanol
      </button>
      <button
        className={cx({ 'bg-[yellow]': i18n.resolvedLanguage === EN })}
        onClick={() => {
          i18n.changeLanguage(EN);
        }}
        disabled={i18n.resolvedLanguage === EN}
      >
        English
      </button>
    </div>
  );
};

export default I18NextExample;
