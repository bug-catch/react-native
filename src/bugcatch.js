"use strict";
import { initVitals, vitalsCallback } from "./vitals";

const Bugcatch = (function () {
    /*
     * Default options object
     */
    const options = {
        base_url: "",
        release: "0.0.0",
        disableWebVitals: false,
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
        const data = {};

        // Detect error event
        // separate error and unhandledrejection
        if (evt.error) {
            // Error event
            data.type = evt.type;
            data.message = evt.message;
            data.filename = evt.filename;
            data.line = evt.lineno || -1;
            data.column = evt.colno || -1;
            data.error = {
                name: evt.error.name,
                message: evt.error.message,
                stack: evt.error.stack,
            };
        } else {
            // Promise rejection event
            data.type = evt.type;
            data.message = evt.reason.message;
            data.filename = "";
            data.line = -1;
            data.column = -1;
            data.error = {
                name: evt.reason.name,
                message: evt.reason.message,
                stack: evt.reason.stack,
            };

            // Extract line and column numbers
            // from stack trace
            const stackLinePosition = (/:[0-9]+:[0-9]+/.exec(
                evt.reason.stack
            ) || [""])[0].split(":");

            if (stackLinePosition.length === 3) {
                data.line = Number(stackLinePosition[1]);
                data.column = Number(stackLinePosition[2]);
            }
        }

        // Send incident data to server
        xhrPost(`${options.base_url}/error`, {
            data: data,
            release: options.release,
            location: window.location.href,
        });

        return true;
    };

    return {
        /*
         * Initialise bug-catch to catch all errors
         *
         * @param {object} user options
         */
        init: function (userOptions) {
            setOptions(userOptions);

            // Listen to uncaught errors
            if (!options.disableError)
                window.addEventListener("error", onError);

            // Listen to uncaught promises rejections
            if (!options.disableUnhandledRejection)
                window.addEventListener("unhandledrejection", onError);

            // Web Vitals
            if (!options.disableWebVitals) initVitals(vitalsCallback);
        },
    };
})();

// module.exports = Bugcatch;
export default Bugcatch;
