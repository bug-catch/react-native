"use strict";
import Perfume from "perfume.js";
import { xhrPost, newEvent } from "./api";

// Global vitals object
const vitalsData = {};

/**
 * Send all web vitals that have been gathered (some may be left out as the data is collected individually)
 * @param {object} userOptions global options object
 */
const sendVitals = (vitalsData, userOptions) => {
    if (vitalsData["hasSent"]) return false;

    if (userOptions.logEvents)
        console.log("[Bug Catch] vitalsData", vitalsData);

    // Send web vitals data to server
    xhrPost(
        `${userOptions.base_url}/vitals`,
        newEvent("vitals", vitalsData, userOptions)
    );

    vitalsData["hasSent"] = true;
};

/**
 * Web Vitals (via perfume.js)
 * @param {object} userOptions global options object
 */
export const initVitals = (userOptions) => {
    new Perfume({
        analyticsTracker: (options) => {
            const { metricName, data, navigatorInformation } = options;

            if (!vitalsData["navigatorInformation"])
                vitalsData["navigatorInformation"] = navigatorInformation;

            vitalsData[metricName] = data;

            // Check required web vitals data has been collected
            const hasRequiredVitals = () => {
                let isTrue = true;

                userOptions.requiredVitals.forEach((prop) => {
                    if (!vitalsData.hasOwnProperty(prop)) isTrue = false;
                });

                return isTrue;
            };

            // Check required data has been collected
            if (
                Object.keys(vitalsData).length >=
                    userOptions.requiredVitals.length &&
                hasRequiredVitals()
            ) {
                sendVitals(vitalsData, userOptions);
            }
        },
    });
};
