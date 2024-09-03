# 🏞 {{ cookiecutter.__web_project_title }}

The Web UI application written in JavaScript/TypeScript.{% if cookiecutter.npm == "pnpm" %} As described in the [main README.md](../../README.md), the project requires you to have [pnpm](https://pnpm.io/installation) installed globally.{% endif %}

The technologies used in this project are:

- [React](https://reactjs.org/) - a JavaScript library for building rich and interactive user interfaces.
- [React Router](https://reactrouter.com/) - a JavaScript library for building declarative client-side routing in React applications.
- [Shadcn UI](https://ui.shadcn.com/) - a collection of reusable UI components based on [Tailwind CSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/).
- [Zustand](https://docs.pmnd.rs/zustand) - a small, fast, and scalable state management library for React.
- [Vite](https://vitejs.dev/) - a fast frontend build tool for modern web projects.

The following tools are used to maintain the code quality:

- [Jest](https://jestjs.io/) - a JavaScript testing framework.
- [ESLint](https://eslint.org/) - a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [Prettier](https://prettier.io/) - an opinionated code formatter.
- [TypeScript](https://www.typescriptlang.org/) - a typed superset of JavaScript that compiles to plain JavaScript.

## 🏃‍♂️ How to run it locally

1. Go to the project's [root](../..) directory.
1. _If you use **`nvm`**_: Run `nvm install` to install the correct Node.js version.
1. _If you use **`nvm`**_: Run `nvm use` to use the correct Node.js version.
1. Run `{{ cookiecutter.npm }} install` to install all the project's dependencies.
1. Fill in the required environment variables in the [`./.env`](./.env) file.
1. Run `{{ cookiecutter.__npm_run }} compose:bootstrap` - this command will spin up the Docker Compose local environment required for the [backend API](../api/README.md).
1. Run the application:
   - If you want to run the Web UI together with API application, then run `{{ cookiecutter.__npm_run }} start:dev`
   - If you want to run the Web UI application separately, then run `{{ cookiecutter.__npx }} nx run web:start:dev`
1. Open [http://localhost:3030](http://localhost:3030) with your browser to see the Web UI up and running.

### 📕 If you want to run UI Storybook

1. Run `{{ cookiecutter.__npx }} run storybook:start` to start [Storybook](https://storybook.js.org/) in the development mode.
1. Open [http://localshost:3033](http://localshost:3033) to preview UI components.

## 📜 Available CLI commands

Apart from the `{{ cookiecutter.npm }}` commands available in the [root](../..) directory, the following CLI commands are also available in the current `web` application directory:

- `{{ cookiecutter.__npm_run }} lint` - runs ESLint in check mode.
- `{{ cookiecutter.__npm_run }} lint:fix` - runs ESLint in check and fix mode (i.e. it tries to fix the issues that can be fixed automatically).
- `{{ cookiecutter.__npm_run }} tsc` - runs TypeScript compiler in check mode without emitting the compiled files.
- `{{ cookiecutter.__npm_run }} clean` - cleans up the build artifacts (i.e., `dist` directory).
- `{{ cookiecutter.__npm_run }} build` - builds the application for production to the `dist` folder.
- `{{ cookiecutter.__npm_run }} test` - runs the unit test.
- `{{ cookiecutter.__npm_run }} start` - runs the application in the production mode.
- `{{ cookiecutter.__npm_run }} start:dev` - runs the application in the development mode (using Vite development server). The application will be reloaded if you make edits in the source code.
