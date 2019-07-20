import React from 'react';
import { connect } from 'react-redux';
import { loadMarkets, loadTradeHistory } from './actions/markets';
import Header from './components/Header';
import WebsocketConnector from './components/WebsocketConnector';
import OrderBook from './components/Orderbook';
import Trade from './components/Trade';
import Wallet from './components/Wallet';
import Deposit from './components/Wallet/Deposit';
import HistoryDeposit from './components/Wallet/Deposit/HistoryDeposit';
import Withdraw from './components/Wallet/Withdraw';
import HistoryWithdraw from './components/Wallet/Withdraw/HistoryWithdraw';
import Orders from './components/Orders';
import Charts from './components/Charts';
import MarketCoin from './components/MarketCoin';
import TableMarket from './components/MarketCoin/TableMarket';
import TradeHistory from './components/TradeHistory';
import { NovaWallet } from 'sdk-wallet/build/wallets';
import { watchWallet } from 'sdk-wallet/build/actions/wallet';
import env from './lib/env';
import MediaQuery from 'react-responsive';
import Fold from './components/Fold';
import PerfectScrollbar from 'perfect-scrollbar';
import { Wallet as SDKWallet } from 'sdk-wallet';
import 'sdk-wallet/index.css';

const mapStateToProps = state => {
  const selectedAccountID = state.WalletReducer.get('selectedAccountID');
  return {
    selectedAccountID,
    currentMarket: state.market.getIn(['markets', 'currentMarket']),
    networkId: state.WalletReducer.getIn(['accounts', selectedAccountID, 'networkId']),
    page: state.page
  };
};

