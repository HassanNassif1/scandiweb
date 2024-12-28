import React, { Component, createContext } from "react";

// Create the CurrencyContext
export const CurrencyContext = createContext();

class CurrencyProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currencyRates: {},
            selectedCurrency: { label: 'USD', symbol: '$' }, // Set default currency
            products: []
        };
    }

    componentDidMount() {
        this.fetchCurrencyRates();
    }

    fetchCurrencyRates = async () => {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        this.setState({ currencyRates: data.rates });
    };

    convertPrice = (price) => {
        const { currencyRates, selectedCurrency } = this.state;
        const rate = currencyRates[selectedCurrency.label] || 1;
        return (price * rate).toFixed(2); // Convert and format the price
    };

    render() {
        const { selectedCurrency, currencyRates, products } = this.state;
        return (
            <CurrencyContext.Provider 
                value={{
                    selectedCurrency, 
                    setSelectedCurrency: (currency) => this.setState({ selectedCurrency: currency }), 
                    currencyRates, 
                    convertPrice: this.convertPrice, 
                    products
                }}>
                {this.props.children}
            </CurrencyContext.Provider>
        );
    }
}

export default CurrencyProvider;
