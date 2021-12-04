"use strict";
import Perfume from "perfume.js";

// Global vitals object
const vitalsData = {};

/**
 * Web Vitals (via perfume.js)
 *
 * @param {*} cb callback for data collection
 */
export const initVitals = (cb) => {
    new Perfume({
        analyticsTracker: (options) => {
            const { metricName, data, navigatorInformation } = options;

            if (!vitalsData["navigatorInformation"])
                vitalsData["navigatorInformation"] = navigatorInformation;

            vitalsData[metricName] = data;
            if (Object.keys(vitalsData).length >= 5) console.log(vitalsData);
        },
    });
};
