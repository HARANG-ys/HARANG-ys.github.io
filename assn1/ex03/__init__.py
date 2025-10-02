from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, world!"}

@app.get("/ping")
async def ping():
    return {"message": "pong"}

@app.get("/greet")
async def greet(name: str = "world"):
    return {"message": f"Hello, {name}!"}