export default class Footer {
    constructor() {
        this.element = document.createElement('footer');
        this.element.className = 'footer bg-white border-top py-3 d-flex justify-content-center align-items-center';

        this.element.textContent = '© 2025 Hotel Reservation. All rights reserved.';

        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('footer-styles')) return;

        const style = document.createElement('style');
        style.id = 'footer-styles';
        style.textContent = `
        .footer {
          font-size: 1rem;
          color: #333;
          user-select: none;
        }
      `;
        document.head.appendChild(style);
    }

    getHtml() {
        return this.element;
    }
}