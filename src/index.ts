import {
    JSExceptionHandler,
    setJSExceptionHandler
} from "react-native-exception-handler";

export type DefaultOptions = {
    baseUrl: string;
    release: string;
    logEvents?: boolean;
    disableExceptionHandler?: boolean;
};

class BugCatch {
    baseUrl: string;
    release: string;
    logEvents: boolean;
    disableExceptionHandler: boolean;

    constructor(userOptions: DefaultOptions) {
        this.baseUrl = userOptions.baseUrl;
        this.release = userOptions.release;
        this.logEvents = userOptions.logEvents ?? false;
        this.disableExceptionHandler = userOptions.disableExceptionHandler ?? false;

        if (!this.disableExceptionHandler) {
            // Register error handler for react-native
            setJSExceptionHandler((error, isFatal) => {
                if (this.logEvents) console.error("[Bug Catch] Error", error, isFatal);
                this.onError(error, isFatal);
            });
        }
    }

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
    private _newEvent = (type: any, data: any) => {
        return {
            type: type,
            data: data,
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
    recordEvent = (name: string, data: any) => {
        if (this.logEvents) console.log(`[Bug Catch] Event: ${name}`, { name, data });

        // Send incident data to server
        this._catchEvent(this._newEvent(name, data));
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
