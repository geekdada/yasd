<p align="center">
  <a href="https://github.com/geekdada/yasd">
    <img width="300" src="public/github-banner.png" alt="logo">
  </a>
</p>

# Yet Another Surge Dashboard

> STILL IN ALPHA

![Github Actions][github-actions-image]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

[codecov-image]: https://codecov.io/gh/geekdada/yasd/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/geekdada/yasd
[david-image]: https://img.shields.io/david/geekdada/yasd.svg?style=flat-square
[david-url]: https://david-dm.org/geekdada/yasd
[snyk-image]: https://snyk.io/test/github/geekdada/yasd/badge.svg?targetFile=package.json
[snyk-url]: https://snyk.io/test/github/geekdada/yasd?targetFile=package.json
[github-actions-image]: https://github.com/geekdada/yasd/workflows/Node%20CI/badge.svg

[中文](/README_zh-CN.md) | [English](/README.md)

## What is YASD?

Starts from Surge iOS 4.4.0 and Surge Mac 4.0.0, you may use [HTTP API](https://manual.nssurge.com/others/http-api.html) to control Surge. YASD provides a way to interact with Surge's HTTP API, enabling you to control Surge from another device or outside your house.

YASD isn't in its final shape, so please be patient if you find anything you aren't happy with 😎.

## How-to

Right now, Surge doesn't support HTTPS API endpoints, so it's almost impossible to use HTTPS. If you find a way to proxy the HTTP API with HTTPS, you will be able to take advantages of many useful features such as the PWA.

We provide both HTTP and HTTPS website:

- [HTTP](http://yasd.nerdynerd.org)
- [HTTPS](https://yasd.royli.dev)

## Known issues

- Error handling isn't ideal, try reloading if anything snaps.
- i18n hasn't been implemented yet (0%), my apology to those who can't read Chinese or English.

## Roadmap

- [ ] Better PWA support
- [ ] i18n
- [ ] Manage and inspect requests
- [ ] Write and debug scripts
- [ ] Manage DHCP devices
- [ ] Full unit and e2e tests

## License

[MIT](https://github.com/geekdada/yasd/blob/master/LICENSE)
