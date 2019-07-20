import React from 'react';
import { Spinner } from 'react-bootstrap';

class WithdrawItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTxid: false
    };
  }

  renderTxid = () => {
    return (
      <tr>
        <td colSpan="6" style={{ textAlign: 'center' }}>
          Txid: <br />
          <span style={{ color: '#03d99f', fontWeight: 'bold' }}>
            0x1a706ab6789ac9b08e96181f06caa79b367348079e4fafece655473c88c93a15
          </span>
        </td>
      </tr>
    );
  };

  renderStatus = status => {
    if (status === 'Compeleted') return <td style={{ color: '#03d99f' }}>{status}</td>;
    if (status === 'Confirming')
      return (
        <td style={{ display: 'flex', marginTop: 10 }}>
          <Spinner animation="border" variant="warning" size="sm" style={{ width: 20, height: 20, marginRight: 3 }} />
          <span style={{ color: '#f4ca54' }}>{status}</span>
        </td>
      );
  };

  render() {
    const { coin, index } = this.props;
    return (
      <>
        <tr key={index} style={{ cursor: 'pointer' }} onClick={() => this.setState({ showTxid: !this.state.showTxid })}>
          {this.renderStatus(coin.status)}
          <td>{coin.coin}</td>
          <td style={{ color: '#ff6f75' }}>{coin.amount}</td>
          <td>{coin.date}</td>
          <td>
            Address: <br /> {coin.infomation}
          </td>
          <td>
            <i className={`fa ${this.state.showTxid ? 'fa-arrow-up' : 'fa-arrow-down'}`} />
          </td>
        </tr>
        {this.state.showTxid && this.renderTxid()}
      </>
    );
  }
}

export default WithdrawItem;
