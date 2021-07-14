class Modal {
    #element

    constructor(className) {
        this.#element = document.querySelector(`.${className}`)

        //  close modal events
        const modalBackdrop = this.#element.querySelector(".modal__backdrop")
        modalBackdrop.addEventListener("click", () => this.close()) // close on backdrop clicked

        const modalCloseButton = this.#element.querySelector(".close__btn")
        modalCloseButton.addEventListener("click", () => this.close())    // close on close button clicked
    }

    get element () {
        return this.#element
    }

    open () {
        this.#element.classList.add("active")
    }

    close () {
        this.#element.classList.remove("active")
    }
}