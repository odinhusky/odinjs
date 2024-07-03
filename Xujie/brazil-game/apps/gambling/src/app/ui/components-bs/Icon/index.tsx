import { environment } from 'apps/gambling/src/environments/environment';

export interface ISvgProps {
  color?: string;
  size?: string;
}
const Icon = ({
  className,
  name,
  onClick,
  size,
  color,
}: {
  className?: string;
  name: string;
  onClick?: () => void;
} & ISvgProps) => {
  try {
    const component = require(`./${environment.uVersion}/icon_${name}`);
    const Svg = component.default;
    return (
      <div className={`icon-${name} ${className} `} onClick={onClick}>
        <Svg size={size} color={color} />
      </div>
    );
  } catch {
    return <></>;
  }
};
export default Icon;
