import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { ChartCanvas, Chart } from 'react-stockcharts';
import { AreaSeries } from 'react-stockcharts/lib/series';

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';

import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';

class CandleStickChartWithDarkTheme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.data) {
      this.fetchHistorical();
    }
  }

  componentWillUnmount() {
    this.setState({ historicalData: undefined });
  }

  fetchHistorical = async () => {
    let historicalData;
    try {
      let histoDay_list = require('./dataCrypto/histoDay_list').histoDay_list;
      const findData = histoDay_list.findIndex(coin => coin.coin === this.props.data);
      historicalData = histoDay_list[findData].historicalData;
      histoDay_list = undefined;
      // historicalData = await cc.histoDay(this.props.data, 'USD');
    } catch (e) {
      console.log('fetch historicalData fail');
    }
    if (historicalData && historicalData.length > 0) {
      this.setState({ historicalData });
    }
    historicalData = [];
  };

  render() {
    const { type, width, ratio } = this.props;
    const { historicalData } = this.state;
    if (!historicalData) {
      return <Skeleton />;
    }
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => new Date(d.time));
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(historicalData);
    const xExtents = [xAccessor(last(data)), xAccessor(data[0])];

    return (
      <ChartCanvas
        ratio={ratio}
        width={width}
        height={40}
        margin={{ left: 0, right: 0, top: 40, bottom: 0 }}
        type={type}
        pointsPerPxThreshold={1}
        seriesName="MSFT"
        data={data}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xScale={xScale}
        xExtents={xExtents}
        disableInteraction={true}
        useCrossHairStyleCursor={false}>
        <Chart id={5} yExtents={d => [d.close]} height={39} origin={(w, h) => [0, h - 40]}>
          <AreaSeries yAccessor={d => d.close} strokeDasharray="Solid" stroke="#00d99f" fill="#d4f7ed" />
        </Chart>
      </ChartCanvas>
    );
  }
}
CandleStickChartWithDarkTheme.propTypes = {
  data: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
};

CandleStickChartWithDarkTheme.defaultProps = {
  type: 'svg'
};

CandleStickChartWithDarkTheme = fitWidth(CandleStickChartWithDarkTheme);

export default CandleStickChartWithDarkTheme;
