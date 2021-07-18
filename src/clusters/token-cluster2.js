import React, { useState } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"
import Collection2 from "../Routes/Collection2"

export function TokenCluster2({addresss, address}) {
  const [nftInfo, setNftInfo] = useState(null)
  const fetchTokenData = async () => {
    const encoded = await fcl
      .send([
        fcl.script`
        import Monday from 0xdb16a5e14c410280

        pub fun main(addresss: Address, address: String): [AnyStruct] {
          let nftOwner = getAccount(addresss)  
          let capability = nftOwner.getCapability<&{Monday.NFTReceiver}>(/public/MondayReceiver)
          let receiverRef = capability.borrow()
              ?? panic("Could not borrow the receiver reference")
      
          return receiverRef.getMetadata(address: address)
        }
      `,
      fcl.args([fcl.arg(addresss, t.Address), fcl.arg(address, t.String)]),
      ])

    const decoded = await fcl.decode(encoded)
    setNftInfo(decoded) 
  };

  const colorArr = new Array();
  fetchTokenData();


  return (
    <div>
      {
        nftInfo &&
        <div>
            {Object.keys(nftInfo).map(k => {
                colorArr[k] = nftInfo[k].color
              return (
                <p>
                  <Collection2 arr1={colorArr[k]} />
 @kwklly
kwklly 2 days ago Author Owner
블록체인에서 받아온 배열을 arr1에 매핑

@kwklly	Reply…
                </p>
              )
            })
            }
        </div>
      }
    </div>
  );

} 