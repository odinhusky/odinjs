// ^ Material-ui Componets(Functions)
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles } from '@material-ui/core/styles';

const BaseTooltip = withStyles({
  tooltip: {
    lineHeight: 1.5,
    letterSpacing: 0.5,
    fontSize: 14
  }
})(Tooltip);

export default BaseTooltip;