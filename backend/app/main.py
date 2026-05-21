from fastapi import FastAPI

app = FastAPI(title="Petone API")

@app.get("/")
def read_root():
    return {"message": "Welcome to Petone API"}

@app.get("/health")
def health():
    return {"status": "ok"}
