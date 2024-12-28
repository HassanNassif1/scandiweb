import React, { Component } from 'react';

class CurrencySelector extends Component {
  handleCurrencyChange = (e) => {
    const { currencies, onCurrencyChange } = this.props;
    const selected = currencies.find(currency => currency.label === e.target.value);
    onCurrencyChange(selected); // Trigger a price recalculation
  };

  render() {
    const { currencies, selectedCurrency } = this.props;

    // Check if currencies is available and not empty
    if (!currencies || currencies.length === 0) {
      return <div>Loading currencies...</div>; // Show loading message if currencies are not loaded
    }

    return (
      <select
        className="currency-selector"
        value={selectedCurrency ? selectedCurrency.label : ''}
        onChange={this.handleCurrencyChange}
      >
        {currencies.map(currency => (
          <option key={currency.label} value={currency.label}>
            {currency.label} ({currency.symbol})
          </option>
        ))}
      </select>
    );
  }
}

export default CurrencySelector;
