class StatusIndicator extends HTMLElement {
    static get observedAttributes() {
        return ['status', 'message'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.status = 'idle';
        this.message = '';
        this.timestamp = new Date();
        this._timer = setInterval(() => {
            this.timestamp = new Date();
            this.render();
        }, 1000);
    }

    connectedCallback() {
        this.render();
        // Add theme change listener
        document.addEventListener('theme-change', this.handleThemeChange);
    }

    disconnectedCallback() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        // Clean up event listener
        document.removeEventListener('theme-change', this.handleThemeChange);
    }

    handleThemeChange = () => {
        // Force a re-render when theme changes
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'status') this.status = newValue;
            if (name === 'message') this.message = newValue;
            this.timestamp = new Date();
            this.render();
        }
    }

    getStatusIcon() {
        const icons = {
            idle: '⏳',
            success: '✅',
            error: '❌',
            warning: '⚠️',
            loading: '⏳'
        };
        return icons[this.status] || icons.idle;
    }

    getStatusColor() {
        const colors = {
            idle: 'var(--text-tertiary)',
            success: 'var(--success)',
            error: 'var(--danger)',
            warning: 'var(--warning)',
            loading: 'var(--secondary)'
        };
        return colors[this.status] || colors.idle;
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    render() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const icon = this.getStatusIcon();
        const color = this.getStatusColor();
        const time = this.formatTime(this.timestamp);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --status-bg: ${isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
                    --status-border: ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(0, 0, 0, 0.1)'};
                    --status-text: ${isDark ? '#f3f4f6' : '#1f2937'};
                    --status-time: ${isDark ? '#9ca3af' : '#6b7280'};
                    
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: var(--status-bg);
                    border: 1px solid var(--status-border);
                    border-radius: 12px;
                    padding: 0.75rem 1.25rem;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    box-shadow: ${isDark ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
                    transition: all 0.3s ease;
                    min-width: 200px;
                    text-align: center;
                }
                
                .status-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    width: 100%;
                }

                .status-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    width: 100%;
                }

                /* .status-dot removed */
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: ${color};
                    flex-shrink: 0;
                    box-shadow: 0 0 0 2px ${color}33;
                }
                
                .status-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--status-text);
                    font-size: 0.9rem;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .status-time {
                    font-size: 0.875rem;
                    color: var(--status-time);
                    opacity: 0.9;
                    margin-top: 0.1rem;
                }
            </style>

            <div class="status-content">
                <div class="status-row">
                    
                    <span class="status-message">
                        <span class="status-icon">${icon}</span>
                        <span class="status-text">${this.message}</span>
                    </span>
                </div>
                <div class="status-time">${time}</div>
            </div>
        `;
    }
}

customElements.define('status-indicator', StatusIndicator);
