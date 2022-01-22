import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTheme } from 'office-ui-fabric-react';
import { DefaultButton } from 'components/BaseButton';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

const palette = getTheme().palette;
const styles = {
  container: mergeStyles({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }),
  title: mergeStyles({
    color: palette.themePrimary,
    fontSize: '66px'
  }),
  content: mergeStyles({
    color: palette.themePrimary,
    fontSize: '38px'
  })
}

const NotFound = () => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <h3 className={styles.content}>{t('pageNotFound')} :(</h3>
      <DefaultButton
        className={styles.link}
        onClick={() => history.push('entry')}
        text={t('backToIndexPage')}
      />
    </div>
  );
};

export default NotFound;
