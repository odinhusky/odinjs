import { IButtonRender } from "../types"

type ITabItem<T> = {
  value: T
  onChange: (value: T) => void
  options: Array<{ label: string; value: T }>
  itemRender?: IButtonRender
}

const Tabs = <T,>({
  value,
  onChange,
  options,
  itemRender = (p) => <button {...p} />,
}: ITabItem<T>) => {
  return (
    <div className="mode-tabs">
      {options.map((item) =>
        itemRender({
          className: `tabs-item ${value === item.value ? "active" : ""}`,
          onClick: () => onChange(item.value),
          children: item.label,
          key: item.label,
        })
      )}
    </div>
  )
}
export default Tabs
