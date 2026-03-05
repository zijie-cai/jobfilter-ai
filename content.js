/**
 * JobFilter AI - Content Script
 */

let currentJobId = null;
let panelElement = null;

// --- UTILITIES ---

function getJobDetails() {
    console.log('[JobFilter AI] Starting Deep Scan for job details...');

    // 1. Identify the most likely container for the active job details
    // We target the right-hand pane or the main content area, avoiding the search list.
    const detailsContainer = 
        document.querySelector('.jobs-search__job-details--container') || 
        document.querySelector('.jobs-details-module') ||
        document.querySelector('.jobs-details') || 
        document.querySelector('.job-view-layout') ||
        document.querySelector('.scaffold-layout__detail') ||
        document.querySelector('.jobs-description') ||
        document.querySelector('main:not(.jobs-search-results-list)') ||
        document.querySelector('#main:not(.jobs-search-results-list)') ||
        document.body;

    console.log('[JobFilter AI] Target container identified:', detailsContainer.className || detailsContainer.id || 'body');

    // 2. Extract Title
    const titleSelectors = [
        '.jobs-unified-top-card__job-title',
        '.job-details-jobs-unified-top-card__job-title',
        '.jobs-details-top-card__job-title',
        'h1.t-24',
        'h2.t-24',
        '.top-card-layout__title',
        '.jobs-top-card__job-title'
    ];
    let title = 'Unknown Title';
    for (const selector of titleSelectors) {
        const el = detailsContainer.querySelector(selector);
        if (el && el.innerText.trim()) {
            title = el.innerText.trim();
            break;
        }
    }

    // 3. Extract Company
    const companySelectors = [
        '.jobs-unified-top-card__company-name',
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__subtitle-grid-item',
        '.jobs-details-top-card__company-url',
        '.topcard__org-name-link',
        '.jobs-top-card__company-url'
    ];
    let company = 'Unknown Company';
    for (const selector of companySelectors) {
        const el = detailsContainer.querySelector(selector);
        if (el && el.innerText.trim()) {
            company = el.innerText.trim();
            break;
        }
    }

    // 4. Extract Description
    const descriptionSelectors = [
        '#job-details',
        '.jobs-description-content__text',
        '.jobs-description__container',
        '.show-more-less-html__markup',
        '.description__text',
        '.jobs-box__html-content',
        '.jobs-description',
        '.job-view-layout__job-details'
    ];
    let description = '';
    for (const selector of descriptionSelectors) {
        const el = detailsContainer.querySelector(selector);
        if (el && el.innerText.trim()) {
            const text = el.innerText.trim();
            // Heuristic: A real description shouldn't look like a list of jobs
            if (text.length > 100 && !text.includes('25 results') && (text.match(/Apply/g) || []).length < 10) {
                description = text;
                break;
            }
        }
    }

    // Fallback: Look for large text blocks but EXCLUDE search results list
    if (!description) {
        console.log('[JobFilter AI] Primary description selectors failed. Using fallback...');
        const searchList = document.querySelector('.jobs-search-results-list') || document.querySelector('.scaffold-layout__list');
        const allTexts = Array.from(detailsContainer.querySelectorAll('div, section, article, span, p'))
            .filter(el => {
                if (searchList && searchList.contains(el)) return false;
                const text = el.innerText;
                // Avoid UI elements like sidebars or footers
                if (el.closest('header') || el.closest('footer') || el.closest('nav') || el.closest('button')) return false;
                return text.length > 300 && !text.includes('25 results') && (text.match(/Apply/g) || []).length < 5;
            })
            .sort((a, b) => b.innerText.length - a.innerText.length);
        
        if (allTexts.length > 0) {
            description = allTexts[0].innerText.trim();
        }
    }
    
    // Speed Optimization: Truncate very long descriptions and clean whitespace
    if (description) {
        description = description.replace(/\s+/g, ' ').trim();
        if (description.length > 6000) {
            description = description.substring(0, 6000) + "... [Truncated]";
        }
    }

    return { title, company, description };
}

