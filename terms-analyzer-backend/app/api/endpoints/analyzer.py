from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_api_key
from app.models.schemas import TermsAnalysisRequest, TermsAnalysisResponse
from app.services.mistral import mistral_service

router = APIRouter()

@router.post("/analyze", response_model=TermsAnalysisResponse)
async def analyze_terms(
    request: TermsAnalysisRequest,
    api_key: str = Depends(get_api_key)
):
    try:
        analysis = await mistral_service.analyze_terms(request.text)
        return TermsAnalysisResponse(analysis=analysis)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing terms: {str(e)}"
        ) 