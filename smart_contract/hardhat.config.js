// https://eth-rinkeby.alchemyapi.io/v2/ettJOEsaMm-tXxzetKx2aYct-iEEMXn-

require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby : {
      url : 'https://eth-rinkeby.alchemyapi.io/v2/ettJOEsaMm-tXxzetKx2aYct-iEEMXn-',
      accounts : [ '6605b1fab2bd12766b8b9f8a8ae1d5f113b8aad38ef78905863eed6472ab416a' ]
    }
  }
}