# Video Service (FastAPI)

This folder contains the separate video upload microservice scaffold.

Run locally (example):

```bash
uvicorn video.fastapi_app:app --host 0.0.0.0 --port 8001 --reload
```

The service is prepared to use the same shared PostgreSQL environment variables as the Django services.
