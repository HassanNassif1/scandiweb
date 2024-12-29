import React, { Component } from 'react';

class PDP_Attributes extends Component {
  render() {
    const {
      attributes,
      selectedColor,
      setSelectedColor,
      selectedSize,
      setSelectedSize,
      selectedCapacity,
      setSelectedCapacity,
      selectedWithUSB3Ports,
      setSelectedWithUSB3Ports,
      selectedWithTouchID,
      setSelectedWithTouchID,
    } = this.props;

    // Create a unique attribute map
    const attributeMap = attributes.reduce((acc, attribute) => {
      if (!acc[attribute.name]) {
        acc[attribute.name] = [];
      }
      acc[attribute.name].push(attribute.value);
      return acc;
    }, {});

    // Helper function to convert strings to kebab-case
    const toKebabCase = (str) => {
      return str
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
        .replace(/^\-/, ''); // Remove leading hyphen if present
    };

    // Helper function to convert a value to kebab-case for test ids (not for actual values)
    // Helper function to convert a value to kebab-case for test ids (not for actual values)
    // Helper function to convert value to test id for attributes
    const toAttributeTestId = (value) => {
      // Only remove special characters except for '#' and '-' for test ids
      return value
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .replace(/[^a-zA-Z0-9\-#]/g, '')
        .replace(/^([a-z])/, (match) => match.toUpperCase());
    };


    return (
      <div>
        {Object.keys(attributeMap).map((attrName) => (
          <div
            key={attrName}
            className="attribute-container"
            data-testid={`product-attribute-${toKebabCase(attrName)}`} // Kebab-case only for attribute names
          >
            <div className="attribute-item">
              <p className="attribute-name">{attrName}:</p>
              <div className="attribute-values-PDP">
                {attrName === "Color" ? (
                  attributeMap[attrName].map((value, index) => (
                    <div
                      key={index}
                      className={`attribute-box ${value === selectedColor ? 'active' : ''} ${value === '#ffffff' || value.toLowerCase() === 'white' ? 'white' : ''
                        }`}
                      style={{
                        backgroundColor: value,
                        border: value === selectedColor
                          ? '2.5px solid #5ECE7B' // Green border for selected
                          : value === '#ffffff' || value.toLowerCase() === 'white'
                            ? '2.5px solid #000' // Black border for white
                            : '2.5px solid transparent', // Transparent border for others
                        boxShadow: value === '#ffffff' || value.toLowerCase() === 'white'
                          ? '0 0 2px rgba(0, 0, 0, 0.5)' // Shadow for white
                          : 'none',
                      }}
                      onClick={() => setSelectedColor(value)}
                      data-testid={`product-attribute-color-${toAttributeTestId(value)}`} // Updated test id for color value
                    />
                  ))
                ) : attrName === "Size" ? (
                  attributeMap[attrName].map((value, index) => (
                    <div
                      key={index}
                      className={`size-box ${value === selectedSize ? 'active' : ''}`}
                      onClick={() => setSelectedSize(value)}
                      data-testid={`product-attribute-size-${toAttributeTestId(value)}`} // Test id for size value, no kebab-case here
                    >
                      {value}
                    </div>
                  ))
                ) : attrName === "Capacity" ? (
                  attributeMap[attrName].map((value, index) => (
                    <div
                      key={index}
                      className={`size-box ${value === selectedCapacity ? 'active' : ''}`}
                      onClick={() => setSelectedCapacity(value)}
                      data-testid={`product-attribute-capacity-${toAttributeTestId(value)}`} // Test id for capacity value
                    >
                      {value}
                    </div>
                  ))
                ) : attrName === "With USB 3 ports" ? (
                  attributeMap[attrName].map((value, index) => (
                    <div
                      key={index}
                      className={`size-box ${value === selectedWithUSB3Ports ? 'active' : ''}`}
                      onClick={() => setSelectedWithUSB3Ports(value)}
                      data-testid={`product-attribute-usb3-${toAttributeTestId(value)}`} // Test id for USB 3 ports value
                    >
                      {value}
                    </div>
                  ))
                ) : attrName === "Touch ID in keyboard" ? (
                  attributeMap[attrName].map((value, index) => (
                    <div
                      key={index}
                      className={`size-box ${value === selectedWithTouchID ? 'active' : ''}`}
                      onClick={() => setSelectedWithTouchID(value)}
                      data-testid={`product-attribute-touchid-${toAttributeTestId(value)}`} // Test id for Touch ID value
                    >
                      {value}
                    </div>
                  ))
                ) : (
                  attributeMap[attrName].map((value, index) => (
                    <p key={index} data-testid={`product-attribute-${toKebabCase(attrName)}-${toAttributeTestId(value)}`}>{value}</p> // Test id for other attributes
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default PDP_Attributes;
