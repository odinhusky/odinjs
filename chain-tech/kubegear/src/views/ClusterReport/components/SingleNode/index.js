import React, {
  useState,
  useEffect
} from 'react';

// ? Self-packed Components || Functions
import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

// ^ Plugins
import { useHistory } from 'react-router-dom';

/**
 * @author odin
 * @level views/ClusterReport/SingleNode
 * @component SingleNode
 * @description SingleNode
*/
function SingleNode() {

  // $ init data
  const permission = useCheckPrivilege('ADMIN');
  const history = useHistory();

  // # states
  const [isIndexPage, setIsIndexPage] = useState({ index: true, host: '' });

  // * hooks
  useEffect(() => {
    if (permission === null) return;
    if (!permission) {
      history.push('entry')
    }
  }, [permission])

  return (
    <>
      {
        isIndexPage.index
          ?
          <IndexPage
            isIndexPage={isIndexPage}
            setIsIndexPage={setIsIndexPage}
          />
          :
          <DetailPage
            isIndexPage={isIndexPage}
            setIsIndexPage={setIsIndexPage}
          />
      }
    </>
  )
}

export default SingleNode;
