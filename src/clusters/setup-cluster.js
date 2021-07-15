import React from "react";
import * as fcl from "@onflow/fcl";

async function handleTransaction(description, args) {
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
  export function SetupCluster(){
    async function setup() {
      console.log('Ping...');
      await fcl.send([fcl.ping()]);
      console.log('OK');
    
      await handleTransaction('Sending transaction...', [
          fcl.transaction`
          import Toast from 0xdb16a5e14c410280

          transaction {
            prepare(account: AuthAccount) {  
              let collection <- Toast.createEmptyCollection()
    
              account.save<@Toast.Collection>(<-collection, to: /storage/Collection)
              account.link<&{Toast.NFTReceiver}>(/public/Receiver, target: /storage/Collection)
            }
        }
        `,
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(100),
      ]);
    
    }
    return (
      <div>
        <button onClick={setup}>SetUp</button>
      </div>
    );
}
    
    