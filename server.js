/**
 * Created by mikey on 2/3/15.
 */
var soap = require('soap');

var wsdl_url = 'http://www.webservicex.net/uszip.asmx?WSDL';

var util = require('util');

var args = {USZip: "01002"};

var _client = null;

var get_zipdata_soap = function( zipcode, callback ){

    _client.GetInfoByZIP(
        // args for the soap call
        {
            USZip: zipcode
    },
        // callback to handle soap result
        function( zip_err, result, raw, soapHeader) {
            if( zip_err) {
                console.error("Zip Error");
                console.error(zip_err);

                return callback(zip_err);
            }
            // happy path
            var zipdata = result.GetInfoByZIPResult.NewDataSet.Table;

            // return
            callback(null, zipdata);
    } );
};

soap.createClient(wsdl_url, function(err, client) {
    if( err ) {
        console.error(err);

        throw err;
    } else {
        console.log("got client");

        _client = client;

        //console.log(util.inspect(client, {maxDepth:1}));
        //console.log( client.describe());

        console.log('now what? -- calling GetInfoByZIP ');

        client.GetInfoByZIP( args, function( zip_err, result, raw, soapHeader ) {
            if( zip_err ) {
                console.error( 'error!');
                
                console.error(zip_err);

                throw zip_err;
            } else {
                console.log("got zip result");
                console.log( util.inspect( result, {maxDepth:4} ) );

                console.log("got soap header");
                console.log( util.inspect( soapHeader, {maxDepth:4} ) );
                console.log("raw");
                console.log( util.inspect( raw, {maxDepth:4} ) );

                var thingy = result.GetInfoByZIPResult.NewDataSet.Table;

                console.log ('table:  ' + util.inspect( thingy ));


                // test call function
                console.log( 'calling wrapper function');
                get_zipdata_soap('19143', function( e, data) {
                    console.log( "test callback starting");
                    if( e ) throw e;

                    console.log('test callback data: ')
                    console.log(JSON.stringify(data))

                    console.log('goodbye');
                } );
            }
        } );
    }

});