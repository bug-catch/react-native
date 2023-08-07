import {
    JSExceptionHandler,
    setJSExceptionHandler
} from "react-native-exception-handler";
import * as Device from "expo-device";

export type DefaultOptions = {
    baseUrl: string;
    release: string;
    logEvents?: boolean;
    captureDeviceInfo?: boolean;
    disableExceptionHandler?: boolean;
};

class BugCatch {
    baseUrl: string;
    release: string;
    logEvents: boolean;
    captureDeviceInfo: boolean;
    disableExceptionHandler: boolean;
    deviceInfo: any;

    constructor(userOptions: DefaultOptions) {
        this.baseUrl = userOptions.baseUrl;
        this.release = userOptions.release;
        this.logEvents = userOptions.logEvents ?? false;
        this.captureDeviceInfo = userOptions.captureDeviceInfo ?? true;
        this.disableExceptionHandler = userOptions.disableExceptionHandler ?? false;
        this.deviceInfo = undefined;
        if (this.captureDeviceInfo) this.setDeviceInfo();

        if (!this.disableExceptionHandler) {
            // Register error handler for react-native
            setJSExceptionHandler((error, isFatal) => {
                if (this.logEvents) console.error("[Bug Catch] Error", error, isFatal);
                this.onError(error, isFatal);
            });
        }
    }

    setDeviceInfo = () => {
        try {
            const toLower = (str: any) =>
                typeof str === "string" ? str.toLowerCase() : str;
            this.deviceInfo = {
                name: toLower(Device.modelName),
                device: {
                    0: "unknown",
                    1: "phone",
                    2: "tablet",
                    3: "desktop",
                    4: "tv"
                }[Device.deviceType || 0],
                os: {
                    name: toLower(Device.osName),
                    brand: toLower(Device.brand),
                    version: toLower(Device.osVersion)
                }
            };

            if (this.logEvents) console.table([this.deviceInfo]);
        } catch (error) {
            console.error("[Bug Catch] Device info error:", error);
        }

        return this.deviceInfo;
    };

    /**
     * Send event data to the server.
     */
    private _catchEvent = (data: any) => {
        try {
            // Uses `XMLHttpRequest` to maximize compatibility and reduce need for third-party libraries.
            const req = new XMLHttpRequest();
            req.open("POST", `${this.baseUrl}/catch/event`, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(data));
        } catch (error) {
            console.error("[Bug Catch] XHR post error:", error);
        }
    };

    /**
     * Create new event object
     */
    private _newEvent = (type: any, data: any, incidentData: any = undefined) => {
        return {
            type,
            data,
            incidentData,
            device: this.deviceInfo,
            release: this.release
        };
    };

    /**
     * Returns current options
     */
    getOptions = () => {
        return {
            baseUrl: this.baseUrl,
            release: this.release,
            logEvents: this.logEvents,
            disableExceptionHandler: this.disableExceptionHandler
        };
    };

    /**
     * Handle error events
     */
    onError: JSExceptionHandler = (err, isFatal) => {
        this._catchEvent(
            this._newEvent("error", {
                err,
                isFatal
            })
        );
    };

    /**
     * Create a new event and submit the data to the API.
     */
    recordEvent = (name: string, data: any, incidentData: any = undefined) => {
        if (this.logEvents)
            console.log(`[Bug Catch] Event: ${name}`, { name, data, incidentData });

        // Send incident data to server
        this._catchEvent(this._newEvent(name, data, incidentData));
    };
}

/**
 * Initialise bug-catch.
 */
export const init = (userOptions: DefaultOptions) => {
    return new BugCatch({
        // Default options
        logEvents: false,
        disableExceptionHandler: false,
        ...userOptions
    });
};

export default BugCatch;
