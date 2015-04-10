var soap = require('soap');

var wsdl_url = 'http://www.webservicex.net/uszip.asmx?WSDL';

var util = require('util');

var _client = null;


var get_zipdata_soap = function (zipcode, callback) {

    console.log('soap call for zip ' + zipcode);

    _client.GetInfoByZIP(
        // args for the soap call
        {
            USZip: zipcode
        },
        // callback to handle soap result
        function (zip_err, result, raw, soapHeader) {
            if (zip_err) {
                console.error("Zip Error");
                console.error(zip_err);

                return callback(zip_err);
            }
            // happy path
            var zipdata = result.GetInfoByZIPResult.NewDataSet.Table;

            if (!zipdata) {
                console.error('no results for [' + zipcode +
                '], here is the full object');
                console.error(util.inspect(result, {maxDepth: 4}));

                zipdata = {
                    'ZIP': zipcode,
                    'error': 'no data from server'
                }
            }

            // return
            console.log('returning ' + JSON.stringify(zipdata));

            return callback(null, zipdata);
        }
    );
};

soap.createClient(wsdl_url, function (err, client) {
    if (err) {
        console.error(err);

        throw err;
    } else {
        console.log("got client to " + wsdl_url);

        _client = client;
    }
});

module.exports = {
    zipdata: get_zipdata_soap
};
