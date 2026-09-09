from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from memory import engine
import os

app = FastAPI(title="MEMORA-X Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PairRequest(BaseModel):
    cue: str
    target: str

class QueryRequest(BaseModel):
    cue: str

class ParamRequest(BaseModel):
    lambda_val: float
    eta: float

class EmailRequest(BaseModel):
    email: str

emails_db = []

@app.post("/api/subscribe")
def subscribe(req: EmailRequest):
    if req.email not in emails_db:
        emails_db.append(req.email)
    return {"status": "success", "message": "Email recorded", "total": len(emails_db)}

@app.get("/api/experiment/state")
def get_state():
    return engine.get_state()

@app.post("/api/experiment/learn")
def learn_base(req: PairRequest):
    engine.learn_base(req.cue, req.target)
    return engine.get_state()

@app.post("/api/experiment/update")
def update_fast(req: PairRequest):
    engine.update_fast(req.cue, req.target)
    return engine.get_state()

@app.post("/api/experiment/interfere")
def interfere(req: PairRequest):
    engine.interfere(req.cue, req.target)
    return engine.get_state()

@app.post("/api/experiment/erase")
def erase(req: PairRequest):
    is_base = any(m["cue"] == req.cue and m["target"] == req.target for m in engine.base_memory)
    engine.erase_memory(req.cue, req.target, is_base)
    return engine.get_state()

@app.post("/api/experiment/query")
def query_memory(req: QueryRequest):
    results = engine.query(req.cue)
    state = engine.get_state()
    return {"results": results, "state": state}

@app.post("/api/experiment/params")
def update_params(req: ParamRequest):
    engine.set_parameters(req.lambda_val, req.eta)
    return engine.get_state()

@app.post("/api/experiment/reset")
def reset_experiment():
    engine.reset_experiment()
    return engine.get_state()

@app.post("/api/experiment/reset_fast")
def reset_fast():
    engine.reset_fast()
    return engine.get_state()

if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        if catchall.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        return FileResponse("dist/index.html")
