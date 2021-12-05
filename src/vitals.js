"use strict";
import Perfume from "perfume.js";
import { xhrPost } from "./api";

// Global vitals object
const vitalsData = {};

/**
 * Send all web vitals that have been gathered (some may be left out as the data is collected individually)
 * @param {object} userOptions global options object
 */
const sendVitals = (userOptions) => {
    if (vitalsData["hasSent"]) return false;

    // Send web vitals data to server
    xhrPost(`${userOptions.base_url}/vitals`, {
        data: vitalsData,
        release: userOptions.release,
        location: window.location.href,
    });

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

            // console.log(Object.keys(vitalsData).length, vitalsData);

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
                console.log(vitalsData);
                sendVitals(userOptions);
            }
        },
    });
};
