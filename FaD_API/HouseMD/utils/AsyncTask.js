/**
 * @author : Naveen I
 */
function AsyncTask(options) {
    var default_options = {
        delay: 1000,
        maxAttempts: 200,
        when: function() {
            console.log("No condition supplied to Execute!");
        },
        then: function() {},
        otherwise: function(exec) {
            console.log(exec);
        }
    }, _options = {}, _attempts = 0,
        _scope = {}, key, doRun;

    /*jshint forin: true */
    for (key in default_options) {
        if (default_options.hasOwnProperty(key)) {
            _options[key] = (options.hasOwnProperty(key)) ? options[key] : default_options[key];
        }
    }
    /*jshint forin: false */

    doRun = function() {
        try {
            if (_options.when.call(_scope)) {
                _options.then.call(_scope);
            } else {
                if (_attempts < _options.maxAttempts) {
                    _attempts += 1;
                    setTimeout(doRun, _options.delay);
                } else {
                    _options.otherwise.call(_scope, "Failed to run...!!");
                }
            }
        } catch (execp) {
            _options.otherwise.call(_scope, execp);
        }
    };
    doRun(); //Start the async task
}

exports.AsyncTask = AsyncTask;
