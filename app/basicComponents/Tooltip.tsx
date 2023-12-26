import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const InnerWrapper = styled.div<{
  top: number;
  left: number;
  width: number;
  hide: boolean;
}>`
  display: ${({ hide }) => (hide ? 'none' : 'block')};
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  padding: 13px 15px 10px 19px;
  background-color: ${({
    theme: {
      popups: {
        states: { infoTooltip },
      },
    },
  }) => infoTooltip.backgroundColor};
  border: 1px solid ${smColors.realBlack};
  z-index: 10;
  border-radius: ${({
    theme: {
      popups: { boxRadius },
    },
  }) => boxRadius}px;
`;

const InnerIcon = styled.img.attrs((props) => ({
  src: props.theme.icons.tooltip,
}))`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 13px;
  height: 13px;
`;

const Text = styled.div<{ affectTextCase?: boolean }>`
  font-size: 10px;
  line-height: 13px;
  text-transform: ${({ affectTextCase }) =>
    affectTextCase ? 'uppercase' : 'none'};
  white-space: pre-wrap;
  color: ${({
    theme: {
      popups: {
        states: { infoTooltip },
      },
    },
  }) => infoTooltip.color};
`;

const OuterIcon = styled.img.attrs((props) => ({
  src: props.theme.icons.tooltip,
}))`
  width: 13px;
  height: 13px;
  color: ${({
    theme: {
      popups: {
        states: { infoTooltip },
      },
    },
  }) => infoTooltip.color};
`;

const Wrapper = styled.div<{
  marginTop: number;
  marginLeft: number;
  disabled: boolean;
}>`
  position: relative;
  margin-left: ${({ marginLeft }) => marginLeft}px;
  display: inline-block;
  margin-top: ${({ marginTop }) => marginTop}px;
  ${({ disabled }) =>
    !disabled &&
    `
    &:hover ${InnerWrapper} {
      display: block;
    }
  `}
`;

type Props = PropsWithChildren<{
  top?: number;
  left?: number;
  width: number;
  marginTop?: number;
  marginLeft?: number;
  text: string;
  hide?: boolean;
  affectTextCase?: boolean;
  disabled?: boolean;
}>;

const Tooltip = ({
  width,
  text,
  top = -2,
  left = -3,
  marginTop = 2,
  marginLeft = 5,
  hide = true,
  disabled = false,
  affectTextCase,
  children,
}: Props) => (
  <Wrapper marginTop={marginTop} marginLeft={marginLeft} disabled={disabled}>
    {children ?? <OuterIcon />}
    <InnerWrapper top={top} left={left} width={width} hide={hide}>
      <InnerIcon />
      <Text affectTextCase={affectTextCase}>{text}</Text>
    </InnerWrapper>
  </Wrapper>
);

export default Tooltip;
