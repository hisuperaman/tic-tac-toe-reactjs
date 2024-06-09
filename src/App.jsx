import './App.css'
import CanvasComponent from './components/CanvasComponent'
import { useEffect, useState } from 'react';

function PlayerComponent({ text, isActive, player, score }) {
  
  const [isScoreAdded, setIsScoreAdded] = useState(false);

  useEffect(()=>{
    if(score!==0){
      setIsScoreAdded(true);
      setTimeout(()=>{
        setIsScoreAdded(false);
      }, 2000);
    }
  }, [score]);

  return (
    <div className='text-lg'>
      <div className={`${isActive ? (player === '1' ? 'text-red-400' : 'text-blue-400') : ''}`}>
        {text} - {player==='1'?'X':'O'}
      </div>
      <div className={`text-center h-4 flex justify-center`}>
        <div className='inline'>
        {score}
        </div>

        <div className={`ml-4 inline ${isScoreAdded?'text-green-400':'hidden'}`}>
          +1
        </div>

      </div>
    </div>
  )
}

function Button({ text, onClick }) {
  return (
    <div className='border p-4 bg-blue-600 hover:bg-blue-400 text-white cursor-pointer w-28 text-center' onClick={onClick}>
      {text}
    </div>
  )
}

function App() {

  const [board, setBoard] = useState(Array(9).fill(null));

  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);

  const [playersScore, setPlayersScore] = useState({ 'X': 0, 'O': 0 });

  function handleRestartClick() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
    setPlayersScore({ X: 0, O: 0 });
  }

  function handlePlayAgainClick() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
  }

  return (
    <div className='border-4 flex flex-col h-screen'>
      <div className='mx-auto'>

        <div className='flex justify-between pb-8'>
          <PlayerComponent text={'Player 1'} isActive={currentPlayer === 'X' ? true : false} player={'1'} score={playersScore.X} />
          <PlayerComponent text={'Player 2'} isActive={currentPlayer === 'O' ? true : false} player={'2'} score={playersScore.O} />
        </div>

        <CanvasComponent board={board} setBoard={setBoard} currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} gameOver={gameOver} setGameOver={setGameOver} setPlayersScore={setPlayersScore} />

        <div className='flex flex-col items-center py-4 mt-8'>
          {gameOver && (
            <Button text={'Play Again'} onClick={handlePlayAgainClick} />
          )}
          <Button text={'Restart'} onClick={handleRestartClick} />
        </div>

      </div>
    </div>
  )
}

export default App
