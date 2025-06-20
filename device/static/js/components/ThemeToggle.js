class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Determine initial theme – prefer saved user setting over system preference
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            this._darkMode = saved === 'true';
        } else {
            this._darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // Apply the theme immediately to avoid flash of incorrect theme
        document.documentElement.setAttribute('data-theme', this._darkMode ? 'dark' : 'light');

        // If no saved preference, watch for OS-level preference changes
        if (saved === null && window.matchMedia) {
            this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this._mediaQueryListener = (e) => {
                this._darkMode = e.matches;
                this.updateTheme();
                // Inform listeners of the change
                this.dispatchEvent(new CustomEvent('theme-change', { detail: { darkMode: this._darkMode }, bubbles: true, composed: true }));
            };
            this._mediaQuery.addEventListener('change', this._mediaQueryListener);
        }
    }

    static get observedAttributes() {
        return ['dark'];
    }

    connectedCallback() {
        this.render();
        this.toggleButton = this.shadowRoot.querySelector('button');
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
        this.updateTheme();
    }

    toggleTheme() {
        this._darkMode = !this._darkMode;
        localStorage.setItem('darkMode', this._darkMode);
        this.updateTheme();
        this.dispatchEvent(new CustomEvent('theme-change', { 
            detail: { darkMode: this._darkMode },
            bubbles: true,
            composed: true
        }));
    }

    updateTheme() {
        document.documentElement.setAttribute('data-theme', this._darkMode ? 'dark' : 'light');
        this.setAttribute('dark', this._darkMode);
        this.toggleButton?.setAttribute('aria-label', 
            `${this._darkMode ? 'Switch to light' : 'Switch to dark'} mode`
        );
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'dark' && oldValue !== newValue) {
            const newMode = newValue !== null && newValue !== 'false';
            if (this._darkMode !== newMode) {
                this._darkMode = newMode;
                this.updateTheme();
            }
        }
    }

    disconnectedCallback() {
        if (this._mediaQueryListener && this._mediaQuery) {
            this._mediaQuery.removeEventListener('change', this._mediaQueryListener);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                
                button {
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    width: 2.5rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                button:hover {
                    background-color: var(--bg-hover);
                }
                
                button:focus {
                    outline: 2px solid var(--primary);
                    outline-offset: 2px;
                }
                
                .icon {
                    font-size: 1.25rem;
                    transition: transform 0.3s ease;
                }
                
                :host([dark]) .moon { display: none; }
                :host(:not([dark])) .sun { display: none; }
            </style>
            <button aria-label="Toggle dark mode">
                <span class="icon sun">☀️</span>
                <span class="icon moon">🌙</span>
            </button>
        `;
    }
}

customElements.define('theme-toggle', ThemeToggle);
