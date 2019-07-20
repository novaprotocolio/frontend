import React from 'react';
import WithdrawItem from './WithdrawItem';
import { Container, Table, OverlayTrigger, Image, Tooltip } from 'react-bootstrap';
import './styles.scss';

class HistoryWithdraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyWithdraw: [
        {
          status: 'Confirming',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Compeleted',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Confirming',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Compeleted',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Compeleted',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Confirming',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Confirming',
          coin: 'ETH',
          amount: '0.01797975',
          date: '2018-03-09 17:17:03',
          infomation: '0xa3ef35fe2bb01cfb3d7f5898a2821675e3b3c647'
        },
        {
          status: 'Compeleted',
          coin: 'BTC',
          amount: '0.00565842',
          date: '2018-03-09 16:50:08',
          infomation: '1KQtmA9y8hD6FdFGD2v6aUWppycKwjqe1o'
        }
      ]
    };
  }

  render() {
    const { historyWithdraw } = this.state;
    return (
      <>
        <div className="title flex justify-content-between align-items-center">
          <div>
            <div>
              <span className="title-page">Recent Withdrawal History</span>
            </div>
          </div>
        </div>

        <div className="flex-column flex-1 ">
          <div className="grid flex-2">
            <div className="orders flex-1 position-relative overflow-hidden">
              <Container>
                <div className="mt-3 text-right">
                  <OverlayTrigger
                    trigger="hover"
                    placement="bottom"
                    overlay={
                      <Tooltip id="tooltip-bottom">
                        In some cases, depositing assets can take few hours. If your deposit has not arrived after a
                        short time, it may be due to a congested blockchain or incomplete transaction. Read more{' '}
                        <strong className="text-read-more">More Reference</strong>
                      </Tooltip>
                    }>
                    <span className="text-address">Deposit did not arrive? </span>
                  </OverlayTrigger>

                  <a className="link-view" href="#">
                    View all
                  </a>
                </div>
                <div className="my-custom-scrollbar table-wrapper-scroll-y">
                  <Table className="mt-3 table-history" bordered hover responsive="lg">
                    <thead className="thead-light">
                      <tr>
                        <th>Status</th>
                        <th>Coin</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Infomation</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {historyWithdraw ? (
                        historyWithdraw.map((coin, index) => {
                          return <WithdrawItem key={index} coin={coin} />;
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <Image
                              src={require('../../../images/norecord.svg')}
                              alt="no records found"
                              style={{ marginRight: 8, height: 120, width: 120 }}
                            />
                            <br />
                            <span className="norecord-tip">No records found</span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HistoryWithdraw;
