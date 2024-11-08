import bs58 from 'bs58'
import { BigNumber, Contract } from "ethers";
import { task, types } from 'hardhat/config'
import { ActionType, HardhatRuntimeEnvironment } from 'hardhat/types'

import { makeBytes32 } from '@layerzerolabs/devtools'
import { EndpointId } from '@layerzerolabs/lz-definitions'

import { getLayerZeroScanLink } from '../solana'

interface TaskArguments {
    dstEid: number
    amount: string
    to: string
}

const action: ActionType<TaskArguments> = async ({ dstEid, amount, to }, hre: HardhatRuntimeEnvironment) => {
    const signer = await hre.ethers.getNamedSigner('deployer')
    console.log(signer.address)
    const tokenName = 'L1OFTAdapter'
    // @ts-ignore
    const token = (await hre.ethers.getContract(tokenName)).connect(signer)

    const address = '0x1D741878DbC5131878Effe913345FD434DCAE0d9'
    // @ts-ignore
    const erc20Token = (await hre.ethers.getContract('MintableUSDXMock')).connect(signer)
    const approvalTxResponse = await erc20Token.approve(token.address, amount, { gasLimit: 200_000 })
    const approvalTxReceipt = await approvalTxResponse.wait()
    console.log(`approve: ${amount}: ${approvalTxReceipt.transactionHash}`)

    const amountLD = BigNumber.from(amount)
    const sendParam = {
        dstEid,
        to: makeBytes32(bs58.decode(to)),
        amountLD: amountLD.toString(),
        minAmountLD: 1n,
        extraOptions: '0x',
        composeMsg: '0x',
        oftCmd: '0x',
    }
    console.dir(sendParam)
    const [msgFee] = await token.functions.quoteSend(sendParam, false, { gasLimit: 500_000 })
    const txResponse = await token.functions.send(sendParam, msgFee, signer.address, {
        value: msgFee.nativeFee,
        gasLimit: 500_000,
    })
    const txReceipt = await txResponse.wait()
    console.log(`send: ${amount} to ${to}: ${txReceipt.transactionHash}`)
    console.log(
        `Track cross-chain transfer here: ${getLayerZeroScanLink(txReceipt.transactionHash, dstEid == EndpointId.SOLANA_V2_TESTNET)}`
    )
}

task('send', 'Sends a transaction', action)
    .addParam('dstEid', 'Destination endpoint ID', undefined, types.int, false)
    .addParam('amount', 'Amount to send in wei', undefined, types.string, false)
    .addParam('to', 'Recipient address', undefined, types.string, false)
