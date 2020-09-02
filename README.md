# Bug Catch
Catch all errors and log custom events within any website.

[__Browser__](https://github.com/bug-catch/browser) / [Server](https://github.com/bug-catch/server)




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
	release:  "2.1.0"
	          ^^^^^^^ --> process.env.npm_package_version
});
```

__Thats it!__ - sit back and try not to panic as the bugs roll in!




<br>

## How It Works

### Catching Errors
bugcatch makes use of the `window.onerror` function to catch each error and its details.

```javascript
window.onerror = function( message, url, line, column, error ) {};
```



<br>

## License
[Apache-2.0 License](LICENSE)
