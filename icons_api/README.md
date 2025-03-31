# iCons Resource Bank

Welcome to the backend for the iCons Resource Bank project.

## Development

First clone this repository, create a virtual environment, and install the dependencies:

```bash
$ cd icons_api
$ python -m venv .venv

$ .venv\Scripts\activate  # Windows
$ source .venv/bin/activate  # macOS / Linux

$ pip install -r requirements.txt
```

You must now create a `.env` file in the `icons_api` directory. See `.env.example` for the required environment variables.

Then, after initializing the database, you can start the development server:

```bash
python -m app
```

#### Database

The PostgreSQL database can be managed with a builtin CLI. To migrate the database, run the following command:

```bash
python -m app.db migrate
```

See additional commands by running:

```bash
python -m app.db --help
```

#### S3 Bucket

The API uses an S3 bucket to store resources. The details for the bucket must be provided in the `.env` file. The production bucket is currently using Cloudflare R2.

## Deployment

For production, the API is run using Uvicorn. To deploy the API, run the following command:

```bash
APP_ENV=production uvicorn app:app
```
