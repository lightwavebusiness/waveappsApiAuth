const request = require('request');
const express = require('express');
const url = require("url");
const crypto = require("crypto");

const app = express();
const baseUrl = "https://api.waveapps.com/";

var cryptoToken = crypto.randomBytes(64).toString('hex');

var config = {
    "wave" : {
        "client_id" : "EgzhF7-HiXtmKg7HwpIjTT-m1huTMC0YtV0KudnA",
        "client_secret" : "It9OGuJ2LON:_JeevNOv8b.4-h@hbIG3srrKoIFBiC!NZr?GobrTi339WMdv6sok?QngwoRrw5Olxx7hWaRQwb.Ag37sBtMsbs-fzbTYUK0arkj-Z4_6Cms1-o@0n_C2"
    }
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/request', (req, res) => {
    var redirectUrl = `${req.protocol}://${req.get('host')}/token`;
console.log(redirectUrl);

    res.redirect(url.format({
        pathname:`${baseUrl}oauth2/authorize/`,
        query: {
           "client_id": config.wave.client_id,
           "redirect_uri": redirectUrl,
           "response_type":"code",
           "scope": "basic",
           "state": cryptoToken
         }
      }));
})


//  user.read user.write	business.read business.write account.read account.write invoice.read invoice.write

app.get("/token", (req, res) => {
    console.log(req.query.code);

    var redirectUrl = `${req.protocol}://${req.get('host')}/`;
    console.log(redirectUrl);

    var reqUrl = `${baseUrl}oauth/token`;
    console.log(reqUrl);


    request({
        url: reqUrl,
        method: 'POST',
        form: {
            "client_id": config.wave.client_id,
            "client_secret": config.wave.client_secret,
            "code": req.query.code,
            "redirect_uri" : redirectUrl,
            'grant_type': 'authorization_code'
        }
      }, function(err, res) {
        var json = JSON.parse(res.body);
        console.log("Access Token:", json);

        
      });

})


app.listen(3000, () => console.log('Example app listening on port 3000!'))