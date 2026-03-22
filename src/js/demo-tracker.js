// Demo Usage Tracker
(function() {
    'use strict';
    
    const TRACKING_API = 'https://api.example.com/demo-track';
    const DEMO_ID = 'mahran-shipping-v2-demo';
    
    class DemoTracker {
        constructor() {
            this.sessionStart = new Date();
            this.events = [];
            this.init();
        }
        
        init() {
            // Track page views
            this.trackEvent('demo_started', {
                url: window.location.href,
                userAgent: navigator.userAgent,
                screen: ${window.screen.width}x
            });
            
            // Track button clicks
            document.addEventListener('click', (e) => {
                if (e.target.matches('.btn, button, a[href]')) {
                    this.trackEvent('button_click', {
                        element: e.target.textContent.trim(),
                        href: e.target.href || 'N/A'
                    });
                }
            });
            
            // Track form interactions
            document.addEventListener('submit', (e) => {
                this.trackEvent('form_submit', {
                    formId: e.target.id || 'unknown'
                });
            });
            
            // Track before unload
            window.addEventListener('beforeunload', () => {
                this.trackEvent('session_ended', {
                    duration: new Date() - this.sessionStart
                });
            });
        }
        
        trackEvent(type, data) {
            const event = {
                demoId: DEMO_ID,
                type: type,
                timestamp: new Date().toISOString(),
                data: data
            };
            
            this.events.push(event);
            console.log('Demo Event:', event);
            
            // Send to analytics (in production)
            // this.sendToAnalytics(event);
        }
        
        sendToAnalytics(event) {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(TRACKING_API, JSON.stringify(event));
            }
        }
        
        getSessionReport() {
            return {
                demoId: DEMO_ID,
                sessionStart: this.sessionStart,
                sessionEnd: new Date(),
                totalEvents: this.events.length,
                events: this.events
            };
        }
    }
    
    // Initialize tracker
    window.demoTracker = new DemoTracker();
    
    // Make report available
    window.getDemoReport = function() {
        return window.demoTracker.getSessionReport();
    };
    
    console.log('Demo Tracker initialized');
})();
