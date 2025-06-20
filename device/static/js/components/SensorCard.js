class SensorCard extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'value', 'unit', 'icon', 'trend'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.value = '--';
        this.unit = '';
        this.icon = '📊';
        this.trend = 'neutral';
    }

    connectedCallback() {
        this.render();
        // Add theme change listener
        document.addEventListener('theme-change', this.handleThemeChange);
    }

    disconnectedCallback() {
        // Clean up event listener
        document.removeEventListener('theme-change', this.handleThemeChange);
    }

    handleThemeChange = () => {
        // Force a re-render when theme changes
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'value' && newValue) this.value = newValue;
            if (name === 'unit' && newValue) this.unit = newValue;
            if (name === 'icon' && newValue) this.icon = newValue;
            if (name === 'trend' && newValue) this.trend = newValue;
            this.render();
        }
    }

    getTrendIcon() {
        const icons = {
            up: '📈',
            down: '📉',
            neutral: '➡️'
        };
        return icons[this.trend] || icons.neutral;
    }

    getTrendColor() {
        const colors = {
            up: 'var(--success)',
            down: 'var(--danger)',
            neutral: 'var(--text-tertiary)'
        };
        return colors[this.trend] || colors.neutral;
    }

    render() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --card-bg: ${isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
                    --card-border: ${isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
                    --card-shadow: ${isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
                    --card-hover-shadow: ${isDark ? '0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.2)'};
                    --text-title: ${isDark ? '#e5e7eb' : '#4a5568'};
                    --text-value: ${isDark ? '#f3f4f6' : '#2d3748'};
                    --text-unit: ${isDark ? '#9ca3af' : '#718096'};
                    --trend-color: ${this.getTrendColor()};
                    
                    display: block;
                    background: var(--card-bg);
                    border-radius: 16px;
                    padding: 1.5rem 2rem;
                    box-shadow: var(--card-shadow);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid var(--card-border);
                    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: var(--card-hover-shadow);
                }
                
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                    color: var(--text-title);
                }
                
                .title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-unit);
                }
                
                .icon {
                    font-size: 1.5rem;
                    opacity: 0.9;
                }
                
                .value {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin: 0.5rem 0;
                    color: var(--text-value);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    line-height: 1.2;
                }
                
                .trend {
                    font-size: 1.1rem;
                    margin-left: 0.25rem;
                    opacity: 0.9;
                    color: var(--trend-color);
                }
                
                .unit {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-unit);
                    opacity: 0.9;
                    margin-left: 0.15rem;
                }
            </style>
            
            <div class="header">
                <h3 class="title">${this.getAttribute('title') || 'Sensor'}</h3>
                <span class="icon">${this.icon}</span>
            </div>
            <div class="value">
                ${this.value}
                ${this.unit ? `<span class="unit">${this.unit}</span>` : ''}
                <span class="trend">${this.getTrendIcon()}</span>
            </div>
        `;
    }
}

customElements.define('sensor-card', SensorCard);
