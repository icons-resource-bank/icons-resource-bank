# iCons Resource Bank

Welcome to the frontend for the iCons Resource Bank project.

## Development

This project uses `pnpm` as the package manager. If you don't have `pnpm` installed, you can install it by running:

```bash
$ npm install -g pnpm
```

To get started with development, clone this repository and install the dependencies:

```bash
$ cd icons_web
$ pnpm install
```

Then, you can start the development server:

```bash
$ pnpm dev
```

## Deployment

To build the project for deployment, run:

```bash
$ pnpm build
```

You can then serve the built project with:

```bash
$ pnpm start
```

## Linting

This project uses ESLint for linting. You can run the linter with:

```bash
$ pnpm lint
```

To check the formatting of the code, use Prettier:

```bash
$ pnpm prettier
```

Both of these have `:fix` variants that will automatically fix any issues they find:

```bash
$ pnpm lint:fix
$ pnpm prettier:fix
```
