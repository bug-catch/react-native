"use strict";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { post, newEvent } from "./api";

/**
 * Default options object
 */
const options = {
    base_url: "",
    release: "0.0.0",
    logEvents: false,
};

/**
 * Set options object
 * @param {object} userOptions global options object
 */
const setOptions = (userOptions) => {
    Object.assign(options, userOptions);
};

/**
 * Handle error events
 * @param {object} error event object
 */
const onError = (evt, isFatal) => {
    // Collect error data from event
    const data = {
        evt,
        isFatal,
    };

    // Send incident data to server
    post(`${options.base_url}/catch/event`, newEvent("error", data, options));
};

/**
 * Create a new event and submit the data to the API
 * (User-facing abstraction above the 'newEvent' function)
 * @param {string} name event name/type eg, "error"
 * @param {*} data data attached to event
 */
export const recordEvent = (name, data, userOptions) => {
    setOptions(userOptions);

    if (options.logEvents)
        console.log(`[Bug Catch] Event: ${name}`, { name, data });

    // Send incident data to server
    post(`${options.base_url}/catch/event`, newEvent(name, data, options));
};

/**
 * Initialise bug-catch to catch all errors + gather web vitals data
 * @param {object} userOptions global options object
 */
export const init = (userOptions) => {
    setOptions(userOptions);

    // Register error handler for react-native
    setJSExceptionHandler((error, isFatal) => {
        // This is your custom global error handler
        // You do stuff like show an error dialog
        // or hit google analytics to track crashes
        // or hit a custom api to inform the dev team.
        if (options.logEvents) console.log(error, isFatal);

        onError(error, isFatal);
    });
};
