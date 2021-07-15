import React from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"
import { SHA3 } from 'sha3';
import * as Elliptic from 'elliptic';

const ec = new Elliptic.ec('p256');

function hashMsgHex(msgHex) {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, 'hex'));
  return sha.digest();
}

function signWithKey(privateKey, data) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMsgHex(data));
  const n = 32; // half of signature length?
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
}

interface Account {
  address: string;
  publicKey: string;
  privateKey: string;
  keyId: number;
}

export const buildAuthorization = ({ address, keyId, privateKey }) => (
  account
) => ({
  ...account,
  tempId: address,
  addr: address,
  keyId: keyId,
  resolve: null,
  signingFunction: (data) => {
    return {
      addr: address,
      keyId: keyId,
      signature: signWithKey(privateKey, data.message),
    };
  },
});

const admin: Account = {
  address: 'db16a5e14c410280',
  publicKey:
    '8f2674b2757a11915d44bcd481bf92f1662fb7828a82db5173a8964aa0579e1c382cfd6c1ac37236cb06ebc17343b72b42ccc6babc87c9676e05fe351a7e5c69',
  privateKey:
    '5a92a4f5614f276b6f2ed4d81f01729a3b1d9b44afe71bf46bb10d058b249fb9',
  keyId: 0,
};

async function handleTransaction(description: string, args: any) {
  try {
    console.log(description);
    const transaction = await fcl.send(args);
    console.log('-->', transaction.transactionId);
    await fcl.tx(transaction).onceSealed();
    console.log('OK');
  } catch (e) {
    console.log('KO : ', e);
  }
}

export function MintCluster({name, array, address}){
async function mint() {
  console.log('Ping...');
  await fcl.send([fcl.ping()]);
  console.log('OK');

  await handleTransaction('Sending transaction...', [
      fcl.transaction`
      import Toast from 0xdb16a5e14c410280

      transaction(metadata: {String: String}, address: String) {
      
          let receiverRef: &{Toast.NFTReceiver}
          let minterRef: &Toast.NFTMinter
      
          prepare(acct: AuthAccount) {
      
              self.receiverRef = acct.getCapability<&{Toast.NFTReceiver}>(/public/Receiver)
                  .borrow()
                  ?? panic("Could not borrow receiver reference")
              
              self.minterRef = acct.borrow<&Toast.NFTMinter>(from: /storage/Minter)
                  ?? panic("Could not borrow minter reference")
          }
      
          execute {
      
              let newNFT <- self.minterRef.mintNFT(initAddress: address)
              
              self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
              log("NFT Minted and deposited to the Current user's Collection")
          }
      }
    `,
    fcl.payer(buildAuthorization(admin)),
    fcl.proposer(buildAuthorization(admin)),
    fcl.authorizations([buildAuthorization(admin)]),
    fcl.args([
      fcl.arg(
      [
        {key: "name", value: name},
        {key: "color", value: array},
      ],  
      t.Dictionary([
        {key: t.String, value: t.String},
        {key: t.String, value: t.String},
      ])
      ),
      fcl.arg(address, t.String) 
    ]),
    fcl.limit(100),
  ]);

}
return (
  <div>
    <button onClick={mint}>Mint</button>
  </div>
);
}

