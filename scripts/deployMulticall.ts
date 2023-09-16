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
    
    console.log('KITKAT address is ', configs.plgchain.KITKAT);
    console.log('Multicall address is ', multicall.address);
    console.log('Multicall3 address is ', multicall3.address);
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
