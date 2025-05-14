const API_BASE_URL = 'http://localhost:8000/api/v1';

class MistralService {
    constructor() {
        this.apiKey = null;
        console.log('MistralService initialized');
    }

    setApiKey(apiKey) {
        console.log('Setting API key:', apiKey ? 'Key provided' : 'No key provided');
        this.apiKey = apiKey;
    }

    async analyzeTerms(text) {
        console.log('Starting terms analysis...');
        console.log('API Key status:', this.apiKey ? 'Set' : 'Not set');
        
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        try {
            console.log('Sending request to:', `${API_BASE_URL}/analyze`);
            console.log('Request payload:', { text: text.substring(0, 100) + '...' });
            
            const response = await fetch(`${API_BASE_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey
                },
                body: JSON.stringify({ text })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Analysis response received');
            return data.analysis;
        } catch (error) {
            console.error('Error analyzing terms:', error);
            throw error;
        }
    }
}

// Create a global instance
window.mistralService = new MistralService(); 