var selectedReward = null
var isBookmarked = false

const rewards = [
    {
        id: 1,
        name: "Bamboo Stand",
        min: 25,
        description: "You get an ergonomic stand made of natural bamboo. You've helped us launch our promotional campaign, and you'll be added to a special Backer member list.",
        amount: 101
    },
    {
        id: 2,
        name: "Black Edition Stand",
        min: 75,
        description: "You get a Black Special Edition computer stand and a personal thank you. You'll be added to our Backer member list. Shipping is included.",
        amount: 64
    },
    {
        id: 3,
        name: "Mahogany Special Edition",
        min: 200,
        description: "You get two Special Edition Mahogany stands, a Backer T-Shirt, and a personal thank you. You'll be added to our Backer member list. Shipping is included.",
        amount: 0
    }
]

const pledgeTemplate = document.getElementById("card--pledge")
const rewardTemplate = document.getElementById("card--reward")

//  handle scroll event
//  give navbar background color when scrolled
function handleScroll () {
    const scroll_loc = window.scrollY
    const navbar = document.getElementsByClassName("navbar")[0]

    if (scroll_loc > 100)
        navbar.classList.add("filled")
    else
        navbar.classList.remove("filled")
}

//  toggle menu on mobile view
//  show/ hide backdrop
function handleMenu () {
    const isMenuOpen = navbarButton.getAttribute("aria-expanded") == "true" //  get boolean isMenuOpen value
    const mainContent = document.getElementsByClassName("main")[0]  //  backdrop element

    navbarButton.setAttribute("aria-expanded", !isMenuOpen)
    mainContent.classList.toggle("hide")
}

//  set bookmarked status
function bookmarkProject (bookmarkButton) {
    const bookmarkCheckbox = document.getElementById("bookmark__checkbox")
    const isChecked = bookmarkCheckbox.checked

    bookmarkCheckbox.checked = !isChecked
    isBookmarked = !isChecked

    bookmarkButton.innerHTML = `<span>Bookmark${isBookmarked ? 'ed' : ''}</span>`
}

//  handle completed process modal
function handleCompleteModal () {
    const completeModal = document.getElementsByClassName("complete__modal")[0]

    handleModal(completeModal)
}

//  show/close modal
function handleModal (modal) {
    modal.classList.toggle('active')

    if (modal.classList.contains('active')) {
        const modalBackdrop = modal.querySelector(".modal__backdrop")
        modalBackdrop.addEventListener("click", () => handleModal(modal))    // close on backdrop clicked

        const modalCloseBtn = modal.querySelector(".close__btn")
        modalCloseBtn.addEventListener("click", () => handleModal(modal))    // close on close button clicked
    }
}

//  handle rewards modal
function handleRewardsModal () {
    const rewardsModal = document.getElementsByClassName("rewards__modal")[0]

    handleModal(rewardsModal)
}

//  unselect previously selected reward
function unselectPrevReward () {
    if (selectedReward !== null) {  //  cannot unselect if no alternative reward selected
        selectedCard.classList.remove('selected')
    }
}


function selectReward (__selectedCard, isModal = true) {
    unselectPrevReward()

    const selectedId = parseInt(__selectedCard.getAttribute("data-id"))

    let selectedRadio
    if (isModal) {
        selectedRadio = __selectedCard.querySelector("[type='radio']")
        __selectedCard.classList.add("selected")
        selectedCard = __selectedCard
    }
    else {
        const rewardCard = getCardInModal(selectedId)
        selectedRadio = getRadioInModal(rewardCard)
        rewardCard.classList.add("selected")
        selectedCard = rewardCard
    }

    selectedReward = parseInt(selectedId)
    selectedRadio.checked = true
}

function getCardInModal (selectedId) {
    const rewardsModal = document.getElementsByClassName("rewards__modal")[0]
    const rewardCard = rewardsModal.querySelector(`[data-id='${selectedId}']`)

    return rewardCard
}

function getRadioInModal (rewardCard) {
    const radio = rewardCard.querySelector("[type='radio']")

    return radio
}

