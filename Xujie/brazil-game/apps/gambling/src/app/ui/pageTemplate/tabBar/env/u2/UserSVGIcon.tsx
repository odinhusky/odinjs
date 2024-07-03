import {IICON} from "./types";

export const UserSVGIcon = (props:IICON) => {
  const size = props.size? props.size / 32 : 1;
  return (
    <svg width={props.size || "32"} height={props.size || "32"} viewBox={`0 0 ${props.size} ${props.size}`} fill="none"  xmlns="http://www.w3.org/2000/svg">
      <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${size})`}/>
      <path d="M16 20C18.7614 20 21 17.7614 21 15C21 12.2386 18.7614 10 16 10C13.2386 10 11 12.2386 11 15C11 17.7614 13.2386 20 16 20Z" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${size})`}/>
      <path d="M7.97461 24.9248C8.727 23.4428 9.87506 22.1981 11.2915 21.3287C12.708 20.4592 14.3376 19.999 15.9996 19.999C17.6616 19.999 19.2912 20.4592 20.7077 21.3287C22.1242 22.1981 23.2722 23.4428 24.0246 24.9248" stroke={props.color || "white"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${size})`}/>
    </svg>
  )
}
