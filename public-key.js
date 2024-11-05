import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { BIP32Factory } from "bip32";
import { readFileSync } from "fs";
import wif from "wif";

bitcoin.initEccLib(ecc);

const bip32 = BIP32Factory(ecc);
const config = JSON.parse(readFileSync("./config.json", "utf-8"));

const signet = {
  messagePrefix: "\x18Bitcoin Signed Message:\n",
  bech32: "tb",
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

const network =
  config.network === "signet"
    ? signet
    : config.network === "testnet"
    ? bitcoin.networks.testnet
    : bitcoin.networks.bitcoin;

export function generateKeys() {
  const decodedWIF = wif.decode(config.privateKey);
  const node = bip32.fromPrivateKey(
    decodedWIF.privateKey,
    Buffer.alloc(32, 0),
    network
  );
  const fullPublicKeyHex = Buffer.from(node.publicKey).toString("hex");

  return fullPublicKeyHex;
}
