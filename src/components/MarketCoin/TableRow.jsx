import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import './styles.scss';
import cc from './getData';

const numberFormat = number => {
  return +(number + '').slice(0, 7);
};

const moneyFormat = (number, fetchCoin) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: fetchCoin }).format(number);
};

class TableMarket extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  intervalID = false;

  componentDidMount() {
    this.intervalID = true;
    this.intervalID && this.fetchCoins(this.props.fetchCoin);
  }

  componentWillUnmount() {
    this.intervalID = false;
    clearTimeout(this.intervalID);
  }

  UNSAFE_componentWillReceiveProps(nextProp) {
    if (nextProp.fetchCoin !== this.props.fetchCoin) {
      clearTimeout(this.intervalID);
      this.fetchCoins(nextProp.fetchCoin);
    }
  }

  fetchCoins = async fetchCoin => {
    let price = await cc.priceFull(this.props.coin, fetchCoin);
    try {
      // if (JSON.stringify(price) === JSON.stringify(this.state.price)) {
      //   this.intervalID = setTimeout(() => {
      //     this.fetchCoins(fetchCoin);
      //   }, 5000);
      // } else {
      this.intervalID && this.setState({ price: price });
      // this.intervalID = setTimeout(() => {
      //   this.fetchCoins(fetchCoin);
      // }, 5000);
      // }
    } catch (error) {
      console.log('fetch data fail');
    }
  };

  renderLoading() {
    return (
      <>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
        <td>
          <Skeleton />
        </td>
      </>
    );
  }

  render() {
    const { price } = this.state;
    const { fetchCoin, coin } = this.props;
    if (!price) return this.renderLoading();
    if (!price[coin]) return this.renderLoading();
    const currentCoin = price[coin][fetchCoin];
    if (!currentCoin) return this.renderLoading();
    return (
      <>
        <td className="text-primary">{moneyFormat(currentCoin.PRICE, fetchCoin)}</td>
        <td className={`text-right ${currentCoin.CHANGEPCT24HOUR < 0 ? 'change-percen-down' : 'change-percen-up'}`}>
          {numberFormat(currentCoin.CHANGEPCT24HOUR)}%
        </td>
        <td>{moneyFormat(currentCoin.HIGH24HOUR, fetchCoin)}</td>
        <td>{moneyFormat(currentCoin.LOW24HOUR, fetchCoin)}</td>
        <td className="text-primary text-right">{numberFormat(currentCoin.VOLUME24HOUR)}</td>
      </>
    );
  }
}

export default TableMarket;
