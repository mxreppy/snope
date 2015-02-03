/**
 * Created by mikey on 2/3/15.
 */


var soap = require('soap');

var wsdl_url = 'http://www.webservicex.net/uszip.asmx?WSDL';

var util = require('util');

var args = {USZip: 01002};

soap.createClient(wsdl_url, function(err, client) {
    if( err ) {
        console.error(err);

        throw err;
    } else {
        console.log("got client");

        //console.log(util.inspect(client, {maxDepth:1}));
        console.log( client.describe());

        console.log('now what? -- calling GetInfoByZIP ');

        client.GetInfoByZIP( args, function( zip_err, zip_result ) {
            if( zip_err ) {
                console.error(zip_err);

                throw zip_err;
            } else {
                console.log("got zip result");
                console.log( util.inspect( zip_result, {maxDepth:4} ) );
            }
        } );
    }
    //client.MyFunction(args, function(err, result) {
    //    console.log(result);
    //});
});