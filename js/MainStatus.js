class MainStatus {
    #values = document.getElementsByClassName("status__val")
    #progressBar = document.getElementsByClassName("progress__value")[0]

    constructor(backedAmount, backersCount, daysLeft) {
        this.backedAmount = backedAmount
        this.backersCount = backersCount
        this.daysLeft = daysLeft
    }

    //  return backed amount
    get backedAmount () {
        return this._backedAmount
    }

    //  return number of backers
    get backersCount () {
        return this._backersCount
    }

    //  return number of days left
    get daysLeft () {
        return this._daysLeft
    }

    //  set backed amount
    //  update progress bar value based on backed amount
    set backedAmount (value) {
        this._backedAmount = value
        this.#values[0].textContent = value.toLocaleString()
        this.setProgressValue(value)
    }

    //  set number of backers
    set backersCount (value) {
        this._backersCount = value
        this.#values[1].textContent = value
    }

    //  set number of days left
    set daysLeft (value) {
        this._daysLeft = value
        this.#values[2].textContent = value
    }

    //  set progress bar value
    setProgressValue (value) {
        let newProgressVal = Math.floor(value / 100000 * 100)           //  percentage
        newProgressVal = newProgressVal > 100 ? 100 : newProgressVal    //  max progress value is 100%
        this.#progressBar.setAttribute("aria-current", newProgressVal)  //  accessible value
        this.#progressBar.style.width = `${newProgressVal}%`            //  set width of progress bar value
    }
}