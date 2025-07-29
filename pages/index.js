'use client';
import { useState, useEffect, useRef } from 'react';

const wordBank = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`.split(" ");

function getRandomWords(count = 30) {
  return Array.from({ length: count }, () => wordBank[Math.floor(Math.random() * wordBank.length)]);
}

export default function TypingGame() {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    setWords(getRandomWords());
  }, []);

  useEffect(() => {
    if (!startTime || gameOver || !isClient) return;

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
  }, [startTime, gameOver, isClient]);

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
    const inputWords = input.trim().split(/\s+/).filter(Boolean);
    const correct = inputWords.filter((word, i) => word === words[i]).length;
    const total = inputWords.length;
    setWpm(Math.round((correct / 5)));
    setAccuracy(total === 0 ? 0 : Math.round((correct / total) * 100));
    setGameOver(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">⚡ Typing Speed Test</h1>

        {!gameOver ? (
          <>
            <div className="text-gray-800 bg-blue-50 border rounded-lg p-4 mb-4 text-lg leading-relaxed">
              {isClient ? words.join(' ') : 'Loading...'}
            </div>

            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start typing here..."
              value={input}
              onChange={(e) => {
                if (!startTime && isClient) setStartTime(Date.now());
                setInput(e.target.value);
              }}
              disabled={!isClient || gameOver}
            />

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700 text-lg">⏳ Time Left: <strong>{timeLeft}s</strong></span>
              <button
                onClick={startGame}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                disabled={!isClient}
              >
                {startTime ? '🔁 Restart' : '▶ Start'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="bg-blue-100 p-6 rounded-2xl shadow-inner mb-4">
              <p className="text-xl text-blue-800 font-semibold mb-2">🎯 WPM: <span className="font-bold">{wpm}</span></p>
              <p className="text-xl text-green-800 font-semibold">✅ Accuracy: <span className="font-bold">{accuracy}%</span></p>
            </div>
            <button
              onClick={startGame}
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
            >
              🔁 Play Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
