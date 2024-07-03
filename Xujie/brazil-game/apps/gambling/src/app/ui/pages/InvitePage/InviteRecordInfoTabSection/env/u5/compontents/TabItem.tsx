import { TabItem as U5TabItem} from "../../../../../../components-bs/TabItem/env/u5/TabItem"

export const TabItem =(props:Parameters<typeof U5TabItem>[0])=> {
    return <U5TabItem 
    className="border-none  py-2.5 px-4 bg-inherit text-[var(--grayscale-100)] rounded-lg" 
    activeClassName="text-white bg-linear-6-main "
    {...props}/>
}