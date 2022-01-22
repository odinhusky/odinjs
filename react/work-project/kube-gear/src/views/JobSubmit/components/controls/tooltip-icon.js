/*
 * Copyright (c) Microsoft Corporation
 * All rights reserved.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react';
import {
  DirectionalHint,
  TooltipHost,
  Icon
} from 'office-ui-fabric-react';
import PropTypes from 'prop-types';

export const TooltipIcon = ({ content, onClick, iconRef, ...props }) => {
  return (
    <>
      {
        onClick ?
          <div ref={iconRef}>
            <Icon
              iconName="Info"
              onClick={onClick}
              onMouseEnter={onClick}
              styles={{ root: { verticalAlign: 'middle', cursor: 'pointer' } }}
              {...props}
            />
          </div>
          :
          <TooltipHost
            calloutProps={{
              isBeakVisible: false,
              directionalHint: DirectionalHint.topAutoEdge,
              gapSpace: 8 // spacing.s1
            }}
            content={content}
            tooltipProps={React.isValidElement(content) ? {
              onRenderContent: () => content
            } : {}}
            {...props}
          >
            <Icon
              iconName="Info"
              styles={{ root: { verticalAlign: 'middle', cursor: 'pointer' } }}
            />
          </TooltipHost>
      }
    </>
  );
};

TooltipIcon.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string), PropTypes.node]),
  iconRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};
