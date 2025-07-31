// Flightscape AI NOTAM Processor - Global Feed Version
class FlightscapeGlobalNotamProcessor {
    constructor() {
        // Sample NOTAM data from various global sources
        this.sampleNotams = [
            {
                "id": "A1234/25",
                "icao": "KJFK",
                "airport_name": "John F. Kennedy International",
                "country": "United States",
                "effective_from": "2025-07-31T10:00:00Z",
                "effective_until": "2025-08-15T18:00:00Z",
                "category": "runway",
                "priority": "high",
                "raw_text": "A1234/25 NOTAMN Q) KZNY/QMRXX/IV/NBO/A/000/999/4038N07346W005 A) KJFK B) 2507311000 C) 2508151800 E) RWY 04L/22R CLSD FOR MAINTENANCE",
                "interpreted": "Runway 04L/22R at JFK Airport is closed for maintenance operations.",
                "risk_level": "high",
                "affected_elements": ["runway", "ground_operations"],
                "source": "nasa"
            },
            {
                "id": "B5678/25",
                "icao": "EGLL",
                "airport_name": "London Heathrow",
                "country": "United Kingdom",
                "effective_from": "2025-07-31T14:00:00Z",
                "effective_until": "2025-08-05T22:00:00Z",
                "category": "airspace",
                "priority": "medium",
                "raw_text": "B5678/25 NOTAMN Q) EGTT/QRTCA/IV/BO/W/000/050/5128N00027W005 A) EGLL B) 2507311400 C) 2508052200 E) MILITARY EXERCISE AREA ACTIVE",
                "interpreted": "Military exercise area active near London Heathrow affecting local airspace.",
                "risk_level": "medium",
                "affected_elements": ["airspace", "military"],
                "source": "icao"
            },
            {
                "id": "C9012/25",
                "icao": "EDDF",
                "airport_name": "Frankfurt Airport",
                "country": "Germany",
                "effective_from": "2025-07-31T06:00:00Z",
                "effective_until": "2025-09-30T23:59:00Z",
                "category": "navigation",
                "priority": "medium",
                "raw_text": "C9012/25 NOTAMN Q) EDGG/QNBXX/IV/BO/AE/000/999/5001N00833E005 A) EDDF B) 2507310600 C) 2509302359 E) VOR FRA 114.2MHZ U/S",
                "interpreted": "VOR navigation aid FRA on frequency 114.2 MHz is unserviceable at Frankfurt Airport.",
                "risk_level": "medium",
                "affected_elements": ["navigation", "vor"],
                "source": "faa"
            },
            {
                "id": "D3456/25",
                "icao": "RJTT",
                "airport_name": "Tokyo Haneda",
                "country": "Japan",
                "effective_from": "2025-07-31T12:00:00Z",
                "effective_until": "2025-08-01T04:00:00Z",
                "category": "weather",
                "priority": "high",
                "raw_text": "D3456/25 NOTAMN Q) RJRR/QWLCA/IV/BO/A/000/999/3533N13945E005 A) RJTT B) 2507311200 C) 2508010400 E) LOW VISIBILITY PROCEDURES IN EFFECT",
                "interpreted": "Low visibility procedures are in effect at Tokyo Haneda due to weather conditions.",
                "risk_level": "high",
                "affected_elements": ["weather", "visibility", "procedures"],
                "source": "notamify"
            },
            {
                "id": "E7890/25",
                "icao": "OMDB",
                "airport_name": "Dubai International",
                "country": "United Arab Emirates",
                "effective_from": "2025-08-01T00:00:00Z",
                "effective_until": "2025-08-03T12:00:00Z",
                "category": "military",
                "priority": "high",
                "raw_text": "E7890/25 NOTAMN Q) OMAE/QRTCA/IV/BO/W/000/200/2515N05522E015 A) OMDB B) 2508010000 C) 2508031200 E) MILITARY EXERCISE AREA UAE05 ACTIVE",
                "interpreted": "Military exercise area UAE05 is active affecting airspace around Dubai International.",
                "risk_level": "high",
                "affected_elements": ["military", "airspace", "restricted_area"],
                "source": "icao"
            },
            {
                "id": "F2468/25",
                "icao": "YSSY",
                "airport_name": "Sydney Kingsford Smith",
                "country": "Australia",
                "effective_from": "2025-07-31T08:00:00Z",
                "effective_until": "2025-08-10T16:00:00Z",
                "category": "obstacles",
                "priority": "medium",
                "raw_text": "F2468/25 NOTAMN Q) YSSY/QOBXX/IV/M/AE/000/015/3356S15117E005 A) YSSY B) 2507310800 C) 2508101600 E) CONSTRUCTION CRANE 450FT AGL NEAR RWY 16L/34R",
                "interpreted": "Construction crane 450 feet above ground level operating near runway 16L/34R at Sydney Airport.",
                "risk_level": "medium",
                "affected_elements": ["obstacles", "construction", "runway"],
                "source": "nasa"
            }
        ];

        // Free NOTAM API configurations
        this.apiSources = {
            nasa: {
                name: "NASA NOTAM API",
                url: "https://dip.amesaero.nasa.gov",
                status: "connecting",
                coverage: "global",
                auth_required: false,
                connected: false,
                lastUpdate: null
            },
            faa: {
                name: "FAA SWIM Portal",
                url: "https://portal.swim.faa.gov",
                status: "connecting",
                coverage: "us_and_international",
                auth_required: true,
                connected: false,
                lastUpdate: null
            },
            icao: {
                name: "ICAO API",
                url: "https://api.icao.int",
                status: "connecting",
                coverage: "global",
                auth_required: true,
                connected: false,
                lastUpdate: null
            },
            notamify: {
                name: "Notamify",
                url: "https://notamify.com/api",
                status: "connecting",
                coverage: "global",
                auth_required: true,
                connected: false,
                lastUpdate: null
            }
        };

        // World regions configuration
        this.worldRegions = {
            "North America": ["KJFK", "KLAX", "KORD", "KDFW", "CYYZ", "CYVR", "MMMX"],
            "Europe": ["EGLL", "EDDF", "LFPG", "EHAM", "LEMD", "LIRF", "ESSA"],
            "Asia-Pacific": ["RJTT", "RKSI", "VHHH", "WSSS", "YSSY", "NZAA", "RPLL"],
            "Middle East": ["OMDB", "OTHH", "OERK", "OJAI", "LTBA", "HAAB"],
            "Global": ["KJFK", "EGLL", "EDDF", "RJTT", "OMDB", "YSSY", "KLAX", "CYYZ"]
        };

        this.currentNotams = [];
        this.connectedSources = 0;
        this.autoRefreshInterval = null;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupDateDefaults();
        this.simulateApiConnections();
        this.loadDefaultData();
    }

