class CourseItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['course-name', 'course-id'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get courseName() {
    return this.getAttribute('course-name') || '';
  }

  get courseId() {
    return this.getAttribute('course-id') || '';
  }

  setupEventListeners() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => {
      this.handleRemove();
    });
  }

  handleRemove() {
    // Disparar evento personalizado para notificar la eliminación
    this.dispatchEvent(new CustomEvent('course-remove', {
      detail: {
        courseId: this.courseId,
        courseName: this.courseName
      },
      bubbles: true
    }));

    // Remover el elemento del DOM
    this.remove();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
       .course-item {
          --base-color: 60, 255, 15;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          font-family: inherit;
          border: .5px solid rgba(var(--base-color), 1);
          background-color: rgba(var(--base-color), 0.23);
          cursor: pointer;
        }

        .course-name {
          flex: 1;
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          transition: background-color 0.2s ease;
          border-radius: 50%;
          }

            .close-icon {
                width: 24px;
                height: 24px;
                color: rgba(var(--base-color), 1);
                }
          .close-icon:hover {
                color: rgba(255, 0, 0, 1);
            }



          .course-name {
            color: rgba(var(--base-color), 1);
          }
        }
      </style>
      <div class="course-item">
        <p class="course-name">${this.courseName}</p>
        <button class="close-btn" type="button" aria-label="Remover curso">
          <iconify-icon
            icon="material-symbols:close-small"
            width="24"
            height="24"
            class="close-icon"
          ></iconify-icon>
        </button>
      </div>
    `;
  }
}

// Definir el custom element
customElements.define('course-item', CourseItem);
