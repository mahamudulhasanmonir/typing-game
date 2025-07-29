import { useState, useEffect, useRef } from 'react';

const wordBank = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`.split(" ");

function getRandomWords(count = 30) {
  return Array.from({ length: count }, () => wordBank[Math.floor(Math.random() * wordBank.length)]);
}

export default function Home() {
  const [words, setWords] = useState(getRandomWords());
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!startTime || gameOver) return;

    timerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const remaining = 60 - diff;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        finishGame();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [startTime, gameOver]);

  const startGame = () => {
    setInput('');
    setWords(getRandomWords());
    setStartTime(Date.now());
    setTimeLeft(60);
    setGameOver(false);
    setWpm(0);
    setAccuracy(0);
  };

  const finishGame = () => {
    const inputWords = input.trim().split(/\s+/);
    const correct = inputWords.filter((word, i) => word === words[i]).length;
    const total = inputWords.length;
    setWpm(Math.round((correct / 60) * 60));
    setAccuracy(total === 0 ? 0 : Math.round((correct / total) * 100));
    setGameOver(true);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Typing Speed Game</h1>

      {!gameOver ? (
        <>
          <div className="max-w-xl text-gray-800 mb-4 text-lg">{words.join(' ')}</div>

          <textarea
            value={input}
            onChange={(e) => {
              if (!startTime) setStartTime(Date.now());
              setInput(e.target.value);
            }}
            disabled={gameOver}
            className="w-full max-w-xl h-32 border rounded p-2 mb-4"
            placeholder="Start typing here..."
          ></textarea>

          <div className="mb-2 text-gray-700">⏱ Time Left: {timeLeft}s</div>

          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {startTime ? 'Restart' : 'Start'}
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg mb-2">🎯 WPM: {wpm}</p>
          <p className="text-lg mb-2">✅ Accuracy: {accuracy}%</p>
          <button
            onClick={startGame}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}
