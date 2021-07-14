var mainStatus

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

const rewardsModal = new Modal("rewards__modal")
const completedModal = new Modal("complete__modal")

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

    bookmarkButton.innerHTML = `<span>Bookmark${!isChecked ? 'ed' : ''}</span>`
}

//  select reward
//  check selected reward radiobutton
function selectReward (selectedId) {
    const prevSelectedCard = document.querySelector(".selected")
    if (prevSelectedCard) {
        prevSelectedCard.classList.remove('selected')
    }

    const selectedCard = rewardsModal.element.querySelector(`[data-id="${selectedId}"]`)

    const selectedRadio = selectedCard.querySelector("[type='radio']")
    selectedRadio.checked = true

    selectedCard.classList.add("selected")
}

//  handle pledge submission
function pledge (card, reward) {
    const pledgeAmount = parseInt(card.querySelector(".pledge__amount").value)

    let errorMessage = null

    if (pledgeAmount === 0 || isNaN(pledgeAmount)) {
        errorMessage = "Pledge amount must not be empty"
    }
    else {
        let canUpdate = false   //  true if pledgeAmount is enough and reward !== NULL

        //  if selected pledge option with reward
        if (reward !== null) {
            if (pledgeAmount >= reward.min) {
                updateRewardsAmount(reward.id)
                canUpdate = true
            }
            else if (pledgeAmount < reward.min) {
                errorMessage = `Min pledge for this reward is ${reward.min}`
            }
        }
        if (reward === null || canUpdate) {
            mainStatus.backersCount++
            mainStatus.backedAmount += pledgeAmount

            rewardsModal.close()
            completedModal.close()
        }

    }

    setPledgeErrorMessage(card, errorMessage)
}

//  update reward object's amount value
//  decrement amount
function updateRewardsAmount (id) {
    const rewardInd = rewards.findIndex(__reward => __reward.id === id)
    rewards[rewardInd].amount--
    updateAmountShown(id, rewards[rewardInd].amount)
}

//  set pledge error message to be displayed
function setPledgeErrorMessage (card, message) {
    const pledgeErrorMessage = card.querySelector(".pledge__error")
    pledgeErrorMessage.textContent = message
}

//  update amount left in selected reward card
function updateAmountShown (id, amount) {
    const rewardCards = document.querySelectorAll(`[data-id='${id}']`)
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
        selectReward(reward.id)
        rewardsModal.open()
    })

    mainStands.appendChild(rewardCard)
}

//  add reward to rewards modal
function addToRewardsModal (reward) {
    const modalStands = rewardsModal.element.querySelector(".modal__stands")
    let rewardCard = cloneTemplate(pledgeTemplate, reward)

    addEventToCard(rewardCard, reward)

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
function addEventToCard (card, reward = null) {
    card.addEventListener("click", event => {
        const rewardId = reward === null ? 0 : reward.id
        selectReward(rewardId)
    })

    const pledgeButton = card.querySelector(".pledge__submit")
    pledgeButton.addEventListener("click", event => {
        pledge(card, reward)
    })
}

function init () {
    mainStatus = new MainStatus(89914, 5007, 56)
    listRewards()

    document.addEventListener('scroll', handleScroll);

    const backButton = document.getElementsByClassName("back__btn")[0]  // back project button
    backButton.addEventListener("click", () => { rewardsModal.open() })

    const bookmarkButton = document.getElementsByClassName("bookmark__btn")[0]  // bookmark switch
    bookmarkButton.addEventListener("click", () => { bookmarkProject(bookmarkButton) })

    const navbarButton = document.getElementsByClassName("navbar__btn")[0]  //  hamburger button
    navbarButton.addEventListener("click", () => { handleMenu() })

    const modalRewardCard = document.getElementsByClassName("modal__stands")[0].children[0]
    addEventToCard(modalRewardCard)

    selectReward(0)
}

init()