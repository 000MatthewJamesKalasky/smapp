import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { DropDown, Tooltip, Dots } from '../../basicComponents';

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const AccItem = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  width: 100%;
  cursor: inherit;
`;

type Props = {
  selectAccountIndex: ({ index }: { index: number }) => void;
  selectFundAmount: ({ index }: { index: number }) => void;
  selectGasUnits: ({ index }: { index: number }) => void;
  selectGasPrice: ({ index }: { index: number }) => void;
  isDarkMode: boolean;
};

// TODO add auto update data
const accounts = [
  {
    id: 1,
    label: 'acc 1',
  },
  {
    id: 2,
    label: 'acc 2',
  },
];

const gasUnit = [
  {
    id: 1,
    label: '100',
  },
  {
    id: 2,
    label: '200',
  },
];

const unitPrice = [
  {
    id: 1,
    label: '1 Smidge',
  },
  {
    id: 2,
    label: '2 Smidge',
  },
];

const VaultTx = ({
  selectAccountIndex,
  selectFundAmount,
  selectGasUnits,
  selectGasPrice,
  isDarkMode,
}: Props) => {
  const ddStyle = {
    border: `1px solid ${isDarkMode ? smColors.white : smColors.black}`,
    marginLeft: 'auto',
    flex: '0 0 340px',
  };
  const ddStyleGasUnit = {
    border: `1px solid ${isDarkMode ? smColors.white : smColors.black}`,
    marginLeft: 'auto',
    flex: '0 0 140px',
  };
  const ddStyleGasPrice = {
    border: `1px solid ${isDarkMode ? smColors.white : smColors.black}`,
    marginLeft: 'auto',
    flex: '0 0 200px',
  };

  const renderAccElement = ({ label }: { label: string; text: string }) => (
    <AccItem key={label}>{label}</AccItem>
  );

  return (
    <>
      <DetailsRow>
        <DetailsText>Daily Spending Account</DetailsText>
        <Tooltip width={250} text="Tooltip 1" />
        <Dots />
        <DropDown
          data={accounts}
          onClick={selectAccountIndex}
          DdElement={({ label, text }) => renderAccElement({ label, text })}
          selectedItemIndex={0}
          rowHeight={40}
          style={ddStyle}
          bgColor={smColors.white}
        />
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Fund Amount</DetailsText>
        <Tooltip width={250} text="Tooltip 2" />
        <Dots />
        <DropDown
          data={accounts}
          onClick={selectFundAmount}
          DdElement={({ label, text }) => renderAccElement({ label, text })}
          selectedItemIndex={0}
          rowHeight={40}
          style={ddStyle}
          bgColor={smColors.white}
        />
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Max Gas Units</DetailsText>
        <Tooltip width={250} text="Tooltip 3" />
        <Dots />
        <DropDown
          data={gasUnit}
          onClick={selectGasUnits}
          DdElement={({ label, text }) => renderAccElement({ label, text })}
          selectedItemIndex={0}
          rowHeight={40}
          style={ddStyleGasUnit}
          bgColor={smColors.white}
        />
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Gas Unit Price</DetailsText>
        <Tooltip width={250} text="Tooltip 4" />
        <Dots />
        <DropDown
          data={unitPrice}
          onClick={selectGasPrice}
          DdElement={({ label, text }) => renderAccElement({ label, text })}
          selectedItemIndex={0}
          rowHeight={40}
          style={ddStyleGasPrice}
          bgColor={smColors.white}
        />
      </DetailsRow>
    </>
  );
};

export default VaultTx;
