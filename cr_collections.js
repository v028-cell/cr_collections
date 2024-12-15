import { ArchwayClient } from '@archwayhq/arch3.js';
import { SigningArchwayClient } from '@archwayhq/arch3.js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice, calculateFee } from "@cosmjs/stargate";

const network = {
  chainId: 'constantine-3',
  endpoint: 'https://rpc.constantine.archway.tech',
  prefix: 'archway',
};

const mnemonic = 'core wear goose congress elephant afraid amazing diet holiday crush better expect provide envelope involve slide hotel prepare dad zoo fatal media cute already';
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: network.prefix });
const accounts = await wallet.getAccounts();
const client = await SigningArchwayClient.connectWithSigner(network.endpoint, wallet);

const contractAddress = 'archway1x8dugk6pw27j5q6kkv837fgp9ycvu9y7tm99th8x0gmkgu8x346sa55ygj';

const data = {
  collection_name: 'test4',
  token_symbol: 'TS',
  metadata: {
    social_links: {
      website: 'test.website.com',
      medium: 'test.medium.com',
      twitter: 'test.twitter.com',
      instagram: 'test.instagram.com',
      discord: 'test.discord.com',
      telegram: 'test.telegram.com',
    },
    sensitive_content: true,
    finalize_collection: true,
    category: ['pfps', 'memes', 'collectibles', 'photography'],
    description: 'test description',
    banner_image: 'https://ik.imagekit.io/fmivn9lzw/1_AxPM09Ot1.png',
    profile_image: 'https://ik.imagekit.io/fmivn9lzw/1_C_FB4vklOD.png',
    wallet_address: { '0': { address: 'test_wallet', value: '5' }, '1': { address: 'test_wallet_2', value: '5' } }
  }
};

console.log(JSON.stringify(data.metadata));

const createCollectionMsgNew = {
  "add_collection": {
    "msg": {
      "create": {
        "init": {
          "name": data.collection_name,
          "symbol": data.token_symbol,
          "minter": accounts[0].address,
          "metadata": JSON.stringify(data.metadata)
        },
        "label": "Test_"+data.collection_name
      }
    }
  }
};

let send_amount = {
    amount: "1",
    denom: "aconst"
};

const gasPrice = GasPrice.fromString("1000000000000aconst");

const { transactionHash } = await client.execute(
  accounts[0].address,
  contractAddress,
  createCollectionMsgNew,
  calculateFee(500000, gasPrice),
  "test",
  [send_amount]
);

console.log(transactionHash);