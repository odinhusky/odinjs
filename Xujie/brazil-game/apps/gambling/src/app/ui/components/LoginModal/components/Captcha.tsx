import Icon from "./Icon"

type ICaptcha = {
  imgSrc: string | null
  onClick: () => void
  isLoading: boolean
  reloadText: string
}

const Captcha = (props: ICaptcha) => {
  return (
    <div className="mode-captcha">
      {props.isLoading ? (
        <div className="captcha-loading">
          <Icon name="loading" />
        </div>
      ) : (
        <>
          {props.imgSrc ? (
            <div className="captcha-image">
              <img
                src={props.imgSrc!}
                onClick={() => {
                  props.onClick()
                }}
              />
            </div>
          ) : (
            <div
              className="captcha-reload"
              onClick={() => {
                props.onClick()
              }}
            >
              <Icon name="reload" />
              {props.reloadText}
            </div>
          )}
        </>
      )}
    </div>
  )
}
export default Captcha
