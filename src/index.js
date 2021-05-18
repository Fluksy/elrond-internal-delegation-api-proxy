const express = require('express')
const app = express()
const fetch = require('node-fetch');
const port = process.env.PORT || 8080;
const delegationApiUrl = "https://internal-delegation-api.elrond.com";

// Middleware
app.use(express.json())

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

// providers/${this.props.provider.contract}/

app.listen(port, () => {
    console.log(`Server started on ${port}`)
  })