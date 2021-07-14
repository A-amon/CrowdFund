class MainStatus {
    #values = document.getElementsByClassName("status__val")
    #progressBar = document.getElementsByClassName("progress__value")[0]

    constructor(backedAmount, backersCount, daysLeft) {
        this.backedAmount = backedAmount
        this.backersCount = backersCount
        this.daysLeft = daysLeft
    }

    get backedAmount () {
        return this._backedAmount
    }

    get backersCount () {
        return this._backersCount
    }

    get daysLeft () {
        return this._daysLeft
    }

    set backedAmount (value) {
        this._backedAmount = value
        this.#values[0].textContent = value.toLocaleString()
        this.updateProgressValue()
    }

    set backersCount (value) {
        this._backersCount = value
        this.#values[1].textContent = value
    }

    set daysLeft (value) {
        this._daysLeft = value
        this.#values[2].textContent = value
    }

    updateProgressValue () {
        let newProgressVal = Math.floor(this._backedAmount / 100000 * 100)
        newProgressVal = newProgressVal > 100 ? 100 : newProgressVal    //  max progress value is 100%
        this.#progressBar.setAttribute("data-current", newProgressVal)
        this.#progressBar.style.width = `${newProgressVal}%`
    }
}