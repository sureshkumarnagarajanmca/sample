var URLSigner = require('./lib/URLSignerService.js');


module.exports = function(options) {
    return new URLSigner(options);
};
