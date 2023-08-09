import {
    JSExceptionHandler,
    setJSExceptionHandler
} from "react-native-exception-handler";
import { Alert, BackHandler } from "react-native";
import { modelName, brand, deviceType, osName, osVersion } from "expo-device";

export type DefaultOptions = {
    baseUrl: string;
    release: string;
    logEvents?: boolean;
    captureDeviceInfo?: boolean;
    disableExceptionHandler?: boolean;
    exceptionHandlerCallback?: (err: Error, isFatal: boolean) => void | Promise<void>;
};

class BugCatch {
    baseUrl: string;
    release: string;
    logEvents: boolean;
    captureDeviceInfo: boolean;
    disableExceptionHandler: boolean;
    exceptionHandlerCallback?: DefaultOptions["exceptionHandlerCallback"];
    deviceInfo: any;

    constructor(userOptions: DefaultOptions) {
        this.baseUrl = userOptions.baseUrl;
        this.release = userOptions.release;
        this.logEvents = userOptions.logEvents ?? false;
        this.captureDeviceInfo = userOptions.captureDeviceInfo ?? true;
        this.disableExceptionHandler = userOptions.disableExceptionHandler ?? false;
        this.exceptionHandlerCallback = userOptions.exceptionHandlerCallback;

        if (!this.disableExceptionHandler) {
            // Register error handler for react-native
            setJSExceptionHandler((error, isFatal) => {
                if (this.logEvents) console.error("[Bug Catch] Error", error, isFatal);

                // Send error to server
                this.onError(error, isFatal);

                // Custom error handler
                if (this.exceptionHandlerCallback) {
                    this.exceptionHandlerCallback(error, isFatal);
                } else {
                    Alert.alert(
                        "Unexpected error occurred",
                        `Error: ${isFatal ? "Fatal:" : ""} ${error.name} ${error.message}

We have reported this to our team! Please close the app and start again!
`,
                        [
                            {
                                text: "Close",
                                onPress: () => {
                                    BackHandler.exitApp();
                                }
                            }
                        ]
                    );
                }
            });
        }

        this.deviceInfo = undefined;
        if (this.captureDeviceInfo) this.setDeviceInfo();
    }

    setDeviceInfo = () => {
        try {
            const toLower = (str: any) =>
                typeof str === "string" ? str.toLowerCase() : str;
            this.deviceInfo = {
                name: toLower(modelName),
                brand: toLower(brand),
                device: {
                    0: "unknown",
                    1: "phone",
                    2: "tablet",
                    3: "desktop",
                    4: "tv"
                }[(deviceType as number) || 0],
                os: {
                    name: toLower(osName),
                    version: toLower(osVersion)
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
    private _catchEvent = async (data: any) =>
        new Promise((resolve, reject) => {
            try {
                // Uses `XMLHttpRequest` to maximize compatibility and reduce need for third-party libraries.
                const req = new XMLHttpRequest();
                req.onload = () => resolve(true);
                req.onerror = () => reject(false);
                req.open("POST", `${this.baseUrl}/catch/event`, true);
                req.setRequestHeader("Content-Type", "application/json");
                req.send(JSON.stringify(data));
            } catch (error) {
                reject(error);
                console.error("[Bug Catch] XHR post error:", error);
            }
        });

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
    onError: JSExceptionHandler = async (err, isFatal) => {
        await this._catchEvent(
            this._newEvent("error", {
                err,
                isFatal
            })
        );
    };

    /**
     * Create a new event and submit the data to the API.
     */
    recordEvent = async (name: string, data: any, incidentData: any = undefined) => {
        if (this.logEvents)
            console.log(`[Bug Catch] Event: ${name}`, { name, data, incidentData });

        // Send incident data to server
        await this._catchEvent(this._newEvent(name, data, incidentData));
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
