import React, { useContext, useEffect, useState } from 'react';
import  ReactMarkdown from 'react-markdown'
import GlobalContext from 'layouts/Main/GlobalContext'
import axios from 'axios';

import en from 'assets/ReleaseNode/en.md'
import cn from 'assets/ReleaseNode/cn.md'
import tw from 'assets/ReleaseNode/tw.md'
import jp from 'assets/ReleaseNode/jp.md'

const VersionLog = () => {
  const { locale } = useContext(GlobalContext)
  const [content, setContent] = useState('');
  useEffect(() => {
    let source = null;
    switch (locale) {
      case 'en':
      default: 
        source = en;
        break;
      case 'zh-TW':
        source = tw
        break;
      case 'zh-CN':
        source = cn
        break;
      case 'jp':
        source = jp
        break;
    }
    axios.get(source)
      .then(data => setContent(data.data));
  }, [locale])

  return (
    <ReactMarkdown source={content} />
  );
};

export default VersionLog;