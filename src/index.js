const express = require('express')
const app = express()
const cors = require('cors')
const fetch = require('node-fetch');
const port = process.env.PORT || 8080;
const delegationApiUrl = process.env.API_URL || "https://internal-delegation-api.elrond.com";
const domainUrl = process.env.NODE_ENV === 'production' ? process.env.DOMAIN_URL : "localhost";

const corsOptions = {
    origin: domainUrl,
}

// Middleware
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(cors(corsOptions))
}

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

app.listen(port, () => {
    console.log(`Server started on ${port}`)
  })