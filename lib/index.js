/* Imports */

import { Text, widgetCreator } from '@bpanel/bpanel-ui';

/* Utility */

function moneyNumber(number) {
  number = parseFloat(number);
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/* Exports */

export const metadata = {
  name: 'price-ui',
  pathName: 'price-ui',
  displayName: 'Price UI',
  author: 'Matthew Zipkin',
  description: 'UI for price plugin',
  version: require('../package.json').version,
  nav: false,
  sidebar: false
};

export const mapComponentDispatch = {
  Footer: (dispatch, map) =>
    Object.assign(map, {
      refreshPrice: () => dispatch({ type: 'REFRESH_PRICE', payload: {} }),
      updateFiat: fiat => dispatch({ type: 'UPDATE_FIAT', payload: fiat }),
      updateFeed: feed => dispatch({ type: 'UPDATE_FEED', payload: feed })
    })
};

export const mapComponentState = {
  Footer: (state, map) =>
    Object.assign(map, {
      price: state.plugins.price
    })
};

export const decorateFooter = (Footer, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    static get propTypes() {
      return {
        refreshPrice: PropTypes.func,
        updateFiat: PropTypes.func,
        updateFeed: PropTypes.func,
        footerWidgets: PropTypes.array,
        price: PropTypes.shape({
          fiat: PropTypes.string,
          fiatSymbol: PropTypes.string,
          price: PropTypes.float,
          feed: PropTypes.string,
          crypto: PropTypes.string,
          availableFiats: PropTypes.array
        })
      };
    }

    async componentDidMount() {
      setInterval(async () => {
        this.props.refreshPrice();
      }, 60000);
    }

    render() {
      const {
        footerWidgets = [],
        price,
        updateFeed,
        updateFiat,
        refreshPrice
      } = this.props;

      const Ticker = () => (
        <div>
          <Text>
            {price.crypto +
              ' ' +
              price.fiatSymbol +
              moneyNumber(price.price) +
              ' '}
          </Text>
          <select
            value={price.fiat}
            onChange={e => {
              updateFiat(e.target.value);
              refreshPrice();
            }}
          >
            {price.availableFiats.map(val => (
              <option value={val} key={val}>
                {val}
              </option>
            ))}
          </select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <select
            value={price.feed}
            onChange={e => {
              updateFeed(e.target.value);
              refreshPrice();
            }}
          >
            {price.availableFeeds.map(val => (
              <option value={val} key={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      );

      footerWidgets.push(widgetCreator(Ticker)());
      return <Footer {...this.props} footerWidgets={footerWidgets} />;
    }
  };
};
