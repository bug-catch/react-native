/**
 * Post request
 *
 * @param {string} url address to post to
 * @param {object} data object to send
 */
export const xhrPost = (url, data) => {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};
