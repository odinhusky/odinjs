import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'hooks/redux-hooks'
import { useIsFocused } from '@react-navigation/native';

const useGetPrice = (props: string) => {
    const focus = useIsFocused();
    const market = useAppSelector((state)=> focus ? state.market.price : "")
    const [selected, setSelected] = useState(()=>  market ? market.find( p => p.s===props ) ?? {} as MarketPrice : {} as MarketPrice)

    useEffect(()=>{
        if (market){
            setSelected(()=> market.find( p => p.s===props ) ?? {} as MarketPrice)
        }
    },[props])

    return {
        selected
    }
}

export default useGetPrice