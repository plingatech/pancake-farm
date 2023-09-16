import { ethers, network } from 'hardhat';
import fs from 'fs';
import readlineSync from 'readline-sync';
import { configs } from '../common/config';
import { ResultType } from '../type/resultType';


async function main() {
    // let result: ResultType;
    const [owner] = await ethers.getSigners();
    // result.signer = owner.getAddress();
    console.log('owner : ', owner.getAddress());
    const isAddressValid = readlineSync.keyInYN('Is the owner address correct? (Y/N)');
    if (!isAddressValid) {
        console.log('Aborted deployment.');
        return;
    }
    const Multicall = await ethers.getContractFactory("Multicall");
    console.log("Deploying Multicall...");
    const multicall = await Multicall.deploy();
    await multicall.deployed();

    const Multicall3 = await ethers.getContractFactory("Multicall3");
    console.log("Deploying Multicall3...");
    const multicall3 = await Multicall3.deploy();
    await multicall3.deployed();

    const SyrupBar = await ethers.getContractFactory("SyrupBar");
    console.log("Deploying SyrupBar...");
    const syrupBar = await SyrupBar.deploy(configs.plgchain.KITKAT);
    await syrupBar.deployed();

    const SousChef = await ethers.getContractFactory("SousChef");
    console.log("Deploying SousChef...");
    const sousChef = await SousChef.deploy(syrupBar.address, configs.plgchain.RewardPerBlock, configs.plgchain.StartBlock, configs.plgchain.EndBlock);
    await sousChef.deployed();

    const MasterChef = await ethers.getContractFactory("MasterChef");
    console.log("Deploying MasterChef...");
    const masterChef = await MasterChef.deploy(configs.plgchain.KITKAT,syrupBar.address,owner.getAddress(),configs.plgchain.KitkatPerBlock,configs.plgchain.StartBlock);
    await masterChef.deployed();
    
    const MasterChefV2 = await ethers.getContractFactory("MasterChefV2");
    console.log("Deploying MasterChefV2...");
    const masterChefV2 = await MasterChefV2.deploy(masterChef.address, configs.plgchain.KITKAT, configs.plgchain.MASTER_PID,owner.getAddress());
    await masterChefV2.deployed();
    
    console.log('KITKAT address is ', configs.plgchain.KITKAT);
    console.log('Multicall address is ', multicall.address);
    console.log('Multicall3 address is ', multicall3.address);
    console.log('SyrupBar address is ', syrupBar.address);
    console.log('SousChef address is ', sousChef.address);
    console.log('MasterChef address is ', masterChef.address);
    console.log('MasterChefV2 address is ', masterChefV2.address);

    const result: ResultType = {
        kitkatToken: configs.plgchain.KITKAT,
        syrupBar: syrupBar.address,
        sousChef: sousChef.address,
        masterChefV1: masterChef.address,
        masterChefV2: masterChefV2.address,
        multicall: multicall.address,
        multicall3: multicall3.address,
        signer: owner.getAddress(),
      };

    fs.writeJson(`../deployments/plinga.json`, result, { spaces: 2 })
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
