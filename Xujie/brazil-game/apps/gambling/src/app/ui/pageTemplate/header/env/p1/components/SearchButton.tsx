import {PageOrModalPathEnum} from "../../../../../PageOrModalPathEnum";
import React from "react";
import {useNavigate} from "react-router";
import { useDispatch } from "react-redux";
import { appSlice } from "../../../../../../reduxStore/appSlice";

export const SearchButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(appSlice.actions.setShowGameSearchModal(true))}>
      <img alt={"search"} className={"w-[22.5px] h-[22.5px]"} src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABWxJREFUWMPtmF+IXOUZh5/fmT/bZDaycWd2e2OpMRW10ilIWwy4UCdIA5WElhbEQsWApYhSCq3QWAn2rorEFhNrxdZQLNhoaexFSzdIakBFamrvqiWEKlHbCYnOTrJ7zve9rxdnz+xsmmazOxM3F3nhMGdmznzznN/3/j1wyS7ZItNyf+AdGtlpbo1wk8M1UUw4VE3qmHPUpMOZ2/Qn6xyUsFUDTt+nKbHDxLboVIycJgoc8vP5VwNcesfEo7rcHrtCnP7YgN2phDY/NeeeCCXrQQnTAmDvUN/3+fujniR3fGZ9OHjBgf1dGlmJfRGmzgLqBkccjsWEGXcmo3RldNb3wL13A5mLez97uT1+wYA779KolHg5wlV9amHwlvBHIuxvNDh2xm4k/z7BjYHk9gDbzan274TLH/j8evvJ0IHdqcy2mY7OVAHrYi5KPxwft90SYamF3zzJhsxLv4jO5sK3HdwTvvmFsbhvpcDJ2T7sHueh4ExFRBQE+K8lfnO9bj87H1iAq8c48p+/xy0RHovzARlAwfXrlz4cuXpoCs+8T9MS/a0vwOaSkdKXxy8LL6/0T149WXkmut9WxAHiT1NjYctQFA4l3R+gVKji0g8GgQWInWy7iX8Wa2bwlQOnKl8cGLjToWGwNeTbRxRvNsZtz6CRvekKThu+IwAhdzFC4K6BgdOUWzOnEucLQkz0yPn67FI2NRafi9K/eiq7b3NffqVdDOzJTbkKIiC3aC8Ms6xawh8CKtYff2Gmet1AwCa/JkpFiT3yqTPy7MDA2KGoXOEIZDFeu9w1youCQ5oIXkSyhgoLEMvJsZAVJVx4kkzk6CsEzpzqQlViZtjAc1Fdw7GFNq40kMIGnTDfLyCfHDawYZNB6nV3Lh0fyIcz6WiRIYLrymd9+QqcyzLKGyN52gmC4Ml7AwFHdLgIugDrN5wo3zhchX1LL+ik4KOzrw1W6cRfiqIRgCzx24cF+1SHRobfslA8/PXtojMQ8PVj4a8R3omCKGHozpdm2TCcUWFkR4S1ERERJu0duNJJmJW1q/CzzKmG2fITL/ri4FyuPXFqzaYI382LBkRx0rtzTw+l+bF1YXfAj+YqQ4DW3IeVXSuF3XPiE5+2aM9nTrXnvwk7755YWdr8H+BN4nQs644IWe7LIjp3//GD6jPPvs2a5SpLxV+JYnL+5jHplRNr5n4+1Ab+5nXhYED35v5WKO23VS6rHN7XqX596QAbbTw+M7IrmL0YYLLX/eVutrHWrV1/QYbQ/R+UH3C0M4IWZjPHpbeifL9Lh0x+bC6qK5JJg42e+BZzbjFYu3iaVu88ojaetHaMdv8x9DH/+U71G9H9Vwa13jDaN85HwItnFIvG/IXrHL0aYaPBeN/03caT1s5lQidLXfC1denvnOSGKP25P0f3/LuoXEUPTd8hTpr4Xnft7CYqpVaE41HMZwqvZ4kd+NFM7XMX7FHV3lOVL0XTXQZbo2u8UDBXuRipCIZeN3zvqe7c0zv7ssGDaa0Zgk1HqPeeW6C2l9R6eOT8lNZKHN8d/TKtXpelXGuJJtwou5J26v6ejc6+dt85KtiP01ozC37A5OML47/anqj16HlAi1Ww+9JaM0Sfjni9LxjbLrX2LAG9KsAA309rzWCeu8dCkLZdaj15DuhVAwa4J601U3zabN6ngehqI1p7/w/0qgIDfCetNTN82lz1vlTYdqf127NArzowwJ1prZmJ6dintIu2Ga3nzoC+KIABvjUPbU69SJMmtd28tb8POrlYgH9T7b6RltkcpHaUMAmgrpJ2L6vSfZz2e3XfoOybEe18//1tlbJvc7HbV9Nac2sYPbRtduQqLtklO7d9BNWLAbpCEviQAAAAAElFTkSuQmCC"}/>
    </button>
  )
}
