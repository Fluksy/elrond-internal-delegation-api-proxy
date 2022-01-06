const express = require('express')
const app = express()
const cors = require('cors')
const fetch = require('node-fetch');
const port = process.env.PORT || 8080;
const delegationApiUrl = process.env.API_URL || "https://delegation-api.elrond.com";
const origin = process.env.NODE_ENV === 'production' ? process.env.DOMAIN_URL : "*";
const { SmartContract, Address, ContractFunction, ProxyProvider, NetworkConfig, BytesValue } = require('@elrondnetwork/erdjs');

const corsOptions = {
    origin,
}

// Middleware
app.use(express.json())
app.use(cors(corsOptions))

app.get('/accounts/:walletAddress/delegations', (req,res) => {
    const walletAddress = req.params.walletAddress;
    try {
        fetch(`${delegationApiUrl}/accounts/${walletAddress}/delegations`)
        .then(result => result.json())
        .then(delegations => {
            res.status(res.statusCode).json(delegations)
        })
    } catch (error) {
        res.status(404);
        res.send('{error: "an error has occurred."}')
    }
})

app.get('/providers/:smartContractAddress', (req,res) => {
    const smartContractAddress = req.params.smartContractAddress;
    try {
        fetch(`${delegationApiUrl}/providers/${smartContractAddress}`)
        .then(result => result.json())
        .then(providers => {
            res.status(res.statusCode).json(providers)
        })
    } catch (error) {
        res.status(404);
        res.send('{error: "an error has occurred."}')
    }
})

app.get('/mex_burn_amount', async (req,res) => {

        try
        {
            let provider = new ProxyProvider("https://gateway.elrond.com");
            await NetworkConfig.getDefault().sync(provider);
        
            let contract = new SmartContract({ address: new Address("erd1qqqqqqqqqqqqqpgqa0fsfshnff4n76jhcye6k7uvd7qacsq42jpsp6shh2") });
        
            let response = await contract.runQuery(provider, {
                func: new ContractFunction("getBurnedTokenAmount"),
                args: [BytesValue.fromHex('4D45582D343535633537')]
            });
    
            if (response.isSuccess() && !!response?.returnData[0]) {
                const encodedResponse = response?.returnData[0];
                const hexadecimalResponse = Buffer.from(encodedResponse, 'base64').toString('hex');
                const decimalResponse = parseInt(`0x${hexadecimalResponse}`);
                const beautifulResponse = decimalResponse / 1000000000000000000;
                res.status(200).json({mex_burned_amount: beautifulResponse})
            }
            
        } catch (error) {
            res.status(404).json({error})
        }
        // let addressOfAlice = new Address("erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th");

        // erdpy 
        // --verbose contract 
        // query erd1qqqqqqqqqqqqqpgqa0fsfshnff4n76jhcye6k7uvd7qacsq42jpsp6shh2 
        // --proxy=https://gateway.elrond.com --function=getBurnedTokenAmount 
        // --arguments 0x4D45582D343535633537

        // erdpy --verbose contract query erd1qqqqqqqqqqqqqpgqa0fsfshnff4n76jhcye6k7uvd7qacsq42jpsp6shh2 --proxy=https://gateway.elrond.com --function=getBurnedTokenAmount --arguments 0x4D45582D343535633537

        // console.log(`addressOfAlice`, addressOfAlice)
        // let response = await contract.runQuery(provider, {
        //     func: new ContractFunction("getClaimableRewards"),
        //     args: [new AddressValue(addressOfAlice)]
        // });

        // console.log(response.isSuccess());
        // console.log(response.returnData);
})

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})
