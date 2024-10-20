import TonWeb from 'tonweb';

import { Address } from "ton-core"; // Ensure you're using the correct library for Address if needed

const Cell = TonWeb.boc.Cell;

export type mintParams = {
    queryId: number | null,
    itemOwnerAddress: string,
    itemIndex: number,
    amount: number,
    commonContentUrl: string
  }

  const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')
  );
  

export function createMintBody(params:mintParams){
    var body = new Cell()
    body.bits.writeUint(1,32)
    body.bits.writeUint(params.queryId || 0,64)
    body.bits.writeUint(params.itemIndex,64)
    body.bits.writeCoins(params.amount)

    const nftItemContent = new Cell();
    nftItemContent.bits.writeAddress(new TonWeb.Address(params.itemOwnerAddress));

    const uriContent = new Cell();
    uriContent.bits.writeString(params.commonContentUrl);

    nftItemContent.refs.push(uriContent);

    body.refs.push(nftItemContent)
    return body

}
