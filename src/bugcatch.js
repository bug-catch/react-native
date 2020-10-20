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

    /*
     * Handle error events
     *
     * @param {object} error event object
     */
    const onError = (evt) => {
        // Collect error data from event
        const data = {
            message: evt.message,
            filename: evt.filename,
            line: evt.lineno,
            column: evt.colno,
            error: evt.error,
        };

        // Send incident data to server
        xhrPost(`${options.base_url}/error`, {
            data: data,
            release: options.release,
        });

        return true;
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

            // Listen to uncaught errors
            window.addEventListener("error", onError);
        },
    };
})();
