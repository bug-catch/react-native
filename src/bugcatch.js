"use strict";
const Bugcatch = (function () {
    // Post request
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
        init: function (base_url, release = "0.0.0") {
            window.onerror = function (message, url, line, column, error) {
                // Collect error data
                // and send to server
                xhrPost(`${base_url}/error`, {
                    data: {
                        message: message,
                        url: url,
                        line: line,
                        column: column,
                        error: error,
                    },
                    release: release,
                });
            };
        },
    };
})();
