;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Bugcatch = factory();
  }
}(this, function() {
"use strict";
const Bugcatch = (function () {
    /*
     * Default options object
     */
    const options = {
        base_url: "",
        release: "0.0.0",
        disableError: false,
        disableUnhandledRejection: false,
    };

    /*
     * Set options object
     *
     * @param {object} user options
     */
    const setOptions = (userOptions) => {
        Object.assign(options, userOptions);
    };

    /*
     * Post request
     *
     * @param {string} url address to post to
     * @param {object} data object to send
     */
    const xhrPost = (url, data) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        } catch (error) {
            console.log(error);
        }
    };

    return {
        /*
         * Initialise bug-catch to catch all errors
         *
         * @param {string} base_url of bug-catch/server
         * @param {string} release version of web-app
         */
        init: function (userOptions) {
            setOptions(userOptions);

            window.onerror = function (message, url, line, column, error) {
                // Collect error data
                // and send to server
                xhrPost(`${options.base_url}/error`, {
                    data: {
                        message: message,
                        url: url,
                        line: line,
                        column: column,
                        error: error,
                    },
                    release: options.release,
                });

                return true;
            };
        },
    };
})();

return Bugcatch;
}));
