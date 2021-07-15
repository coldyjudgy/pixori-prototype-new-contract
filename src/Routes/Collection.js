import React from 'react';
import {TokenCluster} from '../clusters/token-cluster'
import {ErrorTokenCluster} from '../clusters/error-token-cluster'
import {useCurrentUser} from '../hooks/current-user'

export default () => {

function Token() {
    const cu = useCurrentUser()

    if (cu.addr){
      return (
        <TokenCluster addresss={"0xdb16a5e14c410280"} address={cu.addr} />
      )
    }
    else{
      return(
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