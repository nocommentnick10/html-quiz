// 1 Перемещение по карточкам

const navigate = (direction, thisCard) => {
    const thisCardNumber = parseInt(thisCard.dataset.card)

    let nextCard
    direction === 'next' ? nextCard = thisCardNumber + 1 : nextCard = thisCardNumber - 1

    thisCard.classList.add('hidden')
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden')
}

// 2 Сбор данных с карточки

const gatherCardData = (cardNum) => {
    /*

    {
        question: ...,
        answer: 
            [
                { name: '...', value: '...' },
                { name: '...', value: '...' },
            ]
    }

    */
    let result = []

    const currCard = document.querySelector(`[data-card="${cardNum}"]`)
    const question = currCard.querySelector('[data-question]').innerText

    const radioValues = currCard.querySelectorAll('[type="radio"]')

    radioValues.forEach(function (item) { 
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    const checkValues = currCard.querySelectorAll('[type="checkbox"]')

    checkValues.forEach(function(item){
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    const inputs = currCard.querySelectorAll('[type="text"], [type="email"], [type="number"]')

    inputs.forEach(function (item) { 
        if(item.value.trim() != ''){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    const data = {
        question,
        answer: result
    }

    return data
}

// 3 Сохранение данных с карточки В объект с ответами

const saveAnswer = (cardNum, data) => {
    answers[cardNum] = data
}

// 4 Валидация на наличие ответов

const isFilled = (cardNum) => {
    if(answers[cardNum].answer.length > 0){
        return true
    } else {
        return false
    }
}

// 5 Проверка на заполненость полей

const checkOnRequired = (cardNum) => {
    const currCard = document.querySelector(`[data-card="${cardNum}"]`)

    const requiredFields = currCard.querySelectorAll('[required]')

    let isValidArray = []

    requiredFields.forEach((item) => {
        if(item.type === 'checkbox' && item.checked === false){
            isValidArray.push(false)
        } else if(item.type === 'email'){
            if(validateEmail(item.value)){
                isValidArray.push(true)
            } else {
                isValidArray.push(false)
            }
        }
    })

    if(isValidArray.indexOf(false) == -1){
        // console.log(isValidArray)
        return true
    } else {
        // console.log(isValidArray)
        return false
    }
}

// ValidateEmail

function validateEmail(email) { 
    const pattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
    return pattern.test(email)
}

// 6 Подсветка радиокнопок

document.querySelectorAll('.radio-group').forEach((item) => {
    item.addEventListener('click', (e) => {
        const label = e.target.closest('label')
        if(label){
            label.closest('.radio-group').querySelectorAll('label').forEach((item) => {
                item.classList.remove('radio-block--active')
            })
            label.classList.add('radio-block--active')
        }
    })
})

// 7 Подсветка чекбоксов

document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach((item) => {
    item.addEventListener('change', () => {
        if(item.checked){
            item.closest('label').classList.add('checkbox-block--active')
        } else {
            item.closest('label').classList.remove('checkbox-block--active')
        }
    })
})

// 8 Отображение прогресс бара

const updateProgressBar = (direction, cardNum) => {
    const cardsTotalNum = document.querySelectorAll('[data-card]').length

    if(direction === 'next'){
        cardNum += 1
    } else if(direction === 'prev') {
        cardNum -= 1
    }

    let progress = (cardNum * 100) / cardsTotalNum
    progress = progress.toFixed()

    const progressBar = document.querySelector(`[data-card="${cardNum}"]`).querySelector('.progress')

    if(progressBar){
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`
        progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%`
    }
}

let answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

const btnNext = document.querySelectorAll('[data-nav="next"]')
const btnPrev = document.querySelectorAll('[data-nav="prev"]')

btnNext.forEach(function(btn) {
    btn.addEventListener('click', function(){
        const thisCard = this.closest('[data-card]')
        const cardNum = parseInt(thisCard.dataset.card)

        if(thisCard.dataset.validate === 'novalidate'){
            navigate('next', thisCard)
            updateProgressBar('next', cardNum)
        } else {
            saveAnswer(cardNum, gatherCardData(cardNum))

            isFilled(cardNum) && checkOnRequired(cardNum) ? (navigate('next', thisCard), updateProgressBar('next', cardNum)) : alert('Сделайте ответ')
        }
    })
})

btnPrev.forEach(function(btn) {
    btn.addEventListener('click', function(){
        const thisCard = this.closest('[data-card]')
        const cardNum = parseInt(thisCard.dataset.card)

        navigate('prev', thisCard)

        updateProgressBar('prev', cardNum)
    })
})