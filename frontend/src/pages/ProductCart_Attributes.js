import React, { Component } from 'react';

class ProductCart_Attributes extends Component {
  // Function to get priority for attribute sorting
  getPriority(name) {
    if (name === "Capacity") return 1;
    if (name === "Color") return 2;
    if (name === "Size") return 3;
    if (name === "With USB 3 ports") return 4;
    if (name === "Touch ID in keyboard") return 5;
    return 6;
  }

  // Convert string to kebab case for test ids
  toKebabCase = (str) => str.toLowerCase().replace(/ /g, '-');

  // Helper function to group attributes and check if this combination already exists in the cart
  getUniqueAttributes = () => {
    const {
      selectedColor,
      selectedSize,
      selectedWithUSB3Ports,
      selectedWithTouchID,
      selectedCapacity,
    } = this.props;

    return {
      selectedColor,
      selectedSize,
      selectedWithUSB3Ports,
      selectedWithTouchID,
      selectedCapacity,
    };
  };

  render() {
    const {
      attributes,
      selectedColor,
      selectedSize,
      selectedWithUSB3Ports,
      selectedWithTouchID,
      selectedCapacity,
    } = this.props;

    // Default selected attributes
    const defaultSelectedSize = selectedSize || attributes.find(attr => attr.name === "Size")?.value || '';
    const defaultSelectedCapacity = selectedCapacity || attributes.find(attr => attr.name === "Capacity")?.value || '';
    const defaultSelectedColor = selectedColor || attributes.find(attr => attr.name === "Color")?.value || '';
    const defaultSelectedWithUSB3Ports = selectedWithUSB3Ports || attributes.find(attr => attr.name === "With USB 3 ports")?.value || '';
    const defaultSelectedWithTouchID = selectedWithTouchID || attributes.find(attr => attr.name === "Touch ID in keyboard")?.value || '';

    // Sort attributes based on predefined priority
    const sortedAttributes = attributes.slice().sort((a, b) => this.getPriority(a.name) - this.getPriority(b.name));
    const renderedAttributes = new Set();

    return (
      <div className="product-attributes">
        <div className="attribute-container">
          {sortedAttributes.map((attribute, index) => {
            if (renderedAttributes.has(attribute.name)) {
              return null;
            }

            renderedAttributes.add(attribute.name);

            const defaultValue = attribute.value[0]; // Always get the first value of the attribute

            return (
              <div key={index} className="attribute-item-color">
                {attribute.name === "Color" && (
                  <>
                    <p className="attribute-label-Tech">Color:</p>
                    <div className="attribute-wrapper" data-testid={`cart-item-attribute-${this.toKebabCase(attribute.name)}`}>
                      <div className="attribute-values-Color">
                        {attributes
                          .filter(attr => attr.name === "Color")
                          .map((attr, idx) => {
                            const isWhiteColor = attr.value.toLowerCase() === 'white';
                            const testIdBase = `cart-item-attribute-${this.toKebabCase(attr.name)}-${this.toKebabCase(attr.value)}`;
                            return (
                              <div
                                key={idx}
                                className={`selected-color-cart ${attr.value === defaultSelectedColor ? 'active' : ''}`}
                                style={{
                                  backgroundColor: attr.value,
                                  border: `1px solid ${attr.value === defaultSelectedColor ? '#5ECE7B' : 'transparent'} ${isWhiteColor ? 'white-color' : ''}`,
                                }}
                                title={`${attr.name}: ${attr.value}`}
                                data-testid={`${testIdBase}${attr.value === defaultSelectedColor ? '-selected' : ''}`}
                              />
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}


{attribute.name === "Size" && (
  <>
    <p className="attribute-label-Size">Size:</p>
    <div className="attribute-wrapper-size">
      <div className="attribute-values-size">
        {attributes
          .filter(attr => attr.name === "Size")
          .map((attr, idx) => {
            const testIdBase = `cart-item-attribute-${this.toKebabCase(attr.name)}-${this.toKebabCase(attr.value)}`;
            return (
              <div
                key={idx}
                className={`selected-size-cart ${attr.value === defaultSelectedSize ? 'active' : ''}`}
                data-testid={`${testIdBase}${attr.value === defaultSelectedSize ? '-selected' : ''}`}
              >
                {attr.value}
              </div>
            );
          })}
      </div>
    </div>
  </>
)}


                {attribute.name === "Capacity" && (
                  <>
                    <p className="attribute-label-capacity">Capacity:</p>
                    <div className="attribute-wrapper-capacity">
                      <div className="attribute-values-Capacity">
                        {attributes
                          .filter(attr => attr.name === "Capacity")
                          .map((attr, idx) => {
                            const testIdBase = `cart-item-attribute-${this.toKebabCase(attr.name)}-${this.toKebabCase(attr.value)}`;
                            return (
                              <div
                                key={idx}
                                className={`selected-capacity-cart ${attr.value === defaultSelectedCapacity ? 'active' : ''}`}
                                data-testid={`${testIdBase}${attr.value === defaultSelectedCapacity ? '-selected' : ''}`}
                              >
                                {attr.value}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}

                {attribute.name === "With USB 3 ports" && (
                  <>
                    <p className="attribute-label-USB">With USB 3 ports:</p>
                    <div className="attribute-wrapper-USB">
                      <div className="attribute-values-USB">
                        {attributes
                          .filter(attr => attr.name === "With USB 3 ports")
                          .map((attr, idx) => {
                            const testIdBase = `cart-item-attribute-${this.toKebabCase(attr.name)}-${this.toKebabCase(attr.value)}`;
                            return (
                              <div
                                key={idx}
                                className={`selected-size-cart ${attr.value === defaultSelectedWithUSB3Ports ? 'active' : ''}`}
                                data-testid={`${testIdBase}${attr.value === defaultSelectedWithUSB3Ports ? '-selected' : ''}`}
                              >
                                {attr.value}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}

                {attribute.name === "Touch ID in keyboard" && (
                  <>
                    <p className="attribute-label-Touch">Touch ID in keyboard:</p>
                    <div className="attribute-wrapper-Touch">
                      <div className="attribute-values-Touch">
                        {attributes
                          .filter(attr => attr.name === "Touch ID in keyboard")
                          .map((attr, idx) => {
                            const testIdBase = `cart-item-attribute-${this.toKebabCase(attr.name)}-${this.toKebabCase(attr.value)}`;
                            return (
                              <div
                                key={idx}
                                className={`selected-size-cart ${attr.value === defaultSelectedWithTouchID ? 'active' : ''}`}
                                data-testid={`${testIdBase}${attr.value === defaultSelectedWithTouchID ? '-selected' : ''}`}
                              >
                                {attr.value}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}

                {attribute.name !== "Color" && 
                 attribute.name !== "Size" && 
                 attribute.name !== "Capacity" && 
                 attribute.name !== "With USB 3 ports" && 
                 attribute.name !== "Touch ID in keyboard" && (
                   <p>{`${attribute.name}: ${attribute.value}`}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ProductCart_Attributes;
