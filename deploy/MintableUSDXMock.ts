import assert from 'assert'

import { configDotenv } from 'dotenv'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'MintableUSDXMock'

const deploy: DeployFunction = async (hre) => {
    configDotenv()
    if (process.env.EXPERIMENTAL != 'true') {
        throw new Error('This deployment script is experimental and must be run with the EXPERIMENTAL flag')
    }
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [],
        log: true,
        skipIfAlreadyDeployed: true,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
