import React from 'react';
import MiniChart from './Chart';
import PriceCoin from './PriceCoin';
import './styles.scss';

class MarketCoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: ['BTC', 'ETH', 'LTC', 'DASH', 'ZEC']
    };
  }

  render() {
    const { coins } = this.state;
    return (
      <>
        <div className="title flex justify-content-between align-items-center">
          <div>
            <div>
              <span className="title-page">Coins Market</span>
            </div>
          </div>
        </div>

        <div className="flex-column flex-1 ">
          <div className="grid flex-2">
            <div className="orders flex-1 position-relative overflow-hidden">
              <table className="table" style={{ marginTop: '1em' }}>
                <thead>
                  <tr className="text-secondary">
                    {coins &&
                      coins.map((coin, index) => {
                        return (
                          <th key={index}>
                            <div className="price-grid">
                              <div className="price-tile">
                                <PriceCoin coin={coin} />
                              </div>
                              <div className="price-chart">
                                <MiniChart data={coin} width={232} />
                              </div>
                            </div>
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default MarketCoin;
