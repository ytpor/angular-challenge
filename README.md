# Angular Challenge

The challenge is to build a UI using Angular.

## Prerequisite

* Node version 20.17.0 or higher
* Angular CLI version 19.2.14 or higher
* [Springboot Challenge](https://github.com/ytpor/angular-challenge)

## Get started

* Clone this repository
* Change directory into the newly cloned repository

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Building Docker Image

```
docker compose build

# -OR-

docker build -t angular-challenge-app .
```

## Running the Docker Image

```
# Using docker compose
docker compose up -d
```

```
# Using docker run
docker run -p 4200:80 angular-challenge-app
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

We use the components from [Ant Design of Angular](https://ng.ant.design/docs/introduce/en)
