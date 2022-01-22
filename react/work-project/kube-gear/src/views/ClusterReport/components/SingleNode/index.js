import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import IndexPage from './Pages/IndexPage';
import DetailPage from './Pages/DetailPage';
import { useCheckPrivilege } from 'utils/hooks/useCheckPrivilege';

function SingleNode() {
  const [isIndexPage, setIsIndexPage] = useState({ index: true, host: '' });
  const permission = useCheckPrivilege('ADMIN');
  const history = useHistory();

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
