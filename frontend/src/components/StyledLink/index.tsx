import styled from 'styled-components'
import { Link } from 'react-router-dom'

const StyledLink = styled(Link)`
  color: black;
  opacity: 1;
  text-decoration: none;
  font-size: '18px';
  &:hover {
    color: black;
    opacity: 0.7;
  };
  &.selected {
    color: black;
    opacity: 0.7;
  };
`

export default StyledLink
