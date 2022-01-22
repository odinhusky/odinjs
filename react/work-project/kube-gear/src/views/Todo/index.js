import React from 'react';
import { useTranslation } from 'react-i18next';
import { getTheme } from 'office-ui-fabric-react';

const palette = getTheme().palette;
const style = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: palette.themePrimary,
    fontSize: '66px'
  }
}

const Todo = () => {
  const { t } = useTranslation();

  return (
    <div style={style.container}>
      <h1 style={style.title}>{t('staytuned')}</h1>
    </div>
  );
};

export default Todo;
