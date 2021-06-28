# Escape Zoom (escape-zoom), front-end SPA

Online collaboration escape room

## Setup

### Install Quasar CLI
Follow the instructions on https://quasar.dev/quasar-cli/installation

### Install the dependencies
```bash
npm install
```

### Setup environment variables
Remove the .example suffix from src/dev.env.example and src/prod.env.example
Set the urls for the websocket server, for development and production mode.

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## Hosting
The front-end SPA can be hosted on Google Firebase (http://firebase.google.com/), Heroku (https://www.heroku.com/) or any online platform that allows you to run static single page applications.