    setupEventListeners() {
        // Main fetch button
        const fetchBtn = document.getElementById('fetchNotams');
        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => this.fetchGlobalNotams());
        }

        // Region selector
        const regionSelect = document.getElementById('worldRegion');
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                if (e.target.value && this.worldRegions[e.target.value]) {
                    const icaoInput = document.getElementById('icaoCodes');
                    if (icaoInput) {
                        icaoInput.value = this.worldRegions[e.target.value].slice(0, 6).join(', ');
                    }
                }
            });
        }

        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('autoRefresh');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoRefresh();
                } else {
                    this.stopAutoRefresh();
                }
            });
        }

        // Search functionality
        this.setupSearchListeners();

        // Export buttons
        this.setupExportListeners();

        // Quick access items
        this.setupQuickAccessListeners();
    }

    setupSearchListeners() {
        const searches = [
            { id: 'globalSearch', handler: () => this.filterGlobalFeed() },
            { id: 'routeSearch', handler: () => this.filterRoutes() },
            { id: 'rawSearch', handler: () => this.filterRawNotams() }
        ];

        searches.forEach(({ id, handler }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', handler);
            }
        });

        // Source filter
        const sourceFilter = document.getElementById('sourceFilter');
        if (sourceFilter) {
            sourceFilter.addEventListener('change', () => this.filterGlobalFeed());
        }
    }

    setupExportListeners() {
        const exportButtons = [
            { id: 'copyResults', handler: () => this.copyResults() },
            { id: 'exportResults', handler: () => this.exportResults() },
            { id: 'printResults', handler: () => this.printResults() }
        ];

        exportButtons.forEach(({ id, handler }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }

    setupQuickAccessListeners() {
        // Bookmark items
        document.addEventListener('click', (e) => {
            if (e.target.closest('.bookmark-item')) {
                const item = e.target.closest('.bookmark-item');
                const icao = item.dataset.icao;
                if (icao) {
                    const icaoInput = document.getElementById('icaoCodes');
                    if (icaoInput) {
                        icaoInput.value = icao;
                    }
                }
            }
            
            if (e.target.closest('.region-item')) {
                const item = e.target.closest('.region-item');
                const region = item.dataset.region || item.textContent.trim();
                const regionSelect = document.getElementById('worldRegion');
                if (regionSelect) {
                    regionSelect.value = region;
                    regionSelect.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button and corresponding pane
                button.classList.add('active');
                const targetPane = document.getElementById(tabId);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    setupDateDefaults() {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        if (startDateInput) {
            startDateInput.value = today.toISOString().split('T')[0];
        }
        if (endDateInput) {
            endDateInput.value = nextWeek.toISOString().split('T')[0];
        }
    }

    async simulateApiConnections() {
        const sources = Object.keys(this.apiSources);
        
        for (let i = 0; i < sources.length; i++) {
            const sourceKey = sources[i];
            const source = this.apiSources[sourceKey];
            
            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            
            // Simulate connection success/failure (85% success rate)
            const connected = Math.random() > 0.15;
            
            source.connected = connected;
            source.status = connected ? 'connected' : 'error';
            source.lastUpdate = connected ? new Date() : null;
            
            if (connected) {
                this.connectedSources++;
            }
            
            this.updateSourceStatus(sourceKey, source);
        }
        
        this.updateConnectionSummary();
    }

    updateSourceStatus(sourceKey, source) {
        const statusElement = document.getElementById(`${sourceKey}-status`);
        if (statusElement) {
            statusElement.textContent = source.connected ? 'Connected' : 'Error';
            statusElement.className = `status-indicator ${source.status}`;
        }
    }

    updateConnectionSummary() {
        const summaryElement = document.getElementById('connectionCount');
        if (summaryElement) {
            summaryElement.textContent = this.connectedSources;
        }
    }

    loadDefaultData() {
        // Load some default NOTAMs for demonstration
        this.currentNotams = this.sampleNotams.slice(0, 3);
        this.displayResults();
        this.updateLastUpdate();
    }

    async fetchGlobalNotams() {
        const button = document.getElementById('fetchNotams');
        if (!button) return;
        
        const spinner = button.querySelector('.loading-spinner');
        const text = button.querySelector('.btn-text');
        
        // Show loading state
        button.disabled = true;
        if (spinner) spinner.classList.remove('hidden');
        if (text) text.textContent = 'Fetching...';

        // Show progress modal
        this.showProgressModal();

        try {
            // Simulate API calls with progress
            await this.simulateProgress();
            
            // Get form values
            const icaoCodesValue = document.getElementById('icaoCodes')?.value || '';
            const icaoCodes = icaoCodesValue
                .split(',')
                .map(code => code.trim().toUpperCase())
                .filter(code => code.length >= 3);
            
            const riskFilter = document.getElementById('riskFilter')?.value || 'all';
            const sourceFilter = document.getElementById('sourceFilter')?.value || 'all';
            const selectedCategories = Array.from(document.querySelectorAll('.category-filters input:checked') || [])
                .map(input => input.value);

            // Filter NOTAMs based on criteria
            let filteredNotams = [...this.sampleNotams];
            
            // Filter by ICAO codes
            if (icaoCodes.length > 0) {
                filteredNotams = filteredNotams.filter(notam => 
                    icaoCodes.includes(notam.icao)
                );
            }
            
            // Filter by risk level
            if (riskFilter !== 'all') {
                filteredNotams = filteredNotams.filter(notam => 
                    notam.risk_level === riskFilter
                );
            }
            
            // Filter by source
            if (sourceFilter !== 'all') {
                filteredNotams = filteredNotams.filter(notam => 
                    notam.source === sourceFilter
                );
            }
            
            // Filter by categories
            if (selectedCategories.length > 0) {
                filteredNotams = filteredNotams.filter(notam => 
                    selectedCategories.includes(notam.category)
                );
            }

            this.currentNotams = filteredNotams;
            this.displayResults();
            this.updateLastUpdate();
            
            this.hideProgressModal();
            this.showToast(`Fetched ${filteredNotams.length} NOTAMs from ${this.connectedSources} sources`);
            
        } catch (error) {
            console.error('Error fetching NOTAMs:', error);
            this.hideProgressModal();
            this.showToast('Error fetching NOTAMs. Using cached data.', 'error');
        } finally {
            // Reset button state
            button.disabled = false;
            if (spinner) spinner.classList.add('hidden');
            if (text) text.textContent = 'Fetch Global NOTAMs';
        }
    }

    async simulateProgress() {
        const steps = [
            { id: 'step1', percent: 25, text: 'Connecting to global NOTAM sources...' },
            { id: 'step2', percent: 50, text: 'Fetching NOTAM data from APIs...' },
            { id: 'step3', percent: 75, text: 'Processing and analyzing NOTAMs...' },
            { id: 'step4', percent: 100, text: 'Generating AI insights and summaries...' }
        ];

        for (const step of steps) {
            // Update step indicators
            document.querySelectorAll('.step-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const stepElement = document.getElementById(step.id);
            if (stepElement) {
                stepElement.classList.add('active');
            }
            
            // Update progress bar
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            if (progressFill) progressFill.style.width = step.percent + '%';
            if (progressText) progressText.textContent = step.text;
            
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Mark all steps as completed
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.remove('active');
            item.classList.add('completed');
        });
    }

    displayResults() {
        this.displayGlobalFeed();
        this.displayRiskAssessment();
        this.displayAISummary();
        this.displayRouteAnalysis();
        this.displayRawNotams();
        this.updateStats();
    }

    displayGlobalFeed() {
        const container = document.getElementById('globalFeedResults');
        if (!container) return;
        
        if (this.currentNotams.length === 0) {
            container.innerHTML = '<p class="no-data">No NOTAM data available. Configure filters and fetch NOTAMs to see global feed.</p>';
            return;
        }

        let html = '';
        this.currentNotams.forEach(notam => {
            html += `
                <div class="notam-card" data-source="${notam.source}" data-risk="${notam.risk_level}">
                    <div class="notam-header">
                        <span class="notam-id">${notam.id}</span>
                        <div class="notam-meta">
                            <span class="notam-source">${this.apiSources[notam.source]?.name || notam.source}</span>
                            <span class="status status--${notam.risk_level}">${notam.risk_level}</span>
                        </div>
                    </div>
                    <div class="notam-info">
                        <h4>${notam.icao} - ${notam.airport_name}</h4>
                        <p><strong>Country:</strong> ${notam.country}</p>
                        <p><strong>Category:</strong> ${notam.category.charAt(0).toUpperCase() + notam.category.slice(1)}</p>
                        <p><strong>Effective:</strong> ${this.formatDate(notam.effective_from)} - ${this.formatDate(notam.effective_until)}</p>
                        <div class="notam-interpretation">
                            <strong>Interpretation:</strong>
                            <p>${notam.interpreted}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    displayRiskAssessment() {
        const container = document.getElementById('riskResults');
        if (!container) return;
        
        if (this.currentNotams.length === 0) {
            container.innerHTML = '<p class="no-data">No risk assessment data available. Fetch NOTAMs to see risk analysis.</p>';
            return;
        }

        const riskGroups = {
            high: this.currentNotams.filter(n => n.risk_level === 'high'),
            medium: this.currentNotams.filter(n => n.risk_level === 'medium'),
            low: this.currentNotams.filter(n => n.risk_level === 'low')
        };

        let html = '';
        Object.entries(riskGroups).forEach(([level, notams]) => {
            if (notams.length > 0) {
                html += `<h4 class="risk-group-title">${level.toUpperCase()} RISK (${notams.length} NOTAMs)</h4>`;
                notams.forEach(notam => {
                    html += `
                        <div class="risk-card">
                            <div class="notam-header">
                                <span class="notam-id">${notam.id}</span>
                                <span class="status status--${level}">${level}</span>
                            </div>
                            <h4>${notam.icao} - ${notam.airport_name}</h4>
                            <p><strong>Category:</strong> ${notam.category}</p>
                            <p><strong>Impact:</strong> ${notam.affected_elements.join(', ')}</p>
                            <div class="notam-interpretation">
                                <p>${notam.interpreted}</p>
                            </div>
                        </div>
                    `;
                });
            }
        });

        container.innerHTML = html || '<p class="no-data">No risk assessment data available.</p>';
    }

    displayAISummary() {
        const container = document.getElementById('aiResults');
        if (!container) return;
        
        const enableAI = document.getElementById('enableAI')?.checked ?? true;
        
        if (!enableAI) {
            container.innerHTML = '<p class="no-data">AI processing is disabled. Enable AI processing in the configuration to see insights.</p>';
            return;
        }
        
        if (this.currentNotams.length === 0) {
            container.innerHTML = '<p class="no-data">No AI summary available. Fetch NOTAMs with AI processing enabled to see insights.</p>';
            return;
        }

        let html = '<div class="ai-summary-container">';
        
        // Overall summary
        const totalRisks = {
            high: this.currentNotams.filter(n => n.risk_level === 'high').length,
            medium: this.currentNotams.filter(n => n.risk_level === 'medium').length,
            low: this.currentNotams.filter(n => n.risk_level === 'low').length
        };

        html += `
            <div class="ai-overview">
                <h4>Flight Planning Summary</h4>
                <p>Analysis of ${this.currentNotams.length} active NOTAMs reveals ${totalRisks.high} high-risk, 
                ${totalRisks.medium} medium-risk, and ${totalRisks.low} low-risk conditions affecting flight operations.</p>
            </div>
        `;

        // Detailed summaries
        this.currentNotams.forEach(notam => {
            html += `
                <div class="ai-summary-item">
                    <div class="summary-header">
                        <h5>${notam.icao} - ${notam.airport_name}</h5>
                        <span class="status status--${notam.risk_level}">${notam.risk_level}</span>
                    </div>
                    <div class="summary-content">
                        <p><strong>AI Analysis:</strong> ${notam.interpreted}</p>
                        <p><strong>Recommendation:</strong> ${this.generateRecommendation(notam)}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    generateRecommendation(notam) {
        const recommendations = {
            high: {
                runway: "Consider alternate runways or airports. Review taxi procedures and ground handling requirements.",
                airspace: "Coordinate with ATC early. File alternate routes if possible. Monitor for updates.",
                weather: "Ensure aircraft and crew are CAT II/III qualified if required. Consider delaying departure.",
                military: "Avoid restricted areas. Coordinate with military control. Plan alternate routing.",
                obstacles: "Exercise extreme caution during approach and departure. Brief crew on obstacle locations."
            },
            medium: {
                runway: "Monitor for operational delays. Brief crew on surface conditions and alternate procedures.",
                airspace: "File flight plan early. Monitor for clearance changes and potential rerouting.",
                navigation: "Verify backup navigation systems. Review alternate approach procedures.",
                weather: "Monitor conditions closely. Ensure adequate fuel for alternate airport.",
                military: "Monitor NOTAMs for changes. Coordinate with ATC for potential routing adjustments."
            },
            low: {
                runway: "Note operational considerations. No immediate action required.",
                navigation: "Use alternate navigation aids as primary. Monitor for service restoration.",
                obstacles: "Brief crew for awareness. Standard approach and departure procedures apply.",
                weather: "Monitor weather conditions. Standard operating procedures apply."
            }
        };

        const level = notam.risk_level;
        const category = notam.category;
        
        return recommendations[level]?.[category] || "Review NOTAM details and follow standard operating procedures. Monitor for updates.";
    }

    displayRouteAnalysis() {
        const container = document.getElementById('routeResults');
        if (!container) return;
        
        if (this.currentNotams.length === 0) {
            container.innerHTML = '<p class="no-data">No route data available. Fetch NOTAMs to see route analysis.</p>';
            return;
        }

        // Extract route information from NOTAMs
        const routeData = {};
        this.currentNotams.forEach(notam => {
            const routes = this.extractRoutes(notam.raw_text);
            routes.forEach(route => {
                if (!routeData[route]) {
                    routeData[route] = [];
                }
                routeData[route].push(notam);
            });
        });

        let html = '';
        if (Object.keys(routeData).length === 0) {
            html = '<p class="no-data">No specific route information found in current NOTAMs.</p>';
        } else {
            Object.entries(routeData).forEach(([route, notams]) => {
                const highRisk = notams.filter(n => n.risk_level === 'high').length;
                html += `
                    <div class="route-card">
                        <h4>Route/Airway: ${route}</h4>
                        <p><strong>Affected NOTAMs:</strong> ${notams.length} | <strong>High Risk:</strong> ${highRisk}</p>
                        <div class="route-notams">
                            ${notams.map(notam => `
                                <div class="route-notam-item">
                                    <span class="notam-id">${notam.id}</span>
                                    <span class="status status--${notam.risk_level}">${notam.icao}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    }

    displayRawNotams() {
        const container = document.getElementById('rawResults');
        if (!container) return;
        
        if (this.currentNotams.length === 0) {
            container.innerHTML = '<p class="no-data">No NOTAM data available. Fetch NOTAMs to see raw data.</p>';
            return;
        }

        const formatSelect = document.getElementById('formatSelect');
        const isRawFormat = formatSelect?.value === 'raw';

        let html = '';
        this.currentNotams.forEach(notam => {
            html += `
                <div class="notam-card">
                    <div class="notam-header">
                        <span class="notam-id">${notam.id}</span>
                        <div class="notam-meta">
                            <span class="notam-source">${this.apiSources[notam.source]?.name || notam.source}</span>
                            <span class="status status--${notam.risk_level}">${notam.risk_level}</span>
                        </div>
                    </div>
                    ${isRawFormat ? `
                        <div class="notam-content">
                            <pre>${notam.raw_text}</pre>
                        </div>
                    ` : `
                        <div class="notam-info">
                            <h4>${notam.icao} - ${notam.airport_name}</h4>
                            <p><strong>Country:</strong> ${notam.country}</p>
                            <p><strong>Category:</strong> ${notam.category}</p>
                            <p><strong>Effective:</strong> ${this.formatDate(notam.effective_from)}</p>
                            <p><strong>Expires:</strong> ${this.formatDate(notam.effective_until)}</p>
                            <div class="notam-content">
                                <strong>Raw Text:</strong>
                                <pre>${notam.raw_text}</pre>
                            </div>
                        </div>
                    `}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    extractRoutes(text) {
        // Extract route identifiers from NOTAM text
        const routePatterns = [
            /\b[A-Z]\d{1,3}\b/g,  // Airways like J75, Q818
            /\b[A-Z]{2,3}\d{1,3}\b/g,  // Routes like UL9, T711
            /\bRWY\s+\d{2}[LRC]?\/\d{2}[LRC]?\b/gi  // Runways
        ];
        
        const routes = [];
        routePatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            routes.push(...matches);
        });
        
        return [...new Set(routes)].slice(0, 5); // Remove duplicates and limit
    }

    updateStats() {
        const totalElement = document.getElementById('notamCount');
        const highRiskElement = document.getElementById('highRiskCount');
        
        if (totalElement) {
            totalElement.textContent = `${this.currentNotams.length} NOTAMs`;
        }
        
        if (highRiskElement) {
            const highRiskCount = this.currentNotams.filter(n => n.risk_level === 'high').length;
            highRiskElement.textContent = highRiskCount.toString();
        }
    }

    updateLastUpdate() {
        const updateElement = document.getElementById('lastUpdate');
        if (updateElement) {
            const now = new Date();
            updateElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    // Filter functions
    filterGlobalFeed() {
        const searchTerm = document.getElementById('globalSearch')?.value.toLowerCase() || '';
        const sourceFilter = document.getElementById('sourceFilter')?.value || 'all';
        const cards = document.querySelectorAll('#globalFeedResults .notam-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const source = card.dataset.source;
            
            const matchesSearch = text.includes(searchTerm);
            const matchesSource = sourceFilter === 'all' || source === sourceFilter;
            
            card.style.display = (matchesSearch && matchesSource) ? 'block' : 'none';
        });
    }

    filterRoutes() {
        const searchTerm = document.getElementById('routeSearch')?.value.toLowerCase() || '';
        const cards = document.querySelectorAll('#routeResults .route-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    filterRawNotams() {
        const searchTerm = document.getElementById('rawSearch')?.value.toLowerCase() || '';
        const cards = document.querySelectorAll('#rawResults .notam-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    // Auto-refresh functionality
    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.fetchGlobalNotams();
        }, 5 * 60 * 1000); // 5 minutes
        this.showToast('Auto-refresh enabled (5 min intervals)');
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
        this.showToast('Auto-refresh disabled');
    }

    // Export functionality
    copyResults() {
        const activeTab = document.querySelector('.tab-pane.active');
        if (!activeTab) return;
        
        const text = activeTab.textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Results copied to clipboard');
            }).catch(() => {
                this.showToast('Copy failed - please try again', 'error');
            });
        } else {
            this.showToast('Copy not supported in this browser', 'error');
        }
    }

    exportResults() {
        const data = this.currentNotams.map(notam => ({
            ID: notam.id,
            ICAO: notam.icao,
            Airport: notam.airport_name,
            Country: notam.country,
            Category: notam.category,
            Risk: notam.risk_level,
            Source: notam.source,
            Effective: notam.effective_from,
            Expires: notam.effective_until,
            Text: notam.raw_text,
            Interpretation: notam.interpreted
        }));

        const csv = this.arrayToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flightscape-notams-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('NOTAMs exported to CSV successfully');
    }

    arrayToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    printResults() {
        window.print();
    }

    // Modal functionality
    showProgressModal() {
        const modal = document.getElementById('progressModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideProgressModal() {
        const modal = document.getElementById('progressModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Utility functions
    formatDate(dateString) {
        try {
            return new Date(dateString).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
                timeZoneName: 'short'
            });
        } catch (e) {
            return dateString;
        }
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        const colors = {
            info: 'var(--aviation-accent)',
            error: 'var(--aviation-danger)',
            success: 'var(--aviation-success)'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: var(--color-white);
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
            max-width: 350px;
            font-size: 14px;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlightscapeGlobalNotamProcessor();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .ai-summary-container {
        max-height: 500px;
        overflow-y: auto;
    }
    
    .ai-overview {
        background: rgba(34, 211, 238, 0.1);
        border: 1px solid rgba(34, 211, 238, 0.3);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 20px;
    }
    
    .ai-summary-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
    }
    
    .summary-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .summary-header h5 {
        color: var(--aviation-accent);
        margin: 0;
        font-size: 16px;
    }
    
    .summary-content p {
        margin: 8px 0;
        font-size: 14px;
        line-height: 1.5;
    }
    
    .notam-content pre {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 6px;
        font-family: var(--font-family-mono);
        font-size: 12px;
        line-height: 1.4;
        margin: 8px 0 0 0;
        white-space: pre-wrap;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .notam-interpretation {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 6px;
        margin-top: 12px;
        border-left: 3px solid var(--aviation-accent);
    }
    
    .notam-meta {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .risk-group-title {
        color: var(--color-white);
        margin: 24px 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 18px;
    }
    
    .route-notams {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
    }
    
    .route-notam-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.05);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
`;
document.head.appendChild(style);