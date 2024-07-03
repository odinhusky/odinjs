import {renderByUVersion} from "../../utils/renderByUVersion";
import React from "react";



const defaultFixedToolStyle = {
  backgroundColor: 'rgba(119, 136, 120, 0.4)'
}

const p777betFixedToolStyle = {
  background: 'var(--varient)',
  border: '1px solid var(--primary-assistant)',
  borderRight: '0px',
  boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.10)'
}

const coco777betFixedToolStyle = {
  background: `linear-gradient(135deg, var(--lineary-blue-from) 8.58%, var(--lineary-blue-to) 91.42%)`,
  border: '1px solid var(--primary-assistant)',
  borderRight: '0px',
  boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.10)'
}

const riojungle777betFixedToolStyle: React.CSSProperties = {

}

export const FixedToolStyle = renderByUVersion({
  "wild777bet": defaultFixedToolStyle,
  "p1": p777betFixedToolStyle,
  "u1": coco777betFixedToolStyle,
  "u2": riojungle777betFixedToolStyle,
}, coco777betFixedToolStyle)
