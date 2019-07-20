import React from 'react';
import { Alert, Button, Container, Row, Col, Card, Image, Table, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import './styles.scss';

const control = () => ({
  borderColor: '#65efc7',
  boxShadow: '0 0 0 1px #65efc7',

  ':hover': {
    borderColor: '#00d99f',
    boxShadow: '0 0 0 1px #00d99f'
  }
});
const singleValue = () => ({
  alignItems: 'center',
  display: 'flex'
});

const option = (isDisabled, isFocused, isSelected) => ({
  alignItems: 'center',
  display: 'flex',
  backgroundColor: isDisabled ? null : isSelected ? '#ff6f75' : isFocused ? '#fbabae' : null,
  color: isSelected ? '#fff' : isFocused ? '#fff' : null
  // opacity: isSelected ? '1.0' : isFocused ? '0.4' : null
});

const customStyles = {
  control: styles => ({ ...styles, ...control() }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    ...option(isDisabled, isFocused, isSelected)
  }),
  singleValue: styles => ({ ...styles, ...singleValue() })
};

function getLabel({ icon, label }) {
  // option has keys `icon`, `label` and `value`
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <Image src={icon} alt={label} style={{ marginRight: 8, height: 30, width: 30 }} roundedCircle thumbnail />
      <span style={{ fontSize: 14 }}>{label}</span>
    </div>
  );
}

class Deposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      show: false,
      coin: {
        value: 'BTC',
        label: 'BTC Bitcoin',
        icon: 'http://cryptocompare.com/media/19633/btc.png',
        address: '1KQtmA9y8hD6FdFGD2v6aUWppycKwjqe1o'
      },
      options: [
        {
          value: 'BTC',
          label: 'BTC Bitcoin',
          icon: 'http://cryptocompare.com/media/19633/btc.png',
          address: '1KQtmA9y8hD6FdFGD2v6aUWppycKwjqe1o'
        },
        {
          value: 'ETH',
          label: 'ETH Ethereum',
          icon: 'http://cryptocompare.com/media/20646/eth_logo.png',
          address: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          value: 'NOVA',
          label: 'NOVA Novalex',
          icon: `${require('../../../images/icon.png')}`,
          address: '0xe92f2bcd8db33dee683790e517e3540ff6e2ba01'
        },
        {
          value: 'TOMO',
          label: 'TOMO TOMOChain',
          icon: 'http://cryptocompare.com/media/30001748/tomo.jpg',
          address: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        }
      ]
    };
  }

  intervalID = 0;

  onChange = option => {
    this.setState({ coin: option });
  };

  handleClick = () => {
    this.intervalID = setTimeout(() => {
      this.setState({ copied: false });
    }, 5000);
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    const { coin, options } = this.state;
    const handleDismiss = () => {
      this.setState({ copied: false });
      clearTimeout(this.intervalID);
    };
    return (
      <>
        <div className="title flex justify-content-between align-items-center">
          <div>
            <div>
              <span className="title-page">Deposit</span>
            </div>
          </div>
        </div>

        <div className="flex-column flex-1 ">
          <div className="grid flex-2">
            <div className="orders flex-1 position-relative overflow-hidden">
              <Container>
                <Row>
                  <Col className="mt-3" lg={6} xs={12}>
                    <span>Coin</span>
                    <Select
                      className="mt-2"
                      defaultValue={options[0]}
                      label="Single select"
                      formatOptionLabel={getLabel}
                      options={options}
                      onChange={option => {
                        if (option && !Array.isArray(option)) {
                          this.onChange(option);
                        }
                      }}
                      styles={customStyles}
                    />
                    <Table className="mt-3" responsive="lg">
                      <tbody>
                        <tr>
                          <td>Total balance:</td>
                          <td>
                            <strong>0.00000907 {coin.value}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>In order:</td>
                          <td>
                            <strong>0.00000000 {coin.value}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td>Available balance:</td>
                          <td>
                            <strong>0.00000907 {coin.value}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td height={80}>Go to Trade</td>
                          <td>
                            <a href="#" className="trade-link mr-3">
                              HOT/DAI
                            </a>
                            <a href="#" className="trade-link mr-3">
                              WETH/DAI
                            </a>
                            <a href="#" className="trade-link mr-3">
                              HOT/WETH
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2" height={40}>
                            <span>Coins will be deposited after 30 network confirmations.</span>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col className="mt-3" lg={6} xs={12}>
                    <Card className="mt-4 ml-3 card-deposit">
                      <Card.Body>
                        <Card.Title className="card-address">{coin.value} Address: </Card.Title>
                        <Card.Subtitle className="mb-2 text-address">{coin.address}</Card.Subtitle>
                        <CopyToClipboard text={coin.address} onCopy={() => this.setState({ copied: true })}>
                          <Button variant="outline-secondary" onClick={() => this.handleClick()}>
                            <i className="fa fa-address-card" aria-hidden="true" /> Copy Address
                          </Button>
                        </CopyToClipboard>
                        <Button className="ml-3" variant="outline-secondary" onClick={() => this.handleShow()}>
                          <i className="fa fa-qrcode" aria-hidden="true" /> Show QR Code
                        </Button>
                        <Alert
                          show={this.state.copied}
                          className="mt-3"
                          style={{ width: 'fit-content' }}
                          variant="success"
                          onClose={handleDismiss}
                          dismissible>
                          Copied to clipboard
                        </Alert>
                        <Modal
                          show={this.state.show}
                          onHide={this.handleClose}
                          aria-labelledby="contained-modal-title-vcenter"
                          centered>
                          <Modal.Header closeButton>
                            <Modal.Title>
                              <span className="card-address">{coin.value} Address: </span>
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="text-center">
                            <QRCode value={coin.address} />
                            <br />
                            <span className="mb-2 text-address">{coin.address}</span>
                          </Modal.Body>
                        </Modal>
                        <Row className="mt-3">
                          <Col xs={10}>
                            <strong>Send only {coin.value} to this deposit address.</strong>
                            <br />
                            <span>
                              Sending coin or token other than {coin.value} to this address may result in the loss of
                              your deposit.
                            </span>
                          </Col>
                          <Col className="text-center mt-2" xs={2}>
                            <Image
                              src={coin.icon}
                              alt={coin.label}
                              style={{ padding: '0.5em', border: '1px solid #65efc7' }}
                              roundedCircle
                              thumbnail
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Deposit;
