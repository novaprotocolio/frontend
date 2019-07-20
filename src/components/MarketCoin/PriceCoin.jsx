import React from 'react';
import Skeleton from 'react-loading-skeleton';
import './styles.scss';
import cc from './getData';

const numberFormat = number => {
  return +(number + '').slice(0, 7);
};

const moneyFormat = number => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(number);
};

class PriceCoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  intervalID = false;

  componentDidMount() {
    this.intervalID = true;
    this.intervalID && this.fetchPrices();
  }

  componentWillUnmount() {
    this.intervalID = false;
    clearTimeout(this.intervalID);
  }

  fetchPrices = async () => {
    let prices = await this.prices();
    try {
      this.intervalID &&
        this.setState({ prices: Object.values(prices)[0].USD }, () => {
          this.intervalID = setTimeout(() => {
            this.fetchPrices();
          }, 5000);
        });
    } catch (error) {
      console.log('fetch data fail');
    }
  };

  prices = async () => {
    try {
      let priceData = await cc.priceFull(this.props.coin, 'USD');
      return priceData;
    } catch (e) {
      console.warn('Fetch price error: ');
    }
    // }
  };

  render() {
    const { prices } = this.state;
    if (prices) {
      return (
        <>
          <div className="price-row">
            <div className="text-left">
              <strong className="sym-coin">{prices.FROMSYMBOL}</strong>
            </div>
            <div className="text-right">
              <span className={prices.CHANGEPCT24HOUR < 0 ? 'change-percen-down' : 'change-percen-up'}>
                {numberFormat(prices.CHANGEPCT24HOUR)}%
              </span>
            </div>
          </div>
          <div className="price-row">
            <div className="text-left">
              <strong className="ticker-price">${numberFormat(prices.PRICE)}</strong>
            </div>
            <div className="text-right">
              <span className="volume-coin">volume: {moneyFormat(prices.VOLUME24HOUR)}</span>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="price-row">
          <div className="text-left">
            <Skeleton width={90} height={20} />
          </div>
          <div className="text-right">
            <Skeleton width={90} height={20} />
          </div>
        </div>
        <div className="price-row">
          <div className="text-left">
            <Skeleton width={90} height={20} />
          </div>
          <div className="text-right">
            <Skeleton width={90} height={20} />
          </div>
        </div>
      </>
    );
  }
}

export default PriceCoin;
