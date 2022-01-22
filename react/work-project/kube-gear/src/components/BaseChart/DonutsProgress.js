/* eslint-disable */
import React, { useState, useEffect } from 'react';

// ^ Material-ui Componets(Functions)
import { theme } from 'theme';

// ? styles
import { makeStyles } from '@material-ui/core/styles'
import commonStyle from 'common/commonStyles'

const useStyles = makeStyles((theme) => {
  return {
    ...commonStyle(theme),
    figureDefault: {
      width: 80
    }
  }
});

// ^ Plugins
import PropTypes from 'prop-types';

/**
 * @author odin
 * @level Any/DonutsProgress
 * @param {String} className -- <figure> tag className
 * @param {String} trailStrokeColor -- Trail circle Color
 * @param {String} strokeColor -- Progress circle color
 * @param {Number} percentage -- Progress percentage
 * @param {String} innerText -- Text below 'percentage %'
 * @component DonutsProgress
 * @description DonutsProgress
*/
export default function DonutsProgress({
  className,
  trailStrokeColor,
  strokeColor,
  strokeWidth,
  percentage,
  innerText
 }) {

  // $ init data
  const INITIAL_OFFSET = 25
  const circleConfig = {
    viewBox: '0 0 38 38',
    x: '19',
    y: '19',
    radio: '15.91549430918954'
  }

  // # state
  const [progressBar, setProgressBar] = useState(0)

  // = styles
  const classes = useStyles();

  // - methods
  /**
   * @author odin
   * @description Increase progressBar 
  */
  const updatePercentage = () => {
    setTimeout(() => {
      setProgressBar(progressBar + 1)
    }, 5)
  }

  // * hooks
  /**
   * @author odin
   * @description triggered when percentage prop is changed. This is needed instead of a simple [], that will be on mount, because if you use this component in combination with a backend service you first will pass percentage={0} and later in async mode, a value.
  */
  useEffect(() => {
    if (percentage > 0) updatePercentage()
  }, [percentage])

  /**
   * @author odin
   * @description triggered when the progessBar is modified.
  */
  useEffect(() => {
    if (progressBar < percentage) updatePercentage()
  }, [progressBar])

  return (
    <figure className={`${classes.figureDefault} ${className}`}>
      <svg viewBox={circleConfig.viewBox}>
        <circle
          className="ring"
          cx={circleConfig.x}
          cy={circleConfig.y}
          fill="transparent"
          r={circleConfig.radio}
          stroke={trailStrokeColor || theme.defaultChartTrailColor}
          strokeWidth={strokeWidth}
        />

        <circle
          className="path"
          cx={circleConfig.x}
          cy={circleConfig.y}
          fill="transparent"
          r={circleConfig.radio}
          stroke={strokeColor}
          strokeDasharray={`${progressBar} ${100 - progressBar}`}
          strokeDashoffset={INITIAL_OFFSET}
          strokeWidth={strokeWidth}
        />
        <g
          className="circle-label"
          style={{ transform: 'translateY(0.35em)' }}
        >
          <text
            className="circle-percentage"
            style={{
              fontSize: '0.6em',
              lineHeight: 1,
              textAnchor: 'middle',
              transform: 'translateY(-0.25em)'
            }}
            x="50%"
            y="50%"
          >
            {progressBar}%
          </text>
          { innerText &&
            <text
            className="circle-text"
            style={{
              fontSize: '0.2em',
              textTransform: 'uppercase',
              textAnchor: 'middle',
              transform: 'translateY(0.9em)'
            }}
            x="50%"
            y="50%"
          >
            {innerText}
          </text>
          }
        </g>
      </svg>
    </figure>
  );
}


DonutsProgress.propTypes = {
  className: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  trailStrokeColor: PropTypes.string,
  strokeColor: PropTypes.string,
  innerText: PropTypes.string
}
