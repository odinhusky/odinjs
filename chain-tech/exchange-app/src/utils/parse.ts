export const parsePrice = (price: string) => {
    return ( parseFloat(price) < 0.006 && parseFloat(price) > 0 ) ? price : 
                ( parseFloat(price) < 0.1 && parseFloat(price) > 0.006) ? price.slice(0, -1) : 
                    ( parseFloat(price) < 1 && parseFloat(price) > 0.1) ? price.slice(0, -2) : 
                        ( parseFloat(price) < 50 && parseFloat(price) > 1) ? price.slice(0, -3) : price.slice(0, -4)
}