const prompt = require('prompt-sync')();  // Library for input from the user

// Constants for slot machine configuration
const ROWS = 3;
const COLS = 3;

// Number of each symbol available in the slot machine
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

// Value of each symbol for calculating winnings
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

// Function to get the deposit amount from the user
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter the amount you want to deposit: ");
        const numberDepositAmount = parseFloat(depositAmount);

        // Check for valid deposit input
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

// Function to get the number of lines the user wants to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        // Check for valid input between 1 and 3
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

// Function to get the bet amount per line from the user
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the amount you want to bet per line: ");
        const numberBet = parseFloat(bet);

        // Check for valid bet that does not exceed available balance
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
};

// Function to spin the slot machine and generate random symbols for each reel
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);  // Remove the selected symbol to avoid duplicates
        }
    }

    return reels;
};

// Function to transpose the reels into rows for easier checking of winning lines
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

// Function to display the slot machine rows to the user
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i !== row.length - 1) {
                rowString += " | ";  // Add separator between symbols
            }
        }
        console.log(rowString);
    }
};

// Function to calculate the user's winnings based on matching symbols
const getWinnings = (rows, bet, numberOfLines) => {
    let winnings = 0;

    for (let row = 0; row < numberOfLines; row++) {
        const symbolsInRow = rows[row];
        let allSame = true;

        // Check if all symbols in the row are the same
        for (const symbol of symbolsInRow) {
            if (symbol !== symbolsInRow[0]) {
                allSame = false;
                break;
            }
        }

        // If all symbols in the row are the same, calculate winnings
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbolsInRow[0]];
        }
    }

    return winnings;
};

// Main game function to manage the game loop
const game = () => {
    let balance = deposit();

    while (true) {
        console.log(`Current balance is: $${balance}`);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;  // Deduct total bet from balance

        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);  // Display the slot machine result

        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log(`You won: $${winnings}`);

        // Check if the user has run out of money
        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        // Ask if the user wants to play again
        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain !== "y") {
            console.log("Thanks for playing!");
            break;
        }
    }
};

// Start the game
game();
