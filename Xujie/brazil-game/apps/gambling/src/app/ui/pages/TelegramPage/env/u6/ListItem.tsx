
export const ListItem = (props: { count: string; text: string; }) => {
  return (
    <li className="tablet:text-base text-sm">
      <div className="">{props.count} {props.text}</div>
    </li>
  )
}