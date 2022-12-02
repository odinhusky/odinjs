/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ColorSchemeName }  from 'react-native';
import LinkingConfiguration from './LinkingConfiguration';
import RootNavigator from "./RootNavigator"
import { getToken } from "utils/auth"
import { useAppDispatch, useAppSelector } from 'hooks/redux-hooks'
import { userActions } from "store/slice";
import { fetchUser } from 'store/slice/user';
import RenderCounter from "components/render-counter"
import WebsocketContainer from 'components/WebsocketContainer';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const dispatch = useAppDispatch();
  const account = useAppSelector((state)=>state.user.detail.account)
  useEffect(()=>{
    const getCacheToken = async () => {
      const cacheToken = await getToken()
      if ( cacheToken ){
        dispatch(userActions.setToken(cacheToken))
        dispatch(fetchUser())
      }
    }
    getCacheToken()
    
  },[])

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={DarkTheme}>
        <WebsocketContainer/>
        <RootNavigator />
        <RenderCounter name="Navigation" debug={true}/>
    </NavigationContainer>
  );
}