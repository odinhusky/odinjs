import { IContainer } from "../../index"
import cx from "../../../../utils/cx"
import styled from "styled-components"
import { HTMLAttributes, useEffect, useRef } from "react"
import { uiSlice } from "../../../../../reduxStore/uiSlice"
import { useDispatch } from "react-redux"

export const U7WidthContainer = ({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      <PageContainer className="!py-0 !my-0">{children}</PageContainer>
    </div>
  )
}

export const U7PageContainer = styled.div`
  margin: auto;
  max-width: 1360px;
  padding-bottom: 40px;
  box-sizing: border-box;

  @media (max-width: 1680px) {
    max-width: 1360px;
    //padding-right: 80px;
    //padding-left: 80px;
  }
  @media (max-width: 1600px) {
    max-width: 1200px;
    //padding-right: 80px;
    //padding-left: 80px;
  }
  @media (max-width: 1440px) {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding-right: 32px;
    padding-left: 32px;
    padding-bottom: 174px;
  }

  @media (max-width: 1220px) {
    width: 100%;
    max-width: 960px;
    margin: auto;
    padding-right: 32px;
    padding-left: 32px;
    padding-bottom: 174px;
  }

  @media (max-width: 980px) {
    width: 100%;
    max-width: 760px;
    margin: auto;
    padding-right: 32px;
    padding-left: 32px;
    padding-bottom: 174px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 680px;
    margin: auto;
    padding-right: 16px;
    padding-left: 16px;
    padding-bottom: 110px;
  }
`

/**
 *  mobile: '767px',
 *  tablet: '1439px',
 *  desktop: '7680px',
 * @param props
 * @constructor
 */
export const PageContainer = (props: IContainer) => {
  const isY = typeof props.y === "undefined" ? true : props.y
  // const {isMobile, isTablet} = useBreakpoint();
  const dispatch = useDispatch()
  const parentRef = useRef(null)
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        dispatch(
          uiSlice.actions.setPageContainerContentSize({
            contentWidth: entry.contentRect.width,
            contentHeight: entry.contentRect.height,
          })
        )
      }
    })

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current)
    }

    // Clean up the observer on component unmount
    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current)
      }
    }
  }, [])
  return (
    <U7PageContainer
      style={props.style}
      ref={parentRef}
      id={props.id}
      className={cx(
        // common
        "box-border mx-auto",
        // mobile
        // 'pb-[120px]',
        // tablet (960px)
        // 'mobile:pb-[100px]',
        // desktop (1360px)
        // 'tablet:pb-0',
        "flex-grow",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
    </U7PageContainer>
  )
}
