import { Button, ButtonProps } from 'reactstrap'
import styled from 'styled-components'

export interface ButtonTransparentProps extends ButtonProps {
  height: string
  width?: string
  fontSize: string
}

export const ButtonTransparent = styled(Button)<ButtonTransparentProps>`
  display: block;
  width: ${(props) => props.width ?? props.height};
  height: ${(props) => props.height};
  line-height: ${(props) => props.height};
  font-size: ${(props) => props.fontSize};
  padding: 0;
  margin: 4px 0;
  background-color: transparent;
  background-image: none;
  color: #cccccc;
  border: none;
  border-radius: 0;
  box-shadow: none;
  border-image: none;
  text-decoration: none;

  &:active,
  &:hover,
  &:focus,
  &:focus-within {
    background-color: transparent;
    background-image: none;
    color: #fff;
    text-decoration: none;
  }
`
