# Bug Catch

Catch all errors and log custom events within any website.

[**React Native**](https://github.com/bug-catch/react-native) / [Server](https://github.com/bug-catch/server)

## Usage

### Install

```bash
$ npm install --save @bug-catch/react-native
```

### Initiate

Call Bugcatch as-soon-as-possible within your code.

```javascript
bugcatch.init({
    base_url: "https://example.com/bugcatch",

    // Optional
    release: "2.1.0",
    //       ^^^^^^^ --> process.env.npm_package_version
});
```

**Thats it!** - sit back and try not to panic as the bugs roll in!

<br>

You can also use the `recordEvent` method to record custom events with data attached (the data can be of any type and size).

```javascript
bugcatch.recordEvent(name, data, userOptions);

// Crude Example,
// An event for users which stay on the page longer than 10 minutes
setTimeout(function () {
    bugcatch.recordEvent(
        "loyal_viewer",
        { timeOnPage: "10 minutes" },
        {
            base_url: "https://example.com/bugcatch",
            release: "2.1.0",
        }
    );
}, 1000 * 60 * 10);
```

<br>

## License

[Apache-2.0 License](LICENSE)
