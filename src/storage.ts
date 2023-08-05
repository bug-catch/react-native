import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Retrieve data from store.
 */
export const get = async (key: string, isJson = true) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (!value) return null;
        return isJson ? JSON.parse(value) : value;
    } catch (e) {
        // Reading error
        console.error("[Bug Catch] Error loading data from storage", e);
    }
};

/**
 * Store data.
 */
export const set = async (key: string, value: any, isJson = true) => {
    try {
        let storedValue = value;
        if (isJson) storedValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, storedValue);
    } catch (e) {
        // Saving error
        console.error("[Bug Catch] Error saving data to storage", e);
    }
};