async function callGemini(apiKey, jobData) {
    if (!jobData.description || jobData.description.trim().length < 50) {
        throw new Error('Could not find enough job details to scan. Please make sure the job description is visible.');
    }

    const systemInstruction = `
        [IDENTITY]: You are "NEURAL_SCANNER_v4", a high-energy, slightly unhinged cyber-noir job eligibility detective. 
        [VIBE]: Weird, fun, hacker-energy, concise, straight-to-the-point.
        
        [MISSION]: Analyze job descriptions for international students (F1/OPT/CPT) and non-citizens.
        
        [IMPLIED_LOGIC]: 
        - If the job is at a military base (e.g., Aberdeen Proving Ground, Pentagon) or involves defense/aerospace (Lockheed, Raytheon, Boeing) -> ASSUME Citizenship: Yes (Required) and Clearance: Yes (Required) unless explicitly stated otherwise.
        - If it's a "U.S. Government" role -> Citizenship: Yes.
        - If it's a "Big Tech" role (Google, Meta, etc.) -> ASSUME Visa: Yes (Sponsorship) unless it's a very specific niche role.
        - If it's a "Small Firm" (under 50 employees or unknown) and there's ZERO mention of sponsorship -> ASSUME Visa: No. Be extremely sarcastic in 'reasoning': "Small firm has no money for sponsorship. They can barely afford the coffee machine. LOL." or "Zero signals. This startup's budget is basically hopes and dreams. No sponsorship here." or other jokes about their lack of funds.
        
        [SIGNAL_RULES]:
        - You MUST return "Yes" or "No" for all signals. NO "Unknown". Make your best guess based on context and implied logic.
        
        [VERDICT_LOGIC]:
        - ELIGIBLE: High probability of sponsorship/OPT friendliness.
        - NOT ELIGIBLE: Likely requires citizenship or no sponsorship.
        - MAYBE: Mixed signals or high uncertainty (but still pick Yes/No for signals).

        [OUTPUT]: Return valid JSON. Keep 'reasoning' under 20 words. Be punchy.
    `;

    const prompt = `
        Job: ${jobData.title} at ${jobData.company}
        Description: ${jobData.description}

        Analyze the above job and return eligibility data in JSON format.
    `;

    // Use gemini-3-flash-preview for best schema adherence
    const model = "gemini-3-flash-preview";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                response_mime_type: "application/json",
                response_schema: {
                    type: "OBJECT",
                    properties: {
                        verdict: { type: "STRING", enum: ["Eligible", "Not Eligible", "Maybe"] },
                        visa: { type: "STRING", enum: ["Yes", "No"] },
                        opt: { type: "STRING", enum: ["Yes", "No"] },
                        citizenship: { type: "STRING", enum: ["Yes", "No"] },
                        clearance: { type: "STRING", enum: ["Yes", "No"] },
                        skills: { type: "ARRAY", items: { type: "STRING" } },
                        reasoning: { type: "STRING" }
                    },
                    required: ["verdict", "visa", "opt", "citizenship", "clearance", "skills", "reasoning"]
                },
                temperature: 0.1
            }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        console.error('[JobFilter AI] API Error:', err);
        if (err.error?.message?.includes('API key')) {
            throw new Error('Invalid API Key. Please check your settings.');
        }
        throw new Error(err.error?.message || 'Failed to call Gemini API');
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        if (data.promptFeedback?.blockReason) {
            throw new Error(`Scan blocked: ${data.promptFeedback.blockReason}.`);
        }
        throw new Error('AI failed to generate a response. Please try again.');
    }

    let text = data.candidates[0].content.parts[0].text;
    
    try {
        // Clean up text in case the model ignored response_mime_type
        text = text.trim();
        // Remove markdown code blocks if present
        text = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        
        return JSON.parse(text);
    } catch (err) {
        console.error('[JobFilter AI] JSON Parse Error. Raw text:', text);
        // Robust extraction: find the first { and last }
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');
        if (startIdx !== -1 && endIdx !== -1) {
            try {
                return JSON.parse(text.substring(startIdx, endIdx + 1));
            } catch (e) {
                console.error('[JobFilter AI] Substring JSON parse failed:', e);
            }
        }
        throw new Error('AI returned an invalid format. Please try again.');
    }
}

// --- UI INJECTION ---

