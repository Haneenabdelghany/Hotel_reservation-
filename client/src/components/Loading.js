export default class Loading {
    constructor() {
        this.element = document.createElement('div');
        this.element.id = 'loading-overlay';
        this.element.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        this.addStyle();
    }

    addStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            #loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);
    }

    hide() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    getHtml() {
        return this.element;
    }
}