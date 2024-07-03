import { TabItem as U6TabItem} from "../../../../../../components-bs/TabItem/env/u6/TabItem"

export const TabItem =(props:Parameters<typeof U6TabItem>[0])=> {
    return <U6TabItem 
    className="" 
    activeClassName="linear-2-button rounded-lg border-none"
    {...props}/>
}