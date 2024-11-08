import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'L1OFTAdapter'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')
    console.log(`EndpointV2: ${endpointV2Deployment.address}`)

    // The token address must be defined in hardhat.config.ts
    // If the token address is not defined, the deployment will log a warning and skip the deployment
    if (hre.network.config.oftAdapter == null) {
        console.warn(`oftAdapter not configured on network config, skipping OFTWrapper deployment`)
        return
    }

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            hre.network.config.oftAdapter.tokenAddress, // Mainnet USDX ERC-20 address
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
