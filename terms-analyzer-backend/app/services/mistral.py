from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from app.core.config import settings

class MistralService:
    def __init__(self):
        self.client = MistralClient(api_key=settings.MISTRAL_API_KEY)
        self.model = "mistral-medium"  # or "mistral-small" or "mistral-large"

    async def analyze_terms(self, text: str) -> str:
        messages = [
            ChatMessage(role="system", content="You are a legal expert analyzing terms and conditions. Provide a clear, concise analysis focusing on key points, potential risks, and important clauses."),
            ChatMessage(role="user", content=f"Please analyze these terms and conditions:\n\n{text}")
        ]
        
        chat_response = self.client.chat(
            model=self.model,
            messages=messages
        )
        
        return chat_response.choices[0].message.content

mistral_service = MistralService() 