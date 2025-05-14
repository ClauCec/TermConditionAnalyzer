from pydantic import BaseModel

class TermsAnalysisRequest(BaseModel):
    text: str

class TermsAnalysisResponse(BaseModel):
    analysis: str
    status: str = "success" 