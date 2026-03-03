# KROS - publication portal

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Requirements

- [node.js](https://nodejs.org/en/download/) v20+ (tested on 25.2.0)

## How to run

Run `npm install` to install all required dependencies.


Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Environment Configuration

The application uses Angular file replacements for environment configuration.

Base configuration file:
src/environments/environment.ts

Environment-specific overrides:
- environment.development.ts
- environment.prod.ts

Angular automatically replaces the environment file depending on the build configuration.

To configure API settings, update the appropriate environment file for your target configuration.

### API configuration
The application was developed against the public API:

https://gorest.co.in/

To use the real API:

1. Create an account at gorest.co.in

2. Generate an access token:
https://gorest.co.in/my-account/access-tokens

3. Copy the token into the environment configuration:

```
export const environment = {
  api: 'https://gorest.co.in/public/v2',
  token: 'PLACE_YOUR_API_TOKEN_HERE',
  useMockApi: true,
};
```

If useMockApi is set to:

true → application runs using a mocked API (default, token not required)

false → real API is used and a valid token is required

## Architecture Overview

The application follows a feature-based structure:

- core/ – global services (authentication, API configuration, error handling)
- features/ – feature modules (posts, comments)
- shared/ – reusable UI components

### State Management

The application uses:

- Angular Signals
- rxResource()
- Feature-scoped data services as reactive state containers

### Data Handling

- Infinite scrolling for posts
- Local state updates after create / update / delete
- Resource caching strategy
- Derived view models via computed signals

## Features

- Responsive web design
- Multilanguage support (i18n)
- Infinite scrolling for posts
- Reactive state management using Angular Signals
- CRUD operations for posts and comments
- Layout switching (list / detail view)
- Mock API mode for development

## Tech Stack

- Angular 21
- Angular Signals
- RxJS
- Angular Material
- GoREST API (or Mock API mode)
