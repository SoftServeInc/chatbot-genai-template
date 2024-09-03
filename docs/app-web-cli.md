# 📜 Web UI application CLI commands

The following CLI commands are available in the API application directory:

- `pnpm lint` - runs ESLint in check mode.
- `pnpm lint:fix` - runs ESLint in check and fix mode (i.e. it tries to fix the issues that can be fixed automatically).
- `pnpm tsc` - runs TypeScript compiler in check mode without emitting the compiled files.
- `pnpm clean` - cleans up the build artifacts (i.e., `dist` directory)
- `pnpm build` - builds the application for production to the `dist` folder.
- `pnpm test` - runs the unit test.
- `pnpm start` - runs the application in the production mode.
- `pnpm start:dev` - runs the application in the development mode (using Vite development server). The application will be reloaded if you make edits in the source code.

Keep in mind that if during the project generation, you have chosen to use `npm` as a package manager instead of `pnpm`, then you need to replace `pnpm` with `npm run` in the above commands.