function createPanel() {
    if (panelElement) return;

    const root = document.createElement('div');
    root.id = 'jobfilter-ai-root';
    document.body.appendChild(root);
    panelElement = root;

    // Draggable Logic
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    root.addEventListener('mousedown', (e) => {
        const header = e.target.closest('.jf-header');
        if (!header) return;
        
        isDragging = true;
        const rect = root.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        root.style.transition = 'none';
        root.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;
        
        root.style.left = `${x}px`;
        root.style.top = `${y}px`;
        root.style.right = 'auto';
        root.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            root.style.cursor = 'default';
        }
    });

    renderLoading();
}

function renderLoading() {
    panelElement.innerHTML = `
        <div class="jf-panel">
            <div class="jf-corner jf-corner-tl"></div>
            <div class="jf-corner jf-corner-tr"></div>
            <div class="jf-corner jf-corner-bl"></div>
            <div class="jf-corner jf-corner-br"></div>
            
            <div class="jf-header">
                <div class="jf-brand">
                    <div class="jf-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 10h-1.5L16 3H8L6.5 10H5c-1.1 0-2 .9-2 2v1h18v-1c0-1.1-.9-2-2-2zM7 15c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-7 3h4" />
                        </svg>
                    </div>
                    <div class="jf-title">JobFilter AI</div>
                </div>
                <div class="jf-live-badge">
                    <div class="jf-dot"></div>
                    SCANNER_ACTIVE
                </div>
            </div>
            <div class="jf-loading">
                <div class="jf-spinner"></div>
                <div class="jf-loading-text">SCANNING_DATA...</div>
            </div>
        </div>
    `;
}

function renderError(message) {
    panelElement.innerHTML = `
        <div class="jf-panel">
            <div class="jf-corner jf-corner-tl"></div>
            <div class="jf-corner jf-corner-tr"></div>
            <div class="jf-corner jf-corner-bl"></div>
            <div class="jf-corner jf-corner-br"></div>

            <div class="jf-header">
                <div class="jf-brand">
                    <div class="jf-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 10h-1.5L16 3H8L6.5 10H5c-1.1 0-2 .9-2 2v1h18v-1c0-1.1-.9-2-2-2zM7 15c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-7 3h4" />
                        </svg>
                    </div>
                    <div class="jf-title">JobFilter AI</div>
                </div>
                [ERROR]: ${message}
            </div>
            <div class="jf-footer">
                <a class="jf-settings-link" id="jf-retry-btn" style="margin-right: 15px;">RETRY_SCAN</a>
                <a class="jf-settings-link" id="jf-open-settings">CONFIG</a>
            </div>
        </div>
    `;
    
    document.getElementById('jf-retry-btn')?.addEventListener('click', () => {
        currentJobId = null; 
        initAnalysis();
    });

    document.getElementById('jf-open-settings')?.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "openOptions" });
    });
}



