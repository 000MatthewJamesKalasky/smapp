import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CorneredContainer } from '../../components/common';
import { Button, Link } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { MainPath, WalletPath } from '../../routerPaths';
import { setLastSelectedWalletPath } from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { isLocalNodeApi } from '../../../shared/utils';
import { CreateWalletParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const SubHeader = styled.div`
  color: ${({ theme }) => theme.color.contrast};
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const WalletCreated = ({ history, location }: CreateWalletParams) => {
  useEffect(() => {
    // Store create wallet to localStorage to choose it
    // in the dropdown next time
    setLastSelectedWalletPath(location.state.path);
  }, [location]);

  const nextAction = () => {
    eventsService.createWalletFinish(location.state);
    if (
      location?.state?.genesisID &&
      typeof location?.state?.apiUrl === 'string' &&
      isLocalNodeApi(location.state.apiUrl)
    ) {
      history.push(MainPath.SmeshingSetup);
      return;
    }
    history.push(WalletPath.Overview);
  };

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  return (
    <Wrapper>
      <Steps step={Step.WALLET_CREATED} />
      <CorneredContainer width={650} height={340} header={'WALLET CREATED'}>
        <SubHeader>
          Your wallet was created and saved in a password-protected file
          <br />
          <br />
          <Link
            onClick={() =>
              eventsService.showFileInFolder({ filePath: location.state.path })
            }
            text="Browse file location"
          />
        </SubHeader>
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET GUIDE" />
          <Button onClick={nextAction} text="Go to Wallet!" width={125} />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default WalletCreated;
