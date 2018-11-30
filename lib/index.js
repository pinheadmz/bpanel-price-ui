/* Imports */

import { Header, Dropdown, widgetCreator } from '@bpanel/bpanel-ui';

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
      refreshPrice: () => dispatch({ type: 'REFRESH_PRICE' }),
      updateFiat: fiat => dispatch({ type: 'UPDATE_FIAT', payload: fiat })
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
        updateFiat,
        refreshPrice
      } = this.props;

      const Ticker = () => (
        <div>
          <Header type="h1">
            Price: {price.fiatSymbol + moneyNumber(price.price)}
          </Header>
          <Header type="h3">
            {price.feed + ': ' + price.crypto + '-' + price.fiat}
          </Header>
          <div style={{ width: '100px' }}>
            <Dropdown
              value={price.fiat}
              options={price.availableFiats}
              onChange={choice => {
                updateFiat(choice.value);
                refreshPrice();
              }}
              styles={{ width: '100px' }}
            />
          </div>
        </div>
      );

      footerWidgets.push(widgetCreator(Ticker)());
      return <Footer {...this.props} footerWidgets={footerWidgets} />;
    }
  };
};
