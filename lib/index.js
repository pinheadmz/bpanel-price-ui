/* Imports */

import React from 'react';
import { Header, Text } from '@bpanel/bpanel-ui';

/* Components */

const Ticker = ({price}) => (
  <div>
    <Header type="h3">Coinbase {price.crypto + '-' + price.fiat}</Header>
    <Header type="h1">Price: ${moneyNumber(price.price)}</Header>
  </div>
);

/* Utility */

function moneyNumber(number) {
  number = parseFloat(number);
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


/* Actions and Reducers */

const initState = {
  price: 0,
  fiat: 'USD',
  crypto: 'BTC'
}

function priceReducer(state = initState, action) {
  const newState = { ...state };
  switch (action.type) {
    case 'UPDATE_PRICE':
      newState.price = action.payload;
      return newState;
    case 'UPDATE_FIAT':
      newState.fiat = action.payload;
      return newState;
    case 'UPDATE_CRYPTO':
      newState.crypto = action.payload;
      return newState;
    default:
      return state;
  }
};

const updatePrice = price => ({
    type: 'UPDATE_PRICE',
    payload: price
});

const updateFiat = fiat => ({
    type: 'UPDATE_FIAT',
    payload: fiat
});

const updateCrypto = crypto => ({
    type: 'UPDATE_CRYPTO',
    payload: crypto
});

/* Exports */

export const metadata = {
  name: 'price-ui',
  pathName: 'price-ui',
  displayName: 'Price UI',
  author: 'Matthew Zipkin',
  description: 'UI for price plugin',
  version: require('../package.json').version,
  nav: true,
  sidebar: true,
  icon: 'exchange'
};

export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
        updatePrice: price => dispatch(updatePrice(price)),
        updateFiat: fiat => dispatch(updateFiat(fiat)),
        updateCrypto: crypto => dispatch(updateCrypto(crypto))
      })
}

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      price: state.plugins.price,
      clients: state.clients
    })
};
export const getRouteProps = {
  [metadata.name]: (parentProps, props) =>
    Object.assign(props, {
      price: parentProps.price,
    })
};

const mapStateToProps = state => {
  return {
    price: state.plugins.price,
    clients: state.clients,
  };
};


export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    async componentDidMount() {
      setInterval( async () => {
        const price = await getCoinbasePrice(this.props.price);
        this.props.updatePrice(price);
      }, 5000);
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        metadata,
        Component: Ticker
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};

