import { useEffect, useState } from 'react';

const useCanvas = (canvasRef, board, setBoard, currentPlayer, setCurrentPlayer, gameOver, setGameOver, setPlayersScore) => {


    function togglePlayer() {
        currentPlayer === 'X' ? setCurrentPlayer('O') : setCurrentPlayer('X');
    }

    function isBoardFull(board){
        return board.every(element => element !== null);
    }

    function getWinner(board) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            if ((board[a] && board[a] === board[b]) && (board[b] === board[c])) {
                return { mark: board[a], line: [a, b, c] };
            }
        }

        return null;
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const boardSize = canvasWidth;
        const boxSize = boardSize / 3;
        

        if (!gameOver) {
            const ctx = canvas.getContext('2d');


            function getCoordinates(index, boxSize) {
                const xIndex = Math.floor(index % 3);
                const yIndex = Math.floor(index / 3);

                const x = boxSize * xIndex;
                const y = boxSize * yIndex;

                return { x, y };
            }

            function draw() {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                for (let i = 1; i < 3; i++) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 5;
                    ctx.moveTo(boxSize * i, 0);
                    ctx.lineTo(boxSize * i, boxSize * 3);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(0, boxSize * i);
                    ctx.lineTo(boxSize * 3, boxSize * i);
                    ctx.stroke();
                }

                board.forEach((mark, index) => {
                    if (mark) {
                        const { x, y } = getCoordinates(index, boxSize);

                        const markSize = boxSize * 0.80;
                        ctx.font = `${markSize}px Arial`;

                        if (mark === 'X') {
                            ctx.beginPath();

                            ctx.strokeStyle = "red";
                            ctx.moveTo(x + (boxSize - markSize), y + (boxSize - markSize));
                            ctx.lineTo(x + (markSize), y + markSize);

                            ctx.moveTo(x + markSize, y + (boxSize - markSize));
                            ctx.lineTo(x + (boxSize - markSize), y + markSize)
                        }
                        else {
                            ctx.beginPath();
                            ctx.strokeStyle = "blue";
                            ctx.arc(x + (boxSize / 2), y + (boxSize / 2), markSize / 2, 0, 2 * Math.PI)
                        }
                        ctx.lineWidth = 4;
                        ctx.stroke();
                    }
                })

            }

            draw();

            const winner = getWinner(board);
            if (winner) {
                const line = winner.line;

                if (winner.mark === 'X') {
                    setPlayersScore((prevPlayersScore) => {
                        return { ...prevPlayersScore, 'X': parseInt(prevPlayersScore.X) + 1 };
                    });
                }
                else {
                    setPlayersScore((prevPlayersScore) => {
                        return { ...prevPlayersScore, 'O': parseInt(prevPlayersScore.O) + 1 };
                    })
                }

                for (let i = 0; i < 3; i++) {
                    const l = getCoordinates(line[i], boxSize);

                    if (winner.mark === 'X') {
                        ctx.strokeStyle = 'red';
                    }
                    else {
                        ctx.strokeStyle = 'blue';
                    }

                    const winnerLineWidth = 5;
                    ctx.lineWidth = winnerLineWidth;
                    ctx.beginPath();

                    const lineOffset = 3;

                    if (l.y != 0) {
                        ctx.moveTo(l.x, l.y);
                        ctx.lineTo(l.x + boxSize, l.y);
                    }
                    else {
                        ctx.moveTo(l.x, l.y + (winnerLineWidth - lineOffset));
                        ctx.lineTo(l.x + boxSize, l.y + (winnerLineWidth - lineOffset));
                    }
                    if (l.y + boxSize >= canvasHeight) {
                        ctx.moveTo(l.x + boxSize, l.y + (boxSize - lineOffset));
                        ctx.lineTo(l.x, l.y + (boxSize - lineOffset));
                    }
                    else {
                        ctx.moveTo(l.x + boxSize, l.y + boxSize);
                        ctx.lineTo(l.x, l.y + boxSize);
                    }

                    if (l.x + boxSize >= canvasWidth) {
                        ctx.moveTo(l.x + (boxSize - lineOffset), l.y);
                        ctx.lineTo(l.x + (boxSize - lineOffset), l.y + boxSize);
                    }
                    else {
                        ctx.moveTo(l.x + boxSize, l.y);
                        ctx.lineTo(l.x + boxSize, l.y + boxSize);
                    }

                    if (l.x != 0) {
                        ctx.moveTo(l.x, l.y + boxSize);
                        ctx.lineTo(l.x, l.y);
                    }
                    else {
                        ctx.moveTo(l.x + lineOffset, l.y + boxSize);
                        ctx.lineTo(l.x + lineOffset, l.y);
                    }




                    ctx.stroke();
                }


                setGameOver(true);
            }
            if(isBoardFull(board)){
                setGameOver(true);
            }


        }

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            }
        }

        function handleBoxClick(e) {
            if (!gameOver) {

                const mousePos = getMousePos(e);

                const xIndex = Math.floor(mousePos.x / boxSize);
                const yIndex = Math.floor(mousePos.y / boxSize);

                const index = (yIndex * 3) + xIndex;

                if (board[index] === null) {
                    setBoard((prevBoard) => {
                        const newBoard = [...prevBoard];
                        newBoard[index] = currentPlayer;

                        if (!getWinner(newBoard)) {
                            togglePlayer();
                        }

                        return newBoard;
                    });


                }
            }
        }

        canvas.addEventListener('click', handleBoxClick);
        return () => {
            canvas.removeEventListener('click', handleBoxClick);
        }
    }, [canvasRef, currentPlayer, board, gameOver]);
};

export default useCanvas;