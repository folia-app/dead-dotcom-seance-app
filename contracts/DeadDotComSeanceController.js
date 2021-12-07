export default {
  // "contractName": "DeadDotComSeanceController",
  abi: [
    {
      constant: true,
      inputs: [],
      name: 'adminWallet',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'latestWorkId',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'paused',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'deadDotComSeance',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'isOwner',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      name: '_works',
      outputs: [
        {
          name: 'exists',
          type: 'bool'
        },
        {
          name: 'paused',
          type: 'bool'
        },
        {
          name: 'saleType',
          type: 'uint8'
        },
        {
          name: 'editions',
          type: 'uint256'
        },
        {
          name: 'printed',
          type: 'uint256'
        },
        {
          name: 'price',
          type: 'uint256'
        },
        {
          name: 'artist',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'adminSplit',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          name: '_deadDotComSeance',
          type: 'address'
        },
        {
          name: '_adminWallet',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'workId',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'artist',
          type: 'address'
        },
        {
          indexed: false,
          name: 'editions',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'price',
          type: 'uint256'
        },
        {
          indexed: false,
          name: '_paused',
          type: 'bool'
        }
      ],
      name: 'newWork',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'workId',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'artist',
          type: 'address'
        },
        {
          indexed: false,
          name: 'editions',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'price',
          type: 'uint256'
        },
        {
          indexed: false,
          name: '_paused',
          type: 'bool'
        }
      ],
      name: 'updatedWork',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'workId',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'editionId',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'tokenId',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'recipient',
          type: 'address'
        },
        {
          indexed: false,
          name: 'paid',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'artistReceived',
          type: 'uint256'
        },
        {
          indexed: false,
          name: 'adminReceived',
          type: 'uint256'
        }
      ],
      name: 'editionBought',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'previousOwner',
          type: 'address'
        },
        {
          indexed: true,
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'OwnershipTransferred',
      type: 'event'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'artist',
          type: 'address'
        },
        {
          name: 'editions',
          type: 'uint256'
        },
        {
          name: 'price',
          type: 'uint256'
        },
        {
          name: '_paused',
          type: 'bool'
        },
        {
          name: 'saleType',
          type: 'uint8'
        }
      ],
      name: 'addArtwork',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'workId',
          type: 'uint256'
        },
        {
          name: '_paused',
          type: 'bool'
        }
      ],
      name: 'updateArtworkPaused',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'workId',
          type: 'uint256'
        },
        {
          name: '_editions',
          type: 'uint256'
        }
      ],
      name: 'updateArtworkEditions',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'workId',
          type: 'uint256'
        },
        {
          name: '_price',
          type: 'uint256'
        }
      ],
      name: 'updateArtworkPrice',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'workId',
          type: 'uint256'
        },
        {
          name: '_artist',
          type: 'address'
        }
      ],
      name: 'updateArtworkArtist',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'recipient',
          type: 'address'
        },
        {
          name: 'workId',
          type: 'uint256'
        },
        {
          name: 'editionId',
          type: 'uint256'
        }
      ],
      name: 'buyByID',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'recipient',
          type: 'address'
        },
        {
          name: 'workId',
          type: 'uint256'
        }
      ],
      name: 'buy',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_adminSplit',
          type: 'uint256'
        }
      ],
      name: 'updateAdminSplit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_adminWallet',
          type: 'address'
        }
      ],
      name: 'updateAdminWallet',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: '_paused',
          type: 'bool'
        }
      ],
      name: 'updatePaused',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ],
  networks: {
    4: {
      // "events": {
      //   "0xb930315bb0fbb02e6a5098eda387a015f9b831da0666fd6943731c891a049965": {
      //     "anonymous": false,
      //     "inputs": [
      //       {
      //         "indexed": false,
      //         "name": "workId",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "artist",
      //         "type": "address"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "editions",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "price",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "_paused",
      //         "type": "bool"
      //       }
      //     ],
      //     "name": "newWork",
      //     "type": "event"
      //   },
      //   "0x92544cd0b5fea6142ab048e0ea4e8b55f04fb3c2528b3c918875ed2a7a1a9e47": {
      //     "anonymous": false,
      //     "inputs": [
      //       {
      //         "indexed": false,
      //         "name": "workId",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "artist",
      //         "type": "address"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "editions",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "price",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "_paused",
      //         "type": "bool"
      //       }
      //     ],
      //     "name": "updatedWork",
      //     "type": "event"
      //   },
      //   "0x98d41ea2d99604d19bd920bfa2fde9f14a004bb5f3bbacf3706fc23dd386f499": {
      //     "anonymous": false,
      //     "inputs": [
      //       {
      //         "indexed": false,
      //         "name": "workId",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "editionId",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "tokenId",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "recipient",
      //         "type": "address"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "paid",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "artistReceived",
      //         "type": "uint256"
      //       },
      //       {
      //         "indexed": false,
      //         "name": "adminReceived",
      //         "type": "uint256"
      //       }
      //     ],
      //     "name": "editionBought",
      //     "type": "event"
      //   },
      //   "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
      //     "anonymous": false,
      //     "inputs": [
      //       {
      //         "indexed": true,
      //         "name": "previousOwner",
      //         "type": "address"
      //       },
      //       {
      //         "indexed": true,
      //         "name": "newOwner",
      //         "type": "address"
      //       }
      //     ],
      //     "name": "OwnershipTransferred",
      //     "type": "event"
      //   }
      // },
      // "links": {},
      address: '0x153E09f76A79F5f9610C3bCB5FE9b680F04b07D9'
      // "transactionHash": "0xd26612f7fe39248e6b914a2d0d6cba88d86d824682c4d8a7fd266d89545a841e"
    }
    // "5777": {
    //   "events": {
    //     "0xb930315bb0fbb02e6a5098eda387a015f9b831da0666fd6943731c891a049965": {
    //       "anonymous": false,
    //       "inputs": [
    //         {
    //           "indexed": false,
    //           "name": "workId",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "artist",
    //           "type": "address"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "editions",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "price",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "_paused",
    //           "type": "bool"
    //         }
    //       ],
    //       "name": "newWork",
    //       "type": "event"
    //     },
    //     "0x92544cd0b5fea6142ab048e0ea4e8b55f04fb3c2528b3c918875ed2a7a1a9e47": {
    //       "anonymous": false,
    //       "inputs": [
    //         {
    //           "indexed": false,
    //           "name": "workId",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "artist",
    //           "type": "address"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "editions",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "price",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "_paused",
    //           "type": "bool"
    //         }
    //       ],
    //       "name": "updatedWork",
    //       "type": "event"
    //     },
    //     "0x98d41ea2d99604d19bd920bfa2fde9f14a004bb5f3bbacf3706fc23dd386f499": {
    //       "anonymous": false,
    //       "inputs": [
    //         {
    //           "indexed": false,
    //           "name": "workId",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "editionId",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "tokenId",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "recipient",
    //           "type": "address"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "paid",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "artistReceived",
    //           "type": "uint256"
    //         },
    //         {
    //           "indexed": false,
    //           "name": "adminReceived",
    //           "type": "uint256"
    //         }
    //       ],
    //       "name": "editionBought",
    //       "type": "event"
    //     },
    //     "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0": {
    //       "anonymous": false,
    //       "inputs": [
    //         {
    //           "indexed": true,
    //           "name": "previousOwner",
    //           "type": "address"
    //         },
    //         {
    //           "indexed": true,
    //           "name": "newOwner",
    //           "type": "address"
    //         }
    //       ],
    //       "name": "OwnershipTransferred",
    //       "type": "event"
    //     }
    //   },
    //   "links": {},
    //   "address": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4",
    //   "transactionHash": "0x7f001264902a1595580a52671a09060df4043edba6ff2889a6e4a97a70cbd84d"
    // }
  }
}
