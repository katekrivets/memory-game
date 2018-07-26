//card list
let card = document.querySelectorAll("li.card");
let cards = [...card];
//deck of cards
let deck = document.querySelector("ul.deck");
//restart button
let restart = document.querySelector(".restart");
//opend cards container
let opened = [];
//score panel
let moves = document.querySelector(".moves");
let clickCounter = 0;
//earned stars
let star = document.querySelectorAll(".score-panel .stars li");
let stars = [...star];
//interval for timer
let interval; 

let deg = 360;
//game begins on every reload
window.onload = startCardGame();
//restart button 
restart.addEventListener("click", () => {
    opened = []; 
    rotateRestartBtn();
    startCardGame();
});

function startCardGame() { 
    cards = shuffle(cards);
    deck.innerHTML = '';    
    cards.forEach(card => {
        card.classList.remove("open", "show", "match");
        deck.appendChild(card);
    });
    clearInterval(interval);
    myTimer();
};
/**
 * animation of restart button
 */
function rotateRestartBtn() {
    restart.style.webkitTransform = 'rotate('+deg+'deg)'; 
    restart.style.mozTransform    = 'rotate('+deg+'deg)'; 
    restart.style.msTransform     = 'rotate('+deg+'deg)'; 
    restart.style.oTransform      = 'rotate('+deg+'deg)'; 
    restart.style.transform       = 'rotate('+deg+'deg)'; 
    deg += 360;
}
/**
 * adding event listeners to each card
 */
cards.forEach((card) => {
    card.addEventListener("click", () => {
        clickCounter++;
        setScore();
        card.classList.add("open","show", "disabled");
        opened.push(card);
        if(opened.length == 2) {
            deck.classList.add("disabled");
            //some shit
            setTimeout(() => {
            checkMatched().then(saveMatched).catch(clearUnmatched).then(() => {
                opened = [];
                deck.classList.remove('disabled')
                complete();
            });
            }, 600)
        }
    });
});

function checkMatched() {
    return new Promise((resolve, reject) => {
            let first = opened[0].firstElementChild.classList.value;
            let second = opened[1].firstElementChild.classList.value;
        console.log(opened)
        if (first == second) {
            resolve("match")
        } else {
            reject("no")
        }
        
    })
}

function saveMatched() {
    opened.forEach((card) => {
        card.classList.add("match");
        card.classList.remove('disabled')
    })
}

function clearUnmatched() {
    opened.forEach((card) => {
        card.classList.add("wrong");
        setTimeout(() => { 
            card.classList.remove("open", "show", "wrong", "disabled") 
    }, 600);
    })
}
/**
 *  endgame modal 
 */
function complete() {
    if (deck.querySelectorAll(".match").length == 16) {
        let message = ""
        showModal(stars)
    }
}
/** custom timer for game */
function myTimer() {
    interval = setInterval(setTimer, 1000);
    let start = new Date();
    let min = 0;
    let seconds = 0;
    function setTimer() {
        let now = new Date();
        seconds = Math.round((now - start) / 1000);
        if (seconds == 60) {
            seconds = 0;
            start = new Date();
            now = new Date();
            min++;
        }
        document.querySelector(".timer").innerHTML = min + ":" + seconds;
    }
}

function setScore() {
    moves.innerHTML = clickCounter;
    if (clickCounter > 24) {
        stars[0].classList.add("hidden");
    } else if (clickCounter > 24 && clickCounter >= 30) {
        stars[1].classList.add("hidden");
    } else {
        stars.forEach((star) => {
            star.classList.remove("hidden");
        })
        
    }
} 

function showModal(result) {
    modal.style.display = "block";
    result.forEach((el) => {
        document.querySelector(".player-score").appendChild(el);
    })
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var modal = document.getElementById('scoreModal');

var closeModal = document.getElementsByClassName("close")[0];

closeModal.onclick = function() {
    startCardGame();
    clickCounter = 0;
    modal.style.display = "none";
}