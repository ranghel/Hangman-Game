
window.onload = function() {
        game.addLetterButtons(event);
        game.set();

        document.onkeyup = function(startEvent) {
            game.userInput = String.fromCharCode(startEvent.keyCode).toUpperCase();
            game.startGame();
        }        
    } 

// Global variables

var wins = 0;
var losses = 0;



// Game object
var game = {
    wordsLibrary: ["Liver","Kidneys","Brain","Stomach","Heart","Lungs","Appendix","Pancreas","Intestines",],
    letters: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_"],
    lives: 8,
    userInputs: [],
    userInput: "",
    computerWord: "",
    wordWithMatchedLetters: "",
    computerWordLength: 0,
    matchedLettersCount: 0,
    gameOver: false,
    winLoss: false,


    set: function() {
        this.lives = 8;
        this.computerWord = this.computerPick();
        this.computerWordLength = this.wordLength();
        this.userInput = "";
        this.userInputs = [];
        this.matchedLettersCount = 0;
        this.wordWithMatchedLetters = "";
        this.gameOver = false;
        this.winLoss = false;


        var dashes = this.printDashes();
        this.printWord(dashes);

        // HTML Elements
        document.querySelector("#loadnew").innerHTML = "";
        document.querySelector("#message-win").innerHTML = "";
        document.querySelector("#message-loss").innerHTML = "";
        document.querySelector("#lives").innerHTML = this.lives;
        document.querySelector("#wins").innerHTML = wins;
        document.querySelector("#losses").innerHTML = losses;
        document.querySelector("#score").style.display = 'inline-block';
        
    },

    // Start game if player input is a letter
    startGame: function() {
        if (this.gameOver === false && this.isLetter()) {
            this.rules();
        }
    },

    // Validate against rules
    rules: function() {
        if (!this.letterPressed()) { 
            this.disableLetterBtn();
            this.enteredLetters(); 
            if (!this.wordContainsInput()) { 
                this.printAttemptsRemaining();
                this.scoreCountAndSound();             
                this.startNewGame();

            } else { 
                this.replaceDashes();
                this.scoreCountAndSound(); 
                this.startNewGame();
                document.querySelector("#word").innerHTML = this.wordWithMatchedLetters;
            }
        }
    },

    // Generate computer pick random word
    computerPick: function() {
        var computerRandomPick = Math.floor(Math.random() * this.wordsLibrary.length);
        //console.log(this.wordsLibrary[computerRandomPick]);
        return this.wordsLibrary[computerRandomPick];
    },

    //Calculate word length
    wordLength: function() {
        return this.computerWord.length;
    },

    // Create string for the dashes
    printDashes: function() {
        var word = "";
        for (var i = 0; i < this.computerWordLength; i++) {
            word += '_ ';
        }
        this.wordWithMatchedLetters = word;
        return word;
    },

    // Check to see if player already attempted the input
    letterPressed: function() {
        if (this.userInputs.length !== 0) {
            var input = this.userInputs.indexOf(this.userInput) < 0 ? false : true;
            return input;
        } else {
            return false;
        }
    },

    // Updating attempts remaining
    enteredLetters: function() {
        this.userInputs.push(this.userInput);
    },

    // Capture player input
    isLetter: function() {
        var letter = (/[A-Z|a-z]/i);
        return this.userInput.match(letter);
    },

    //Check if word contains the letter player entered
    wordContainsInput: function() {
        var contains = false;
        for (var i = 0; i < this.computerWordLength; i++) {
            if (this.computerWord.charAt(i).toUpperCase() == this.userInput) {
                contains = true;
            }
        }
        return contains;
    },

    //Replace dashes with letters
    replaceDashes: function() {
        for (var i = 0; i < this.computerWordLength; i++) {
            if (this.computerWord.charAt(i).toUpperCase() == this.userInput) {
                if (i === 0) {
                    this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i * 2) +
                        this.userInput.toUpperCase() + this.wordWithMatchedLetters.substring((i * 2 + 1));
                } else {
                    this.wordWithMatchedLetters = this.wordWithMatchedLetters.substring(0, i * 2) +
                        this.userInput.toLowerCase() + this.wordWithMatchedLetters.substring((i * 2 + 1));
                }
                this.matchedLettersCount++;
            }
        }
    },

    // Print word
    printWord: function(word) {
        document.querySelector("#word").innerHTML = word;
    },

    // Number of attmepts remaining
    printAttemptsRemaining: function() {
        this.lives--;
        document.querySelector("#lives").innerHTML = this.lives;
    },

    // Update score and sounds 
    scoreCountAndSound: function() {
        if (this.matchedLettersCount == this.computerWordLength) {
            wins++;
            this.playSound("assets/sounds/youwin.wav");
            this.winLoss = true;
            this.gameOver = true;
        }
        if (this.lives === 0) {
            losses++;
            this.playSound("assets/sounds/gameover.wav");
            this.gameOver = true;
            this.winLoss = false;
            this.computerWord;
            document.querySelector("#word").innerHTML = this.computerWord;
            console.log("Computer Picked: ", this.computerWord);
        }
    },



    // starts new game
    startNewGame: function() {
        if (this.gameOver === true) {
            var text = "";
            document.querySelector("#score").style.display = 'none';

            if (this.winLoss) {
                text += '<div id="message-win">You Won !</div>' ;
               
            } else {
                text += '<div id="message-loss">You Lost !</div>';
        
            }
            text += '<div id="loadnew">Next Word will load in 3 seconds...';
            document.querySelector("#loadnew").innerHTML = text;
            timeOut = setTimeout(this.loadNewGame.bind(this), 3000);

        }
    },

    
    loadNewGame: function() {
        var a = this;
        for (var i = 0; i < this.letters.length; i++) {
            var list = "#li-" + this.letters[i];
            document.querySelector(list).className = "liActive";
        };
        this.set();
    },

    // Play sounds
    playSound: function(gameAudio) {
        var audio = new Audio(gameAudio);
        audio.play();
    },

    // When player selects letters
    letterClick: function(letter) {
        this.userInput = letter.toUpperCase();
        this.disableLetterBtn();
        this.startGame();
    },

    // Disables letters that user has clicked
    disableLetterBtn: function() {
        var list = "#li-" + this.userInput;
        document.querySelector(list).className = "liDisabled"
        },

    // Add letters
    addLetterButtons: function() {
        var btn = "<ul>";
        for (var i = 0; i < this.letters.length; i++) {
            btn += '<li id="li-' + this.letters[i] + '" class="liActive"';
            btn += 'onclick="game.letterClick(\'' + this.letters[i] + '\')">';
            btn += this.letters[i] + "</li>";
        };
        btn += "</ul>";
        document.querySelector("#letterBtn").innerHTML = btn;
    },

}



