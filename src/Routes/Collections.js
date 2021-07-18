import {TokenCluster2} from '../clusters/token-cluster2'
import {useCurrentUser} from '../hooks/current-user'
import React from 'react'

export default () => {

function Token() {
    const cu = useCurrentUser()
    return (
      <TokenCluster2 addresss={"0xdb16a5e14c410280"} address={cu.addr} />
    )
  }

  return (
    <div>
      <Token />
    </div>
  );
} 