function pledge (reward) {
    const pledgeAmount = parseInt(document.getElementsByClassName("pledge__amount")[reward.id === null ? 0 : reward.id].value)

    let errorMessage = null

    if (reward === null || pledgeAmount >= reward.min) {
        if (reward !== null) {
            const rewardInd = rewards.findIndex(__reward => __reward.id === reward.id)
            rewards[rewardInd].amount--
            updateAmountShown(reward.amount)
        }
        mainStatus.backersCount++
        mainStatus.backedAmount += pledgeAmount

        handleRewardsModal()
        handleCompleteModal()
    }
    else if (pledgeAmount === 0) {
        errorMessage = "Pledge amount must not be empty"
    }
    else if (pledgeAmount < reward.min) {
        errorMessage = `Min pledge for this reward is ${reward.min}`
    }

    setPledgeErrorMessage(errorMessage)
}

//  set pledge error message to be displayed
function setPledgeErrorMessage (message) {
    const pledgeErrorMessage = document.getElementsByClassName("pledge__error")[0]
    pledgeErrorMessage.textContent = message
}

//  update amount left in selected reward card
function updateAmountShown (amount) {
    const rewardCards = document.querySelectorAll(`[data-id='${selectedReward}']`)
    rewardCards.forEach(rewardCard => {
        const rewardAmount = rewardCard.querySelectorAll(".amount__left")
        rewardAmount.forEach(__rewardAmount => {
            __rewardAmount.children[0].textContent = amount
        })
    })
}

//  loop through rewards
//  add to main list and rewards modal
function listRewards () {
    rewards.forEach(reward => {
        addToMain(reward)
        addToRewardsModal(reward)
    })
}

//   add reward to main list
function addToMain (reward) {
    const mainStands = document.getElementsByClassName("main__stands")[0]
    let rewardCard = cloneTemplate(rewardTemplate, reward)

    const rewardButton = rewardCard.querySelector(".reward__btn")
    rewardButton.addEventListener("click", () => {
        selectReward(rewardCard, false)
        handleRewardsModal()
    })

    mainStands.appendChild(rewardCard)
}

//  add reward to rewards modal
function addToRewardsModal (reward) {
    const modalStands = document.getElementsByClassName("modal__stands")[0]
    let rewardCard = cloneTemplate(pledgeTemplate, reward)

    addClickEventToCard(rewardCard, reward)

    modalStands.appendChild(rewardCard)
}

//  replace named content with passed value
//  return updated element
function replaceValue (card, name, value) {
    card.innerHTML = card.innerHTML.replaceAll(name, value)
    return card
}

//  clone template
//  replace content with reward values
function cloneTemplate (template, { id, name, description, min, amount }) {
    let cloned = template.content.firstElementChild.cloneNode(true)

    cloned.setAttribute("data-id", id)
    cloned.setAttribute("data-amount", amount)

    cloned = replaceValue(cloned, "$name", name)
    cloned = replaceValue(cloned, "$description", description)
    cloned = replaceValue(cloned, "$min", min)
    cloned = replaceValue(cloned, "$amount", amount)

    return cloned
}

//  add click event handler to card
function addClickEventToCard (card, reward = null) {
    card.addEventListener("click", (event) => {
        if (event.target.className === "pledge__submit")
            pledge(reward)
        else
            selectReward(card)
    })
}


const mainStatus = new MainStatus(89914, 5007, 56)
listRewards()

document.addEventListener('scroll', handleScroll);

const backButton = document.getElementsByClassName("back__btn")[0]  // back project button
backButton.addEventListener("click", () => { handleRewardsModal() })

const bookmarkButton = document.getElementsByClassName("bookmark__btn")[0]  // bookmark switch
bookmarkButton.addEventListener("click", () => { bookmarkProject(bookmarkButton) })

const navbarButton = document.getElementsByClassName("navbar__btn")[0]  //  hamburger button
navbarButton.addEventListener("click", () => { handleMenu() })

const modalRewardCard = document.getElementsByClassName("modal__stands")[0].children[0]
addClickEventToCard(modalRewardCard)