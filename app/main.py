from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from fastapi.responses import JSONResponse

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://*"],  # Allow Chrome extension
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Mistral client
mistral_client = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))

class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    analysis: str

@app.get("/")
async def root():
    return {"message": "Terms Analyzer API is running"}

@app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_terms(
    request: AnalysisRequest,
    x_api_key: Optional[str] = Header(None)
):
    try:
        # Verify API key
        if not x_api_key or x_api_key != os.getenv("MISTRAL_API_KEY"):
            raise HTTPException(status_code=401, detail="Invalid API key")

        # Prepare the prompt
        prompt = f"""Please analyze the following terms and conditions. 
        Focus on identifying key points, potential concerns, and important clauses.
        Format the analysis in a clear, structured way.

        Terms and Conditions:
        {request.text}

        Please provide a detailed analysis."""

        # Get analysis from Mistral
        messages = [
            ChatMessage(role="user", content=prompt)
        ]
        
        chat_response = mistral_client.chat(
            model="mistral-large-latest",
            messages=messages
        )

        return AnalysisResponse(analysis=chat_response.choices[0].message.content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add error handling middleware
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        ) 