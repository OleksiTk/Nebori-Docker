import os

from fastapi import FastAPI, File, UploadFile

app = FastAPI(title='Nebori Video Service')


@app.get('/health')
def health_check():
    return {
        'status': 'ok',
        'service': 'video-upload',
        'database': {
            'name': os.environ.get('POSTGRES_DB', 'nebori'),
            'host': os.environ.get('POSTGRES_HOST', 'db'),
        },
    }


@app.post('/upload')
async def upload_video(file: UploadFile = File(...)):
    # Placeholder implementation; persistence and background processing can be added later.
    return {
        'message': 'Video upload placeholder endpoint is ready.',
        'filename': file.filename,
        'content_type': file.content_type,
    }
