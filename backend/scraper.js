const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();

module.exports = {

  getPrice: function(url, callback) {
    priceFinder.findItemPrice(url, function(error, price) {
      if (error) {
        console.log(error);
        throw new Error('could not get price for item requested!');
      }
      return callback(price);
    });
  },

  getDetails: function(url, callback) {
    priceFinder.findItemDetails(url, function(error, itemDetails) {
      if(error) {
        console.log(error);
        throw new Error('could not get details for item requested!');
      }
      return callback(itemDetails);
    })
  }

};
