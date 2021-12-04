# Bug Catch

Catch all errors and log custom events within any website.

[**Browser**](https://github.com/bug-catch/browser) / [Server](https://github.com/bug-catch/server)

## Usage

### Install

```bash
$ npm install --save @bug-catch/browser
```

### Initiate

`init` Bugcatch as-soon-as-possible within your code.

```javascript
Bugcatch.init({
    base_url: "https://example.com/bugcatch",
    release: "2.1.0",
    //       ^^^^^^^ --> process.env.npm_package_version
    disableWebVitals: false,
    disableError: false,
    disableUnhandledRejection: false,
});
```

**Thats it!** - sit back and try not to panic as the bugs roll in!

<br>

## How It Works

### Catching Errors

bugcatch makes use of the `error` and `unhandledrejection` event listeners to catch each error and its details.

```javascript
// Listen to uncaught errors
window.addEventListener("error", onError);

// Listen to uncaught promises rejections
window.addEventListener("unhandledrejection", onError);
```

### [Web Vitals](https://web.dev/vitals)

bugcatch also gathers web vitals data on things like LCP (Largest Contentful Paint) & TTFB (Time To First Byte).

<br>

## License

[Apache-2.0 License](LICENSE)
