import React, { FormEvent, useEffect, useState } from "react";
import { Button, Form, Container, Row, Col, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Contract } from "web3-eth-contract";
import { navigate } from 'gatsby';


type MintButtonProps = {
  accountAddress: null | string,
  contract: Contract
}

const MintButton: React.FC<MintButtonProps> = ({ accountAddress, contract }) => {
  // General state
  const [isLoading, setLoading] = useState(false);
  const [shouldShowPurhcaseModal, setShouldShowPurchaseModal] = useState<boolean>(false);
  const [shouldShowError, setShouldShowError] = useState<boolean>(false);

  // Contract state
  const [hasSaleStarted, setHasSaleStarted] = useState(false);
  const [currentSupply, setCurrentSupply] = useState<number>(0);
  const [supplyLimit, setSupplyLimit] = useState<number>(0);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);

  // Function to actually do the minting
  const mintMoodyMartian = () => {
    return contract.MARTIAN_PRICE().then((currentPrice: number) => {
      return contract.buyMartian({ from: accountAddress, value: currentPrice });
    });
  }

  // Sets initial price
  useEffect(() => {
    if (contract) {
      contract.MARTIAN_PRICE().then((currentPrice: number) => {
        setPriceEstimate(currentPrice / 1000000000000000000);
      });
    }
  }, [contract]);

  useEffect(() => {
    // Buy martian
    if (isLoading) {
      mintMoodyMartian().then(() => {
        setLoading(false);
        setShouldShowPurchaseModal(false);
        navigate("/success");
      }).catch(e => {
        setLoading(false);
        setShouldShowError(true);
      });
    }
    if (contract) {
      contract.totalSupply().then((supply) => {
        setCurrentSupply(supply.toNumber());
      });

      contract.MARTIAN_LIMIT().then((martianLimit) => {
        setSupplyLimit(martianLimit.toNumber());
      });

      contract.hasSaleStarted().then((hasSaleStarted: boolean) => {
        setHasSaleStarted(hasSaleStarted);
      });
    }
  }, [contract, isLoading, currentSupply]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  }

  const ethScanAddressLink = `https://etherscan.io/address/${accountAddress}`

  const mintButton = (
    <>
      <Modal
        show={shouldShowPurhcaseModal}
        onHide={() => setShouldShowPurchaseModal(false)}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Container>
            <Row>
              <Col>
                <Modal.Title>Purchase a Moody Martian</Modal.Title>
              </Col>
            </Row>
          </Container>
        </Modal.Header>

        <Form inline noValidate onSubmit={onSubmit}>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <p>Your connected address is <a href={ethScanAddressLink} target="_blank" className="primary-color">{accountAddress}</a>.</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>
                    There are currently {currentSupply}/{supplyLimit} Moody Martians minted.
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p className="price-estimate">Price Estimate: {priceEstimate}Ξ</p>
                </Col>
              </Row>
              {shouldShowError &&
                <Row>
                  <Col>
                    <p className="error-text">An error occurred during your purchase. Please try again and post in the Discord if this issue persists.</p>
                  </Col>
                </Row>
              }
            </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShouldShowPurchaseModal(false)}
              className="martian-button-outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !hasSaleStarted}
              className="martian-button-fill"
            >
              {isLoading ? 'Loading…' : 'Purchase'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <OverlayTrigger key="bottom" placement="bottom" overlay={
        !hasSaleStarted ?
        <Tooltip className="mint-tooltip" id="tooltip-disabled">
          Moody Martians will be available soon!
        </Tooltip> : <div />
      }>
        <div className="d-inline-block">

          <Button
            variant="outline-primary"
            disabled={!hasSaleStarted}
            className="martian-button"
            onClick={() => setShouldShowPurchaseModal(true)}
            style={!hasSaleStarted ? { pointerEvents: 'none', color:"#c6538c" } : undefined}
          >
            Purchase
          </Button>
        </div>
      </OverlayTrigger>
    </>
  )
  return mintButton;
}

export default MintButton;
