const request = require('request-promise');
const express = require('express');
const url = require("url");
const crypto = require("crypto");
const nonce = require('nonce');
const cookie = require('cookie');

require('dotenv').config()

const app = express();

const baseUrl = "https://api.waveapps.com/";
const scopes = "basic user.read user.write business.read business.write account.read account.write invoice.read invoice.write";


var cryptoToken = crypto.randomBytes(64).toString('hex');



app.get('/', (req, res) => {
    let accessToken = cookie.parse(req.headers.cookie || '').accessToken
    if(accessToken===undefined) {
       res.redirect("/request",)
    }
    res.send('Hello World!')}
)

app.get('/request', (req, res) => {
    var redirectUrl = `${req.protocol}://${req.get('host')}/token`;

    res.redirect(url.format({
        pathname:`${baseUrl}oauth2/authorize/`,
        query: {
           "client_id": process.env.wave_client_id,
           "redirect_uri": redirectUrl,
           "response_type":"code",
           "scope": scopes,
           "state": cryptoToken
         }
      }));
})

app.get("/token", (req, res) => {
    console.log(req.query.code);

    //var redirectUrl = `${req.protocol}://${req.get('host')}/`;

    var redirectUrl = `${req.protocol}://${req.get('host')}/token`;
    console.log(redirectUrl);

    var reqUrl = `${baseUrl}oauth2/token/`;
    console.log(reqUrl);

    var options = {
        uri: reqUrl,
        method: 'POST',
        form: {
            "client_id": process.env.wave_client_id,
            "client_secret": process.env.wave_client_secret,
            "code": req.query.code,
            "redirect_uri" : redirectUrl,
            'grant_type': 'authorization_code'
        },
        headers: {
            "content-type": "application/json"
        }
    }

    request.post(options)
      .then((accessTokenResponse) => {
        res.cookie("accessToken", accessTokenResponse);
        res.redirect("/")
      })
      .catch((error) => {
          console.log(error);
          res.status(error.statusCode).send("Error: "+error);
      });

})


app.listen(3000, () => console.log('Example app listening on port 3000!'))