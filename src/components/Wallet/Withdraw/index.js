import React from 'react';
import { Button, Container, Row, Col, Card, Form, Image, InputGroup, Table } from 'react-bootstrap';
import Select from 'react-select';
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

const option = (styles, isDisabled, isFocused, isSelected) => ({
  alignItems: 'center',
  display: 'flex',
  backgroundColor: isDisabled ? null : isSelected ? '#ff6f75' : isFocused ? '#ff6f75' : null,
  opacity: isSelected ? '1.0' : isFocused ? '0.4' : null
});

const customStyles = {
  control: styles => ({ ...styles, ...control() }),
  menu: base => ({
    ...base,
    zIndex: 100
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    ...option(styles, isDisabled, isFocused, isSelected)
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
      validated: false,
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

  handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  };

  render() {
    const { coin, options, validated } = this.state;
    return (
      <>
        <div className="title flex justify-content-between align-items-center">
          <div>
            <div>
              <span className="title-page">Withdraw</span>
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
                          <td colSpan="2" height={80}>
                            <span className="text-notice">
                              Do not withdraw directly to a crowdfund or ICO address, as your account will not be
                              credited with tokens from such sales.
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col className="mt-3" lg={6} xs={12}>
                    <Card className="mt-4 ml-3 card-deposit">
                      <Card.Body>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={e => this.handleSubmit(e)}
                          method="post"
                          encType="multipart/form-data">
                          <Card.Title className="card-title">Withdraw: </Card.Title>
                          <Form.Group controlId="validationCustomUsername">
                            <InputGroup className="mb-3">
                              <Form.Control
                                className="input-address"
                                type="text"
                                placeholder={`Recipient's ${coin.value} Address`}
                                aria-label={`Recipient's ${coin.value} Address`}
                                aria-describedby="basic-addon2"
                                required
                              />
                              <InputGroup.Append>
                                <InputGroup.Text className="input-append-text" id="basic-addon2">
                                  {coin.value} Address
                                </InputGroup.Text>
                              </InputGroup.Append>
                              <Form.Control.Feedback type="invalid">
                                Please enter Recipient's Address
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                          <Form.Group controlId="validationCustomUsername">
                            <InputGroup className="mb-3">
                              <Form.Control
                                className="input-address"
                                type="text"
                                placeholder="Amount"
                                aria-label="Amount"
                                aria-describedby="basic-addon2"
                                required
                              />
                              <InputGroup.Append>
                                <InputGroup.Text className="input-append-text" id="basic-addon2">
                                  <span>
                                    Available Balance:{' '}
                                    <strong style={{ color: '#000' }}> 0.00000907 {coin.value}</strong>
                                  </span>
                                </InputGroup.Text>
                              </InputGroup.Append>
                              <Form.Control.Feedback type="invalid">
                                Amount to withdraw must be at least 0.00200000
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                          <Row className="mt-3">
                            <Col className="ml-2" xs={12}>
                              <span className="text-notice">Minimum Withdrawal: 0.00200000 {coin.value}</span>
                            </Col>
                            <Col xs={10}>
                              <Table className="mt-3" responsive="lg">
                                <tbody>
                                  <tr>
                                    <td style={{ width: '40%' }}>Transaction Fee:</td>
                                    <td style={{ width: '60%' }}>
                                      <strong>0.0005 {coin.value}</strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>You Will Get:</td>
                                    <td>
                                      <strong>0.00000000 {coin.value}</strong>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Col>
                            <Col className="text-center mt-3" xs={2}>
                              <Image
                                src={coin.icon}
                                alt={coin.label}
                                style={{ padding: '0.5em', border: '1px solid #65efc7' }}
                                roundedCircle
                                thumbnail
                              />
                            </Col>
                          </Row>
                          <Button type="submit" className="submit-button" size="lg" block>
                            Submit form
                          </Button>
                        </Form>
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
