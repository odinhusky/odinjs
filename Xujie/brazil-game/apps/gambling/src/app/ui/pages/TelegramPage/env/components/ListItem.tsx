

import { renderByUVersion } from "../../../../utils/renderByUVersion"
import { ListItem as CListItem } from "../u1/ListItem";
import { ListItem as RListItem } from "../u2/ListItem";
import { ListItem as U5ListItem } from "../u5/ListItem";
import { ListItem as U6ListItem } from "../u6/ListItem";

export const ListItem = (props: { count: string; text: string; }) => {
  return renderByUVersion({
    "wild777bet": <CListItem {...props} />,
    "u1": <CListItem {...props} />,
    "u2": <RListItem {...props} />,
    "u5": <U5ListItem {...props} />,
    "u6": <U6ListItem {...props} />
  }, <CListItem {...props} />)
}
