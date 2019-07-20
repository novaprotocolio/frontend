import React from 'react';
import { loginRequest, login } from '../../actions/account';
import { updateCurrentMarket } from '../../actions/markets';
import { updateCurrentPage } from '../../actions/page';
import { connect } from 'react-redux';
import { WalletButton, getSelectedAccount } from 'sdk-wallet';
import './styles.scss';
import { loadAccountNovaAuthentication } from '../../lib/session';

const mapStateToProps = state => {
  const selectedAccount = getSelectedAccount(state);
  const address = selectedAccount ? selectedAccount.get('address') : null;
  return {
    address,
    isLocked: selectedAccount ? selectedAccount.get('isLocked') : true,
    isLoggedIn: state.account.getIn(['isLoggedIn', address]),
    currentMarket: state.market.getIn(['markets', 'currentMarket']),
    markets: state.market.getIn(['markets', 'data'])
  };
};

class Header extends React.PureComponent {
  componentDidMount() {
    const { address, dispatch } = this.props;
    const novaAuthentication = loadAccountNovaAuthentication(address);
    if (novaAuthentication) {
      dispatch(login(address));
    }
  }
  componentDidUpdate(prevProps) {
    const { address, dispatch } = this.props;
    const novaAuthentication = loadAccountNovaAuthentication(address);
    if (address !== prevProps.address && novaAuthentication) {
      dispatch(login(address));
    }
  }
  render() {
    const { currentMarket, markets, dispatch } = this.props;
    return (
      <div className="navbar bg-gray navbar-expand-lg">
        <img
          className="navbar-brand"
          src={require('../../images/logo.png')}
          style={{ cursor: 'pointer' }}
          onClick={() => dispatch(updateCurrentPage('index'))}
          alt="Novalex"
        />
        <div className="dropdown navbar-nav mr-auto">
          <button
            className="btn btn-primary header-dropdown dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            {currentMarket && currentMarket.id}
          </button>
          <div
            className="dropdown-menu"
            aria-labelledby="dropdownMenuButton"
            style={{ maxHeight: 350, overflow: 'auto' }}>
            {markets.map(market => {
              return (
                <button
                  className="dropdown-item"
                  key={market.id}
                  onClick={() => currentMarket.id !== market.id && dispatch(updateCurrentMarket(market))}>
                  {market.id}
                </button>
              );
            })}
          </div>
        </div>
        <button
          className="btn btn-primary collapse-toggle"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-collapse"
          aria-expanded="false">
          <i className="fa fa-bars" />
        </button>
        <div className="collapse" id="navbar-collapse">
          <button className="btn btn-primary item" onClick={() => dispatch(updateCurrentPage('coin-market'))}>
            MARKET
          </button>
          <button className="btn btn-primary item" onClick={() => dispatch(updateCurrentPage('deposit'))}>
            DEPOSIT
          </button>
          <button className="btn btn-primary item" onClick={() => dispatch(updateCurrentPage('withdraw'))}>
            WITHDRAW
          </button>
          <a
            href="http://dex.novalex.vn/docs/index.html"
            className="btn btn-primary item"
            target="_blank"
            rel="noopener noreferrer">
            DOCUMENTATION
          </a>
          <div className="item">
            <WalletButton />
          </div>

          {this.renderAccount()}
        </div>
      </div>
    );
  }

  renderAccount() {
    const { address, dispatch, isLoggedIn, isLocked } = this.props;
    if ((isLoggedIn && address) || isLocked) {
      return null;
    } else if (address) {
      return (
        <button className="btn btn-success" style={{ marginLeft: 12 }} onClick={() => dispatch(loginRequest())}>
          connect
        </button>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps)(Header);