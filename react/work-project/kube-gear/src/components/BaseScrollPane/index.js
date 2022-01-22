import React from 'react';
import PropTypes from 'prop-types';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
`

export const BaseScrollPane = ({ children, ...props }) => {
  return (
    <Wrapper {...props}>
      <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
        {children}
      </ScrollablePane>
    </Wrapper>
  )
}

BaseScrollPane.propTypes = {
  children: PropTypes.node
}

export default BaseScrollPane;