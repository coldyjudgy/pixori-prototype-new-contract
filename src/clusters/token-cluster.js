import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

export function TokenCluster({addresss, address}) {
  const [nftInfo, setNftInfo] = useState(null)
  const fetchTokenData = async () => {
    const encoded = await fcl
      .send([
        fcl.script`
        import Toast from 0xdb16a5e14c410280

        pub fun main(addresss: Address, address: String): {String: String} {
          let nftOwner = getAccount(addresss)  
          let capability = nftOwner.getCapability<&{Toast.NFTReceiver}>(/public/Receiver)
          let receiverRef = capability.borrow()
              ?? panic("Could not borrow the receiver reference")

          let allMetadata = receiverRef.getMetadata(address: address)
      
          return allMetadata
        }
      `,
      fcl.args([fcl.arg(addresss, t.Address), fcl.arg(address, t.String)]),
      ])
    
    const decoded = await fcl.decode(encoded)
    setNftInfo(decoded) 
  };
  
  fetchTokenData();

  return (
    <div>
      {
        nftInfo &&
        <div>
          Name
            {Object.keys(nftInfo.name)}
          Color
            {Object.keys(nftInfo.color)}
        </div>
      }
    </div>
  );
}