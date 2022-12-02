import React, {
  useContext,
  useEffect,
  useState
} from 'react';

// ? context
import GlobalContext from 'layouts/Main/GlobalContext'

// ? Self-packed Components || Functions
import  ReactMarkdown from 'react-markdown'
import en from 'assets/ReleaseNode/en.md'
import cn from 'assets/ReleaseNode/cn.md'
import tw from 'assets/ReleaseNode/tw.md'
import jp from 'assets/ReleaseNode/jp.md'

// ^ Plugins
import axios from 'axios';

/**
 * @author odin
 * @level views/Version/VersionLog
 * @component VersionLog
 * @description VersionLog
*/
const VersionLog = () => {

  // $ init data
  const { locale } = useContext(GlobalContext);

  // # states
  const [content, setContent] = useState('');

  // * hooks
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