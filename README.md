# Cthunline Web Client

> Cthunline web client made with ViteJS, React, MaterialUI, and more

* [Useful resources](#useful-resources)
* [Requirements](#requirements)
* [Configuration](#configuration)
* [Usage](#usage)

## Useful resources

* [Official documentation](https://doc.cthunline.org/)
* [Docker repository](https://hub.docker.com/r/cthunline/cthunline)
* [Games NPM package](https://www.npmjs.com/package/@cthunline/games)

## Requirements

* NodeJS >= 16

## Configuration

* Copy the `.env.sample` file to `.env`
* Edit the environment variables with correct values

## Usage

### Development

```shell
# Install dependencies
npm install
# Run app in development mode
npm run dev

# Run linters
npm run lint
```

### Production

> In production the web client build is served by the API Express server

```shell
# Install dependencies
npm install
# Build project
npm run build
```
