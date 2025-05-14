// Store detected terms for each tab
const detectedTerms = new Map();
let lastAnalysisResult = null;

// Handle terms detection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'termsDetected') {
        const tabId = sender.tab.id;
        detectedTerms.set(tabId, request.data);
        
        // Show notification
        chrome.notifications.create('terms_detected', {
            type: 'basic',
            iconUrl: 'icon48.png',
            title: 'Terms and Conditions Detected',
            message: 'Would you like to analyze the terms and conditions on this page?',
            buttons: [
                { title: 'Analyze' },
                { title: 'Dismiss' }
            ],
            requireInteraction: true
        });
    }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
    if (notificationId === 'terms_detected' && buttonIndex === 0) { // Analyze button
        // Get current tab
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            const currentTab = tabs[0];
            const terms = detectedTerms.get(currentTab.id);
            if (terms) {
                // Combine all detected text for analysis
                let combinedText = '';
                if (terms.links) terms.links.forEach(link => combinedText += link.text + '\n');
                if (terms.headings) terms.headings.forEach(h => combinedText += h.text + '\n');
                if (terms.content) terms.content.forEach(c => combinedText += c.text + '\n');
                if (terms.meta) terms.meta.forEach(m => combinedText += m.content + '\n');
                if (terms.footer) terms.footer.forEach(f => combinedText += f.text + '\n');

                // Get API key from storage
                chrome.storage.local.get(['apiKey'], async (result) => {
                    const apiKey = result.apiKey;
                    if (!apiKey) {
                        chrome.notifications.create('analysis_failed', {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Analysis Failed',
                            message: 'API key not set. Please set your API key in the extension popup.'
                        });
                        return;
                    }
                    // Send to backend
                    try {
                        const response = await fetch('http://localhost:8000/api/v1/analyze', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': apiKey
                            },
                            body: JSON.stringify({ text: combinedText })
                        });
                        if (!response.ok) {
                            throw new Error(await response.text());
                        }
                        const data = await response.json();
                        lastAnalysisResult = data.analysis;
                        chrome.storage.local.set({ lastAnalysisResult: data.analysis });
                        // Notify user analysis is ready (streamlined)
                        chrome.notifications.create('analysis_ready', {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Analysis Complete',
                            message: 'Click "Open Extension" and then the extension icon to see the analysis.',
                            buttons: [
                                { title: 'Open Extension' }
                            ],
                            requireInteraction: true
                        });
                    } catch (err) {
                        chrome.notifications.create('analysis_failed', {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: 'Analysis Failed',
                            message: 'Error: ' + err.message
                        });
                    }
                });
            }
        });
    } else if (notificationId === 'analysis_ready' && buttonIndex === 0) {
        // Set a flag so popup knows to show the result
        chrome.storage.local.set({ showAnalysis: true });
        // Just clear the notification, do not show another one
        chrome.notifications.clear(notificationId);
    }
    // Close notification
    chrome.notifications.clear(notificationId);
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    detectedTerms.delete(tabId);
});

// Extension installed/updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Terms Analyzer extension installed');
}); 