function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    };

    const getboard = () => board;

    const placeToken = (rows, columns, player) => {
        if (board[rows][columns].getValue() !== 0) return;
        board[rows][columns].addToken(player);
    }

    const printBoard = () => {
        const cellwithValue = board.map(rows => rows.map(cell => cell.getValue()));
        console.log(cellwithValue);
    }

    return { getboard, placeToken, printBoard }
}

const cell = () => {
    let value = 0;
    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

const gameController = (playerOnename = 'Player one', playerTwoname = 'Player two') => {
    const board = Gameboard()
    const players = [
        {
            name: playerOnename,
            token: 'x'
        },
        {
            name: playerTwoname,
            token: 'o'
        }
    ]
    let activePlayer = players[0];


    const switchPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePayer().name}'s turn`);
    }

    const checkwinner = () => {
        const b = board.getboard();
        const checkLines = (a, b, c) => { return a.getValue() === b.getValue() && a.getValue() === c.getValue() && a.getValue() !== 0; }
        for (let i = 0; i < 3; i++) {
            if (checkLines(b[i][0], b[i][1], b[i][2])) return true;
            if (checkLines(b[0][i], b[1][i], b[2][i])) return true;
        }

        if (checkLines(b[0][0], b[1][1], b[2][2])) return true;
        if (checkLines(b[0][2], b[1][1], b[2][0])) return true;

        return false;
    }


    const playround = (rows, columns) => {
        console.log(`${getActivePayer().name} placing ${getActivePayer().token} in the column ${columns} and row ${rows}`);
        board.placeToken(rows, columns, getActivePayer().token);

        if (checkwinner()) {
            console.log(`${activePlayer.name} wins's`)
            return true;
        }



        switchPlayers()
        printNewRound()
    }


    printNewRound();

    return { playround, getActivePayer, getBoard: board.getboard, checkwinner }
}


const ScreenController = () => {
    const game = gameController();
    const playerTurns = document.getElementById('turns');
    const Boarddiv = document.getElementById('board');
    const winner = game.checkwinner();
    const container = document.getElementById('container')

    const updateScreen = (winner = false) => {
        Boarddiv.textContent = '';

        const board = game.getBoard();
        const currentPlayer = game.getActivePayer();
        playerTurns.textContent = `${currentPlayer.name} Turn`

        board.forEach((rows, rowIndex) => {
            rows.forEach((cell, colIndex) => {
                const cellbutton = document.createElement('button')
                cellbutton.classList.add('cell')
                cellbutton.dataset.columns = colIndex
                cellbutton.dataset.rows = rowIndex
                cellbutton.textContent = cell.getValue();
                Boarddiv.appendChild(cellbutton)
            })
        });

        if (winner) {
            const winnerDeclaration = document.createElement('p')
            winnerDeclaration.classList.add('winnerDeclaration')
            winnerDeclaration.textContent = `${currentPlayer.name} win's`
            container.appendChild(winnerDeclaration);
            return;
        }
    }

    function ClickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.columns;
        if (!selectedColumn) return;
        const selectedRow = e.target.dataset.rows;
        if (!selectedRow) return;

        const winner = game.playround(parseInt(selectedRow), parseInt(selectedColumn));
        updateScreen(winner);
    }

    Boarddiv.addEventListener('click', ClickHandlerBoard);
    updateScreen();


}

ScreenController()



