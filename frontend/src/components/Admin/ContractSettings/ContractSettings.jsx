import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';

const ContractSettings = ({
  hasLoaded,
  isUserTheOwner,
  isDevMode,
  isPaused,
  handleDevMode,
  handlePause,
}) => {
  if (hasLoaded) {
    if (isUserTheOwner) {
      return (
        <Container>
          <Row>
            <Col sm="12" md={{ size: 8, offset: 2 }}>
              <p>Development Mode: {isDevMode ? 'On' : 'Off'} (Unstable, only for testing!)</p>
              <Button color="warning" onClick={handleDevMode}>
                Toggle
              </Button>
              <p>Emergency Mode: {isPaused ? 'On' : 'Off'}</p>
              <Button color="warning" onClick={handlePause}>
                Toggle
              </Button>
            </Col>
          </Row>
        </Container>
      );
    }

    return (
      <p>You are not the owner of this contract.</p>
    );
  }

  return (
    <p>Loading...</p>
  );
};

export default ContractSettings;