function renderResults(data) {
    const statusClass = data.verdict.toLowerCase().replace(' ', '-');
    
    const getStatusClass = (val) => {
        if (val === 'Yes') return 'jf-status-no'; // For Citizenship/Clearance, Yes means "Required" which is bad
        if (val === 'No') return 'jf-status-yes'; // No means "Not Required" which is good
        return 'jf-status-unknown';
    };

    const getVisaOptClass = (val) => {
        if (val === 'Yes') return 'jf-status-yes';
        if (val === 'No') return 'jf-status-no';
        return 'jf-status-unknown';
    };

    const getIcon = (type) => {
        switch(type) {
            case 'visa': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
            case 'opt': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>';
            case 'citizenship': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
            case 'clearance': return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
            default: return '';
        }
    };

    panelElement.innerHTML = `
        <div class="jf-panel">
            <div class="jf-corner jf-corner-tl"></div>
            <div class="jf-corner jf-corner-tr"></div>
            <div class="jf-corner jf-corner-bl"></div>
            <div class="jf-corner jf-corner-br"></div>

            <div class="jf-header" title="Drag to move">
                <div class="jf-brand">
                    <div class="jf-logo">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 10h-1.5L16 3H8L6.5 10H5c-1.1 0-2 .9-2 2v1h18v-1c0-1.1-.9-2-2-2zM7 15c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-7 3h4" />
                        </svg>
                    </div>
                    <div class="jf-title">JobFilter AI</div>
                </div>
                <div class="jf-live-badge">
                    <div class="jf-dot"></div>
                    SCANNER_ACTIVE
                </div>
            </div>

            <div class="jf-verdict-card ${statusClass}">
                <div class="jf-verdict-label">SCAN_RESULT</div>
                <div class="jf-verdict-value">${data.verdict}</div>
                <div class="jf-reasoning">${data.reasoning}</div>
            </div>

            <div class="jf-section">
                <div class="jf-label">ELIGIBILITY_SIGNALS</div>
                <div class="jf-row">
                    <div class="jf-row-left">${getIcon('visa')} VISA_SPONSOR</div>
                    <div class="jf-row-status ${getVisaOptClass(data.visa)}">${data.visa}</div>
                </div>
                <div class="jf-row">
                    <div class="jf-row-left">${getIcon('opt')} OPT_FRIENDLY</div>
                    <div class="jf-row-status ${getVisaOptClass(data.opt)}">${data.opt}</div>
                </div>
                <div class="jf-row">
                    <div class="jf-row-left">${getIcon('citizenship')} CITIZEN_ONLY</div>
                    <div class="jf-row-status ${getStatusClass(data.citizenship)}">${data.citizenship}</div>
                </div>
                <div class="jf-row">
                    <div class="jf-row-left">${getIcon('clearance')} CLEARANCE_REQ</div>
                    <div class="jf-row-status ${getStatusClass(data.clearance)}">${data.clearance}</div>
                </div>
            </div>

            <div class="jf-section">
                <div class="jf-label">DETECTED_SKILLS</div>
                <div class="jf-skills-grid">
                    ${data.skills.map(skill => `<div class="jf-skill-chip">${skill}</div>`).join('')}
                </div>
            </div>

            <div class="jf-footer">
                <a class="jf-settings-link" id="jf-open-settings">CONFIG</a>
                <div style="font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #333;">v1.0.0 • AI POWERED</div>
            </div>
        </div>
    `;

    document.getElementById('jf-open-settings')?.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "openOptions" });
    });
}

// --- MAIN LOGIC ---

async function initAnalysis() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('currentJobId') || window.location.pathname.split('/').filter(p => p && !isNaN(p)).pop();
    
    console.log('[JobFilter AI] Detected Job ID:', jobId);

    if (!jobId || jobId === currentJobId) {
        console.log('[JobFilter AI] Job ID unchanged or missing. Skipping.');
        return;
    }
    currentJobId = jobId;

    createPanel();
    renderLoading();

    const settings = await chrome.storage.sync.get(['gemini_api_key']);
    if (!settings.gemini_api_key) {
        console.error('[JobFilter AI] API Key missing.');
        renderError('Gemini API key not found. Please set it in the extension options.');
        return;
    }

    try {
        let jobData = { description: '' };
        let attempts = 0;
        const maxAttempts = 10; // More attempts for slow loads

        while (!jobData.description && attempts < maxAttempts) {
            console.log(`[JobFilter AI] Extraction attempt ${attempts + 1}/${maxAttempts}...`);
            jobData = getJobDetails();
            if (!jobData.description) {
                attempts++;
                await new Promise(r => setTimeout(r, 600 + (attempts * 200))); 
            }
        }
        
        if (!jobData.description) {
            console.error('[JobFilter AI] Failed to extract description after max attempts.');
            renderError('Could not extract job description. Please ensure the job details are visible on the right side of the screen.');
            return;
        }

        console.log('[JobFilter AI] Extraction successful. Calling Gemini...');
        const analysis = await callGemini(settings.gemini_api_key, jobData);
        renderResults(analysis);
    } catch (error) {
        console.error('[JobFilter AI] Analysis failed:', error);
        renderError(error.message);
    }
}

// Watch for URL changes and content changes (LinkedIn is an SPA)
let lastUrl = location.href;
let lastTitle = '';

const observer = new MutationObserver(() => {
    const url = location.href;
    const currentTitle = document.querySelector('.jobs-unified-top-card__job-title')?.innerText || '';
    
    if (url !== lastUrl || (currentTitle && currentTitle !== lastTitle)) {
        lastUrl = url;
        lastTitle = currentTitle;
        if (url.includes('/jobs/')) {
            console.log('[JobFilter AI] Change detected (URL or Title). Re-initializing...');
            initAnalysis();
        }
    }
});

observer.observe(document.body, { subtree: true, childList: true });

// Initial run
if (location.href.includes('/jobs/')) {
    initAnalysis();
}
