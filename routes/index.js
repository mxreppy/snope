var express = require('express');
var router = express.Router();

var zip = require('./get_info_by_zip');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Zip data SOAP wrapper'});
});

/* GET zipdata */
function get_zip(request_zip, res) {
    if (request_zip) {
        zip.zipdata(request_zip, function (err, data) {

            if (err) {
                res.status(400).json({
                    'success': false,
                    'error': 'error from soap service',
                    'soap_error': err
                });
            }
            else {
                console.log('happy path returning');
                res.json(data);
            }
        });
    } else {
        res.status(400).json({
            'success': false,
            'error': 'zip parameter required'
        });
    }
}
router.get('/zipdata', function (req, res) {
    var request_zip = req.query.zip;
    get_zip(request_zip, res);
});

router.post('/zipdata', function( req, res ) {
    var request_zip = req.body.zip;
    get_zip(request_zip, res);
} );

module.exports = router;
