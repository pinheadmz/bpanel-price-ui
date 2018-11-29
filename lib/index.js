/* Imports */

import React from 'react';
import { Header, Text, Dropdown } from '@bpanel/bpanel-ui';

/* Constants */

const fiatSymbols = {
  USD: "$",
  GBP: "£",
  EUR: "€"
}

const fiats = Object.keys(fiatSymbols);

/* Components */

const Ticker = ({price, updateFiat, refreshPrice}) => (
  <div>
    <Header type="h1">
      Price: {fiatSymbols[price.fiat] + moneyNumber(price.price)}
    </Header>
    <Header type="h3">
      Coinbase {price.crypto + '-' + price.fiat}
    </Header>
    <Dropdown
      value={price.fiat}
      options={fiats}
      onChange={choice => {updateFiat(choice.value); refreshPrice()}}
    />
  </div>
);

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
  nav: true,
  sidebar: true,
  icon: 'exchange'
};

export const mapComponentDispatch = {
  Panel: (dispatch, map) =>
    Object.assign(map, {
        refreshPrice: () => dispatch({type: 'REFRESH_PRICE'}),
        updateFiat: fiat => dispatch({type: 'UPDATE_FIAT', payload: fiat})
      })
}

export const mapComponentState = {
  Panel: (state, map) =>
    Object.assign(map, {
      price: state.plugins.price,
    })
};
export const getRouteProps = {
  [metadata.name]: (parentProps, props) =>
    Object.assign(props, {
      price: parentProps.price,
      updateFiat: parentProps.updateFiat,
      refreshPrice: parentProps.refreshPrice,
    })
};

const mapStateToProps = state => {
  return {
    price: state.plugins.price,
  };
};


export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.name;
    }

    async componentDidMount() {
      setInterval( async () => {
        this.props.refreshPrice();
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

