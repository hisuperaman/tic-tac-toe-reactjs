import { useRef, useState } from 'react';
import useCanvas from '../hooks/useCanvas';

export default function CanvasComponent({board, setBoard, currentPlayer, setCurrentPlayer, gameOver, setGameOver, setPlayersScore}) {
    const canvasRef = useRef(null);

    useCanvas(canvasRef, board, setBoard, currentPlayer, setCurrentPlayer, gameOver, setGameOver, setPlayersScore);

    return <canvas ref={canvasRef} width={600} height={600} style={{width: '300px', height: '300px'}} />;
};