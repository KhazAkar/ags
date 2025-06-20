class ControlButton extends HTMLElement {
    static get observedAttributes() {
        return ['active', 'loading'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._active = false;
        this._loading = false;
        this._originalText = '';
        this._clickHandler = this._handleClick.bind(this);
        this._themeChangeHandler = () => this._handleThemeChange();
        this._isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    }

    connectedCallback() {
        // Re-evaluate theme in case it changed before the component was upgraded
        this._isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this._render();
        const button = this.shadowRoot.querySelector('button');
        if (button) {
            button.addEventListener('click', this._clickHandler);
        }
        document.addEventListener('theme-change', this._themeChangeHandler);
        // Add observer for data-theme attribute changes
        this._observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this._handleThemeChange();
                }
            });
        });
        this._observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    disconnectedCallback() {
        const button = this.shadowRoot.querySelector('button');
        if (button) {
            button.removeEventListener('click', this._clickHandler);
        }
        // Clean up event listeners and observer
        document.removeEventListener('theme-change', this._themeChangeHandler);
        if (this._observer) {
            this._observer.disconnect();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active') {
            this._active = newValue !== null;
        } else if (name === 'loading') {
            this._loading = newValue !== null;
        }
        this._render();
    }

    _handleClick() {
        this.dispatchEvent(new CustomEvent('control-click', {
            bubbles: true,
            composed: true,
            detail: { id: this.id }
        }));
    }

    setLoading(loading) {
        this._loading = loading;
        this._render();
    }

    setActive(active) {
        this._active = active;
        this._render();
    }

    _handleThemeChange() {
        const newIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (this._isDark !== newIsDark) {
            this._isDark = newIsDark;
            this._render();
        }
    }

    _getThemeStyles() {
        return `
            :host {
                --button-bg: ${this._isDark ? 'rgba(55, 65, 81, 0.8)' : '#f3f4f6'};
                --button-hover: ${this._isDark ? 'rgba(75, 85, 99, 0.9)' : '#e5e7eb'};
                --button-text: ${this._isDark ? '#f3f4f6' : '#1f2937'};
                --button-border: ${this._isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(0, 0, 0, 0.1)'};
                --button-shadow: ${this._isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'};
                --button-disabled: ${this._isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.5)'};
                --button-disabled-text: ${this._isDark ? 'rgba(156, 163, 175, 0.7)' : 'rgba(107, 114, 128, 0.7)'};
                --button-focus-ring: ${this._isDark ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)'};
            }
        `;
    }

    _render() {
        const button = document.createElement('button');
        button.disabled = this._loading;
        button.className = `control-button ${this._active ? 'active' : ''} ${this._loading ? 'loading' : ''}`;
        
        const icon = this.getAttribute('icon') || '⚡';
        const text = this._loading ? '...' : this.textContent.trim();
        
        button.innerHTML = `
            <style>
                ${this._getThemeStyles()}
                
                .control-button {
                    --button-active-bg: var(--primary);
                    --button-active-hover: var(--primary-dark);
                    --button-active-text: white;
                    
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border: 1px solid var(--button-border);
                    border-radius: 0.5rem;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background-color: var(--button-bg);
                    color: var(--button-text);
                    box-shadow: var(--button-shadow);
                    min-width: 120px;
                }

                .control-button:hover:not(:disabled) {
                    background-color: var(--button-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                .control-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .control-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px var(--button-focus-ring);
                }

                .control-button:disabled {
                    background-color: var(--button-disabled);
                    color: var(--button-disabled-text);
                    cursor: not-allowed;
                    transform: none !important;
                }

                .control-button.active {
                    background-color: var(--button-active-bg);
                    color: var(--button-active-text);
                    border-color: transparent;
                }

                .control-button.active:hover:not(:disabled) {
                    background-color: var(--button-active-hover);
                }

                .control-button.loading {
                    position: relative;
                    color: transparent !important;
                    pointer-events: none;
                }

                .control-button.loading::after {
                    content: '';
                    position: absolute;
                    width: 1.25rem;
                    height: 1.25rem;
                    border: 2px solid var(--button-text);
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    opacity: 0.5;
                }

                .control-button.active.loading::after {
                    border-color: rgba(255, 255, 255, 0.5);
                    border-top-color: transparent;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .icon {
                    font-size: 1.1em;
                    line-height: 1;
                }
                
                .text {
                    white-space: nowrap;
                }
            </style>
            <span class="icon">${icon}</span>
            <span class="text">${text}</span>
        `;

        // Replace shadow content and ensure click handler attached
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(button);
        button.addEventListener('click', this._clickHandler);
    }
}

customElements.define('control-button', ControlButton);
