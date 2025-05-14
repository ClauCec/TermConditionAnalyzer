document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup DOM loaded');
    
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const termsTextArea = document.getElementById('termsText');
    const analyzeButton = document.getElementById('analyzeButton');
    const analysisContent = document.getElementById('analysisContent');
    const loadingElement = document.getElementById('loading');
    const apiKeyStatus = document.getElementById('apiKeyStatus');

    function updateApiKeyStatus(isSet) {
        console.log('Updating API key status:', isSet ? 'Set' : 'Not set');
        apiKeyStatus.textContent = `API Key: ${isSet ? 'Set' : 'Not Set'}`;
        apiKeyStatus.className = `api-key-status ${isSet ? 'set' : ''}`;
    }

    // Load saved API key
    chrome.storage.local.get(['apiKey'], (result) => {
        console.log('Loading saved API key:', result.apiKey ? 'Found' : 'Not found');
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
            window.mistralService.setApiKey(result.apiKey);
            updateApiKeyStatus(true);
        } else {
            updateApiKeyStatus(false);
        }
    });

    // Check for analysis result to display
    chrome.storage.local.get(['showAnalysis', 'lastAnalysisResult'], (result) => {
        if (result.showAnalysis && result.lastAnalysisResult) {
            console.log('Displaying stored analysis result');
            analysisContent.textContent = result.lastAnalysisResult;
            loadingElement.classList.add('hidden');
            // Optionally clear the flag and result after displaying
            chrome.storage.local.remove(['showAnalysis', 'lastAnalysisResult']);
        }
    });

    // Save API key
    saveApiKeyButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        console.log('Saving API key:', apiKey ? 'Key provided' : 'No key provided');
        
        if (apiKey) {
            chrome.storage.local.set({ apiKey }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving API key:', chrome.runtime.lastError);
                    alert('Error saving API key: ' + chrome.runtime.lastError.message);
                    return;
                }
                
                window.mistralService.setApiKey(apiKey);
                console.log('API key saved and set');
                updateApiKeyStatus(true);
                alert('API key saved successfully!');
            });
        } else {
            alert('Please enter an API key');
        }
    });

    // Handle detected terms
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Received message:', request.action);
        
        if (request.action === 'analyzeTerms') {
            const { links, content, headings, meta, footer } = request.data;
            console.log('Processing detected terms:', {
                links: links.length,
                content: content.length,
                headings: headings.length,
                meta: meta.length,
                footer: footer.length
            });
            
            // Combine all content with language information
            let combinedContent = '';
            
            // Add links
            if (links.length > 0) {
                combinedContent += 'Detected Terms Links:\n';
                links.forEach(link => {
                    combinedContent += `[${link.language.toUpperCase()}] ${link.text}: ${link.url}\n`;
                });
                combinedContent += '\n';
            }
            
            // Add headings
            if (headings.length > 0) {
                combinedContent += 'Detected Terms Headings:\n';
                headings.forEach(heading => {
                    combinedContent += `[${heading.language.toUpperCase()}] ${heading.text}\n`;
                });
                combinedContent += '\n';
            }
            
            // Add content
            if (content.length > 0) {
                combinedContent += 'Detected Terms Content:\n';
                content.forEach(item => {
                    combinedContent += `[${item.language.toUpperCase()}] ${item.text}\n\n`;
                });
            }

            // Add meta information
            if (meta.length > 0) {
                combinedContent += 'Detected Terms Meta Information:\n';
                meta.forEach(item => {
                    combinedContent += `[${item.language.toUpperCase()}] ${item.name}: ${item.content}\n`;
                });
                combinedContent += '\n';
            }

            // Add footer content
            if (footer.length > 0) {
                combinedContent += 'Detected Terms in Footer:\n';
                footer.forEach(item => {
                    combinedContent += `[${item.language.toUpperCase()}] ${item.text}\n`;
                });
            }
            
            console.log('Setting combined content in textarea');
            termsTextArea.value = combinedContent;
        }
    });

    // Analyze terms
    analyzeButton.addEventListener('click', async () => {
        console.log('Analyze button clicked');
        
        const text = termsTextArea.value.trim();
        if (!text) {
            console.log('No text to analyze');
            alert('Please enter some text to analyze');
            return;
        }

        // Check if API key is set
        if (!window.mistralService.apiKey) {
            console.log('API key not set');
            alert('Please save your API key first!');
            return;
        }

        try {
            console.log('Starting analysis...');
            loadingElement.classList.remove('hidden');
            analysisContent.textContent = '';
            
            console.log('Sending analysis request...');
            const analysis = await window.mistralService.analyzeTerms(text);
            console.log('Analysis received:', analysis.substring(0, 100) + '...');
            analysisContent.textContent = analysis;
        } catch (error) {
            console.error('Analysis error:', error);
            analysisContent.textContent = `Error: ${error.message}`;
        } finally {
            loadingElement.classList.add('hidden');
        }
    });
}); 