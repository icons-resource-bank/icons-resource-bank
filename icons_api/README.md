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

Then, you can start the development server:

```bash
python -m app
```

## Deployment

For production, the API is run using Uvicorn. To deploy the API, run the following command:

```bash
uvicorn app:app
```