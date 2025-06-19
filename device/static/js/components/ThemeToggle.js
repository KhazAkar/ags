class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._darkMode = localStorage.getItem('darkMode') === 'true' || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
            detail: { darkMode: this._darkMode } 
        }));
    }

    updateTheme() {
        document.documentElement.setAttribute('data-theme', this._darkMode ? 'dark' : 'light');
        this.setAttribute('dark', this._darkMode);
        this.toggleButton?.setAttribute('aria-label', 
            `${this._darkMode ? 'Switch to light' : 'Switch to dark'} mode`
        );
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