class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      mobileTab: 'trade'
    };
  }

  componentDidMount() {
    const { dispatch, currentMarket } = this.props;
    dispatch(loadMarkets());
    if (parseInt(env.NETWORK_ID) === 66) {
      this.initTestBrowserWallet();
    }
    if (currentMarket) {
      dispatch(loadTradeHistory(currentMarket.id));
    }
  }

  componentDidUpdate(prevProps) {
    const { currentMarket, dispatch } = this.props;
    if (currentMarket !== prevProps.currentMarket) {
      dispatch(loadTradeHistory(currentMarket.id));
    }
  }

  async initTestBrowserWallet() {
    NovaWallet.setNodeUrl(env.NODE_URL);
    const wallet = await NovaWallet.import(
      'B7A0C9D2786FC4DD080EA5D619D36771AEB0C8C26C290AFD3451B92BA2B7BC2C',
      '123456'
    );
    this.props.dispatch(watchWallet(wallet));
  }

  render() {
    const { currentMarket, networkId, selectedAccountID } = this.props;
    if (!currentMarket) {
      return null;
    }

    return (
      <div className="app">
        <SDKWallet title="Starter Kit Wallet" nodeUrl={env.NODE_URL} defaultWalletType="Nova-Wallet" />
        <WebsocketConnector />
        <Header />
        {networkId && selectedAccountID === 'EXTENSION' && parseInt(networkId, 10) !== parseInt(env.NETWORK_ID, 10) && (
          <span className="network-warning bg-warning text-white text-center" style={{ padding: 4 }}>
            Network Error: Switch Metamask's network to {this.getNetworkName()}.
          </span>
        )}
        {this.renderPage()}
      </div>
    );
  }

  renderPage() {
    switch (this.props.page) {
      case 'index':
        return this.renderIndex();
      case 'coin-market':
        return this.renderCoinMarket();
      case 'deposit':
        return this.renderDeposit();
      case 'withdraw':
        return this.renderWithdraw();
      default:
        return this.renderIndex();
    }
  }

  renderCoinMarket() {
    return (
      <>
        <MediaQuery minWidth={1200}>{this.renderCoinMarketDesktop()}</MediaQuery>
        <MediaQuery minWidth={768} maxWidth={1199}>
          {this.renderCoinMarketTablet()}
        </MediaQuery>
        <MediaQuery maxWidth={767}>{this.renderCoinMarketMobile()}</MediaQuery>
      </>
    );
  }

  renderDeposit() {
    return (
      <>
        <MediaQuery minWidth={1200}>{this.renderDepositDesktop()}</MediaQuery>
        <MediaQuery minWidth={768} maxWidth={1199}>
          {this.renderDepositTablet()}
        </MediaQuery>
        <MediaQuery maxWidth={767}>{this.renderDepositMobile()}</MediaQuery>
      </>
    );
  }

  renderWithdraw() {
    return (
      <>
        <MediaQuery minWidth={1200}>{this.renderWithdrawDesktop()}</MediaQuery>
        <MediaQuery minWidth={768} maxWidth={1199}>
          {this.renderWithdrawTablet()}
        </MediaQuery>
        <MediaQuery maxWidth={767}>{this.renderWithdrawMobile()}</MediaQuery>
      </>
    );
  }

  renderIndex() {
    return (
      <>
        <MediaQuery minWidth={1366}>{this.renderDesktop()}</MediaQuery>
        <MediaQuery minWidth={1024} maxWidth={1365}>
          {this.renderLaptop()}
        </MediaQuery>
        <MediaQuery minWidth={768} maxWidth={1023}>
          {this.renderTablet()}
        </MediaQuery>
        <MediaQuery maxWidth={767}>{this.renderMobile()}</MediaQuery>
      </>
    );
  }

  setRef(ref) {
    if (ref) {
      this.ps = new PerfectScrollbar(ref, {
        suppressScrollY: true,
        maxScrollbarLength: 20
      });
    }
  }

  getNetworkName() {
    switch (parseInt(env.NETWORK_ID, 10)) {
      case 1:
        return 'Mainnet';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 66:
        return env.NODE_URL;
      default:
        return 'id: ' + env.NETWORK_ID;
    }
  }

  renderMobile() {
    const selectTab = this.state.mobileTab;
    let content;
    if (selectTab === 'trade' || !selectTab) {
      content = <Trade />;
    } else if (selectTab === 'orders') {
      content = <Orders />;
    } else if (selectTab === 'charts') {
      content = <Charts />;
    } else if (selectTab === 'orderbook') {
      content = (
        <>
          <div className="title">
            <div>
              <div>Orderbook</div>
              <div className="text-secondary">Available Bid and Ask orders</div>
            </div>
          </div>
          <OrderBook />
        </>
      );
    } else if (selectTab === 'history') {
      content = (
        <>
          <div className="title flex align-items-center">
            <div>Trade History</div>
          </div>
          <TradeHistory />
        </>
      );
    } else if (selectTab === 'wallet') {
      content = <Wallet />;
    }

    return (
      <div className="flex-column flex-1 overflow-hidden">
        <div className="flex-column flex-1">{content}</div>
        <div className="flex nav-tabs overflow-hidden position-relative" ref={ref => this.setRef(ref)}>
          <div className="nav-item flex-1 border-top d-inline-block">
            <div
              onClick={() => this.setState({ mobileTab: 'trade' })}
              className={`tab-button text-secondary text-center${selectTab === 'trade' ? ' active' : ''}`}>
              Trade
            </div>
          </div>
          <div className="nav-item flex-1 border-top d-inline-block">
            <div
              onClick={() => this.setState({ mobileTab: 'orders' })}
              className={`tab-button text-secondary text-center${selectTab === 'orders' ? ' active' : ''}`}>
              Orders
            </div>
          </div>
          <div className="nav-item flex-1 border-top d-inline-block">
            <div
              onClick={() => this.setState({ mobileTab: 'charts' })}
              className={`tab-button text-secondary text-center${selectTab === 'charts' ? ' active' : ''}`}>
              Charts
            </div>
          </div>
          <div className="nav-item flex-1 border-top d-inline-block">
            <div
              onClick={() => this.setState({ mobileTab: 'orderbook' })}
              className={`tab-button text-secondary text-center${selectTab === 'orderbook' ? ' active' : ''}`}>
              Orderbook
            </div>
          </div>
          <div className="nav-item flex-1 border-top d-inline-block">
            <div
              onClick={() => this.setState({ mobileTab: 'history' })}
              className={`tab-button text-secondary text-center${selectTab === 'history' ? ' active' : ''}`}>
              History
            </div>
          </div>
          <div className="nav-item flex-1 border-top d-inline-block">
            <div
              onClick={() => this.setState({ mobileTab: 'wallet' })}
              className={`tab-button text-secondary text-center${selectTab === 'wallet' ? ' active' : ''}`}>
              Wallet
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTablet() {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-column border-right">
          <div className="grid flex-1">
            <Trade />
          </div>
        </div>
        <div className="flex-column">
          <div className="flex-column flex-1">
            <div className="grid flex-1">
              <Charts />
            </div>
            <Fold className="border-top flex-1 flex-column">
              <div className="" data-fold-item-title="Orderbook">
                <OrderBook />
              </div>
              <div className="" data-fold-item-title="Trade History">
                <TradeHistory />
              </div>
              <div className="" data-fold-item-title="Wallet">
                <Wallet />
              </div>
              <div className="" data-fold-item-title="Orders">
                <Orders />
              </div>
            </Fold>
          </div>
        </div>
      </div>
    );
  }

  renderLaptop() {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-column border-right">
          <div className="grid flex-1">
            <Trade />
          </div>
        </div>
        <Fold className="grid border-right flex-column">
          <div className="grid flex-column" data-fold-item-title="Orderbook">
            <OrderBook />
          </div>
          <div className="grid flex-column" data-fold-item-title="Trade History">
            <TradeHistory />
          </div>
          <div className="grid flex-column" data-fold-item-title="Wallet">
            <Wallet />
          </div>
        </Fold>
        <div className="flex-column flex-1">
          <div className="grid flex-2">
            <Charts />
          </div>
          <div className="grid flex-1 border-top">
            <Orders />
          </div>
        </div>
      </div>
    );
  }

  renderDesktop() {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex">
          <div className="flex-column flex-1 border-right">
            <div className="grid flex-1">
              <Trade />
            </div>
          </div>
          <div className="grid border-right flex-column">
            <div className="title">
              <div>
                <div>Orderbook</div>
                <div className="text-secondary">Available Bid and Ask orders</div>
              </div>
            </div>
            <OrderBook />
          </div>
        </div>
        <div className="flex-column flex-1 border-right">
          <div className="grid flex-2">
            <Charts />
          </div>
          <div className="grid flex-1 border-top">
            <Orders />
          </div>
        </div>
        <div className="flex-column">
          <div className="grid flex-1">
            <div className="title flex align-items-center">
              <div>Trade History</div>
            </div>
            <TradeHistory />
          </div>
          <div className="grid flex-1 border-top">
            <Wallet />
          </div>
        </div>
      </div>
    );
  }

  renderCoinMarketDesktop() {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-column border-right">
          <div className="flex-column flex-1">
            <div className="grid">
              <MarketCoin />
            </div>
            <div className="border-top">
              <TableMarket />
            </div>
          </div>
        </div>
        <div className="flex-column">
          <div className="grid flex-1">
            <div className="title flex align-items-center">
              <div>Trade History</div>
            </div>
            <TradeHistory />
          </div>
          <div className="grid flex-1 border-top">
            <Wallet />
          </div>
        </div>
      </div>
    );
  }

  renderCoinMarketTablet() {
    return <div>COIN MARKET Tablet</div>;
  }

  renderCoinMarketMobile() {
    return <div>COIN MARKET Mobile</div>;
  }

  renderDepositDesktop() {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-column" style={{ width: '100%' }}>
          <div className="grid flex-1">
            <Deposit />
          </div>
          <div className="grid flex-1 border-top">
            <HistoryDeposit />
          </div>
        </div>
      </div>
    );
  }

  renderDepositTablet() {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="flex-column">
          <div className="flex-column flex-1">
            <Fold className="border-top flex-1 flex-column">
              <div className="" data-fold-item-title="Deposit">
                <Deposit />
              </div>
              <div className="" data-fold-item-title="Recent Deposit History">
                <HistoryDeposit />
              </div>
            </Fold>
          </div>
        </div>
      </div>
    );
  }

  renderDepositMobile() {
    return <div>Deposit Tablet</div>;
  }

  renderWithdrawDesktop() {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-column" style={{ width: '100%' }}>
          <div className="grid flex-1">
            <Withdraw />
          </div>
          <div className="grid flex-1 border-top">
            <HistoryWithdraw />
          </div>
        </div>
      </div>
    );
  }

  renderWithdrawTablet() {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="flex-column">
          <div className="flex-column flex-1">
            <Fold className="border-top flex-1 flex-column">
              <div className="" data-fold-item-title="Withdraw">
                <Withdraw />
              </div>
              <div className="" data-fold-item-title="Recent Withdraw History">
                <HistoryWithdraw />
              </div>
            </Fold>
          </div>
        </div>
      </div>
    );
  }

  renderWithdrawMobile() {
    return <div>Withdraw Tablet</div>;
  }
}

export default connect(mapStateToProps)(App);
