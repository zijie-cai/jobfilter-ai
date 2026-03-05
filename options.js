document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load existing key
    chrome.storage.sync.get(['gemini_api_key'], (result) => {
        if (result.gemini_api_key) {
            apiKeyInput.value = result.gemini_api_key;
        }
    });

    // Save key
    saveButton.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        
        saveButton.textContent = 'SYNCHRONIZING...';
        saveButton.disabled = true;

        chrome.storage.sync.set({ gemini_api_key: key }, () => {
            setTimeout(() => {
                statusDiv.textContent = '[SUCCESS]: NEURAL_LINK_ESTABLISHED';
                statusDiv.className = 'status success';
                saveButton.textContent = 'INITIALIZE_CONNECTION';
                saveButton.disabled = false;
                
                setTimeout(() => {
                    statusDiv.textContent = '';
                }, 3000);
            }, 800);
        });
    });
});
