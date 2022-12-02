import { useState, useEffect, useContext } from 'react';
import GlobalContext from 'layouts/Main/GlobalContext';
import { isEmpty, isString, isArray } from 'lodash';

export const useCheckPrivilege = (privileges) => {
  const context = useContext(GlobalContext);
  const [authState, setAuthState] = useState(null);

  const checkPrivilege = (privileges) => {
    const permission = context.userInfo.privileges;

    if (isString(privileges) || isArray(privileges)) {
      if (isString(privileges)) {
        if (permission.includes(privileges)) {
          setAuthState(true)
        } else {
          setAuthState(false)
        }
      }

      if (isArray(privileges)) {
        let totalPrivileges = 0;
        privileges.forEach(element => {
          if (permission.includes(element)) {
            totalPrivileges += 1;
          }
        })
        if (totalPrivileges === privileges.length) {
          setAuthState(true)
        } else {
          setAuthState(false)
        }
      }

      if (permission.includes('ADMIN')) {
        setAuthState(true)
      }

    }
    return;
  }

  useEffect(() => {
    if (!isEmpty(context.userInfo)) {
      checkPrivilege(privileges)
    }
  }, [context.userInfo])

  return authState;
}
