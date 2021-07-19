import {TokenCluster2} from '../clusters/token-cluster2'
import {useCurrentUser} from '../hooks/current-user'
import React from 'react'
import {ErrorTokenCluster} from '../clusters/error-token-cluster'

export default () => {

function Token() {
    const cu = useCurrentUser()
    if(cu.addr) {
    return (
      <TokenCluster2 addresss={"0xdb16a5e14c410280"} address={cu.addr} />
    )
    } 
    else {
      return (
        <ErrorTokenCluster />
      )
    }
  }

  return (
    <div>
      <Token />
    </div>
  );
} 