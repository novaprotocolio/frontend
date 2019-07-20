import React, { Component } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import { InputGroup, FormControl } from 'react-bootstrap';
import Selector from '../Selector';
import TableRow from './TableRow';
import MiniChart from './Chart';
import './styles.scss';
import _ from 'lodash';
import fuzzy from 'fuzzy';

const OPTIONS = [
  // { value: 'USD', name: 'Favourite' },
  { value: 'USD', name: 'USD Markets' },
  { value: 'BTC', name: 'BTC Markets' },
  { value: 'ETH', name: 'ETH Markets' }
];

class TableMarket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchCoin: OPTIONS[0].value
    };
  }

  intervalID = false;

  componentDidMount() {
    this.intervalID = true;
    this.intervalID && this.fetchCoins();
  }

  componentWillUnmount() {
    this.intervalID = false;
  }

  fetchCoins = async () => {
    const coinList = require('./dataCrypto/coin_list').coin_list;
    let sortCoins = Object.values(coinList)
      .sort((a, b) => (+a.SortOrder > +b.SortOrder ? 1 : -1))
      .slice(0, 100);
    let arrCoins = [];
    let arrCoinList = [];
    for (let i in sortCoins) {
      arrCoins.push(sortCoins[i].Symbol);
      arrCoinList.push({ coinName: sortCoins[i].CoinName, imgageURL: sortCoins[i].ImageUrl });
    }
    this.intervalID && this.setState({ arrCoins, arrCoinList });
  };

  onSearchCoin = (searchCoin, coin) => {
    const check = searchCoin.includes(coin);
    if (check) {
      return {};
    }
    return { display: 'none' };
  };

  filterList = (e, list) => {
    let inputValue = e.target.value;
    if (!inputValue) {
      inputValue = '';
    }
    this.handleFilter(e.target.value, list);
  };

  handleFilter = _.debounce((inputValue, list) => {
    let filtered = fuzzy.filter(inputValue, list, {}).map(result => result.string);
    this.setState({ searchCoin: filtered });
  }, 500);

  render() {
    const { fetchCoin, arrCoins } = this.state;
    return (
      <>
        <div className="title flex justify-content-between align-items-center">
          <InputGroup className="mt-3 mb-3" style={{ width: 'auto' }}>
            <InputGroup.Prepend>
              <InputGroup.Text className="fa fa-search" />
            </InputGroup.Prepend>
            <FormControl placeholder="Search" onKeyUp={e => this.filterList(e, arrCoins)} />
          </InputGroup>
          <Selector
            options={OPTIONS}
            selectedValue={fetchCoin}
            handleClick={option => {
              this.setState({ fetchCoin: option.value });
            }}
          />
        </div>
        <div className="flex-column flex-1 position-relative overflow-hidden" ref={ref => this.setRef(ref)}>
          {this.renderTable()}
        </div>
      </>
    );
  }

  renderTable() {
    const { arrCoinList, arrCoins, fetchCoin, searchCoin } = this.state;
    return (
      <div className="card mb-3">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive my-custom-scrollbar table-wrapper-scroll-y">
            <table className="table table-bordered table-striped table-hover" width="100%" cellSpacing="0">
              <thead className="thead-dark ">
                <tr>
                  <th style={{ width: '2%' }}>#</th>
                  <th style={{ width: '15%' }}>Pair</th>
                  <th style={{ width: '15%' }}>Coin</th>
                  <th style={{ width: '8%' }}>LastPrice</th>
                  <th className="text-right" style={{ width: '10%' }}>
                    24h Change
                  </th>
                  <th style={{ width: '10%' }}>24h High</th>
                  <th style={{ width: '10%' }}>24h Low</th>
                  <th className="text-right" style={{ width: '10%' }}>
                    24h Volume
                  </th>
                  <th className="text-center" style={{ width: '20%' }}>
                    Market
                  </th>
                </tr>
              </thead>
              <tbody>
                {arrCoins &&
                  arrCoinList &&
                  arrCoins.map((coin, index) => {
                    return (
                      <tr key={index} style={searchCoin && this.onSearchCoin(searchCoin, coin)}>
                        <th scope="row" style={{ height: 48 }}>
                          {index + 1}
                        </th>
                        <td>
                          <img
                            src={`http://cryptocompare.com/${arrCoinList[index].imgageURL}`}
                            className="img-fluid rounded-circle"
                            alt={arrCoinList[index].coinName}
                            style={{ height: 20 }}
                          />{' '}
                          {coin}/{fetchCoin}
                        </td>
                        <td>{arrCoinList[index].coinName}</td>
                        <TableRow
                          index={index}
                          fetchCoin={fetchCoin}
                          coin={coin}
                          nameCoin={arrCoinList[index].coinName}
                        />
                        <td>
                          <MiniChart data={coin} width={232} />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  setRef(ref) {
    if (ref) {
      this.ps = new PerfectScrollbar(ref, {
        suppressScrollX: true,
        maxScrollbarLength: 20
      });
    }
  }
}

export default TableMarket;
