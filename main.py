from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Tuple
from memory import FastWeightMemory

app = FastAPI(title="MEMORA-X Backend API")

# Allow CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize a global memory instance with dimension 128
memory_instance = FastWeightMemory(dim=128)

class StoreRequest(BaseModel):
    cue: str
    target: str

class RetrieveRequest(BaseModel):
    query: str
    top_k: int = 3

class EmailRequest(BaseModel):
    email: str

emails_db = []

@app.post("/api/subscribe")
def subscribe(req: EmailRequest):
    if req.email not in emails_db:
        emails_db.append(req.email)
    return {"status": "success", "message": "Email recorded", "total": len(emails_db)}


@app.get("/")
def read_root():
    return {"message": "Welcome to the MEMORA-X API"}

@app.post("/api/store")
def store(req: StoreRequest):
    meta = memory_instance.store(req.cue, req.target)
    return {"status": "success", "meta": meta}

@app.post("/api/retrieve")
def retrieve(req: RetrieveRequest):
    results = memory_instance.retrieve_text(req.query, req.top_k)
    # Convert list of tuples to list of dicts for JSON serialization
    formatted_results = [{"target": r[0], "confidence": r[1]} for r in results]
    return {"status": "success", "results": formatted_results}

@app.get("/api/status")
def status():
    return {
        "status": "success",
        "memory_load": memory_instance.memory_load(),
        "capacity_ratio": memory_instance.capacity_ratio(),
        "history": memory_instance.update_history
    }

@app.post("/api/reset")
def reset():
    memory_instance.reset()
    return {"status": "success", "message": "Memory reset"}
