import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Confetti from 'react-confetti';
import './App.css';

// --- ANIMATED BACKGROUND COMPONENT ---
const FloatingBackground = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '4rem', opacity: 0.6 }}>☁️</motion.div>
      <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} style={{ position: 'absolute', top: '20%', right: '15%', fontSize: '5rem', opacity: 0.6 }}>☁️</motion.div>
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: '3rem', opacity: 0.7 }}>💧</motion.div>
      <motion.div animate={{ y: [0, -25, 0], rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '25%', right: '20%', fontSize: '4rem', opacity: 0.8 }}>🛟</motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} style={{ position: 'absolute', top: '40%', left: '5%', fontSize: '2.5rem', opacity: 0.5 }}>🌧️</motion.div>
    </div>
  );
};

// --- INTERACTIVE LOADING SCREEN COMPONENT ---
const LoadingOverlay = ({ text }) => {
  const tips = [
    "Did you know? Water is heavy! Never walk through moving floodwater. 🌊",
    "Always keep a flashlight in your emergency kit! 🔦",
    "Higher ground is your best friend during a flood! ⛰️",
    "Never eat food that has touched floodwater! 🛑",
    "Keep emergency numbers written down on paper! 📝"
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        style={{ fontSize: '6rem', marginBottom: '20px' }}
      >
        🛟
      </motion.div>
      <motion.h2
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ color: '#FF6B6B', fontSize: '2.5rem', margin: 0, textAlign: 'center', textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}
      >
        {text}
      </motion.h2>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ background: '#4ECDC4', color: 'white', padding: '15px 25px', borderRadius: '15px', marginTop: '30px', maxWidth: '400px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(78, 205, 196, 0.3)' }}
      >
        {randomTip}
      </motion.div>
    </motion.div>
  );
};

const App = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingText, setLoadingText] = useState(""); 
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('highScore')) || 0);

  const [answered, setAnswered] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playAudioAndWait = (audioFile, callback) => {
    const audio = new Audio(`/${audioFile}`);
    audio.play()
      .then(() => { audio.onended = () => { if (callback) callback(); }; })
      .catch((err) => {
        console.error(`Skipping audio (${audioFile}):`, err);
        if (callback) callback(); 
      });
  };

  const handleStartApp = () => {
    setLoadingText("Starting the Rescue Mission! 🚁");
    setIsTransitioning(true);
    playAudioAndWait('intro 1.mp3', () => {
      setHasStarted(true);
      setIsTransitioning(false);
    });
  };

  const handleDifficultyChange = (newDifficulty) => {
    setLoadingText("Preparing Your Gear! 🎒");
    setIsTransitioning(true);
    playAudioAndWait('intro 2.mp3', () => {
      setDifficulty(newDifficulty);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setAnswered(false);
      setFeedbackMessage('');
      setIsTransitioning(false);
    });
  };

  const handleAnswerOptionClick = (isCorrect, index) => {
    if (isTransitioning || answered) return;

    setAnswered(true);
    setSelectedOptionIndex(index);

    const currentQData = questions[difficulty][currentQuestion];
    const correctIdx = currentQData.answerOptions.findIndex(opt => opt.isCorrect);
    setCorrectAnswerIndex(correctIdx);

    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    const audioFile = isCorrect ? 'correct.mp3' : 'incorrect.mp3';
    
    // Slight delay so the kid can see the button turn green/red BEFORE the loading screen covers it
    setTimeout(() => {
      setLoadingText(isCorrect ? "Awesome! Loading next... 🌟" : "Let's keep learning! 🔄");
      setIsTransitioning(true);
      
      playAudioAndWait(audioFile, () => {
        setFeedbackMessage('');
        setAnswered(false);
        setSelectedOptionIndex(null);
        setCorrectAnswerIndex(null);
        setIsTransitioning(false);

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions[difficulty].length) {
          setCurrentQuestion(nextQuestion);
        } else {
          setShowScore(true);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('highScore', newScore.toString());
          }
        }
      });
    }, 800); 
  };

  const restartQuiz = () => {
    setDifficulty(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const questions = {
    easy: [
      {
        questionText: 'Which of the following is a major flood-prone area in Uttar Pradesh?',
        answerOptions: [
          { answerText: 'Lucknow', isCorrect: false },
          { answerText: 'Gorakhpur', isCorrect: true },
          { answerText: 'Agra', isCorrect: false },
          { answerText: 'Kanpur', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the first step you should take during a flood?',
        answerOptions: [
          { answerText: 'Stay in low-lying areas', isCorrect: false },
          { answerText: 'Move to higher ground', isCorrect: true },
          { answerText: 'Wait for instructions', isCorrect: false },
          { answerText: 'Ignore the situation', isCorrect: false },
        ],
      },
      {
        questionText: 'Which emergency number should you call for disaster relief in India?',
        answerOptions: [
          { answerText: '100', isCorrect: false },
          { answerText: '101', isCorrect: false },
          { answerText: '108', isCorrect: false },
          { answerText: '1070 / 1077', isCorrect: true },
        ],
      },
      {
        questionText: 'What should you do if you are caught in an earthquake?',
        answerOptions: [
          { answerText: 'Run outside immediately', isCorrect: false },
          { answerText: 'Use the elevator', isCorrect: false },
          { answerText: 'Drop, Cover, and Hold on', isCorrect: true },
          { answerText: 'Stand under a tree', isCorrect: false },
        ],
      },
      {
        questionText: 'Which of these is NOT suitable for a Disaster Emergency Kit?',
        answerOptions: [
          { answerText: 'Bottled water', isCorrect: false },
          { answerText: 'Flashlight', isCorrect: false },
          { answerText: 'Perishable cooked food', isCorrect: true },
          { answerText: 'First aid kit', isCorrect: false },
        ],
      },
      {
        questionText: 'During a lightning storm, where is the safest place to be?',
        answerOptions: [
          { answerText: 'Under a tall tree', isCorrect: false },
          { answerText: 'Inside a sturdy building', isCorrect: true },
          { answerText: 'In an open field', isCorrect: false },
          { answerText: 'In a swimming pool', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the primary cause of floods in Eastern Uttar Pradesh (Purvanchal)?',
        answerOptions: [
          { answerText: 'Melting Glaciers', isCorrect: false },
          { answerText: 'Heavy Monsoon Rainfall', isCorrect: true },
          { answerText: 'Tsunamis', isCorrect: false },
          { answerText: 'Cloudbursts only', isCorrect: false },
        ],
      },
      {
        questionText: 'What should you do with electrical appliances during a flood?',
        answerOptions: [
          { answerText: 'Leave them on', isCorrect: false },
          { answerText: 'Turn them off and unplug them', isCorrect: true },
          { answerText: 'Move them to the basement', isCorrect: false },
          { answerText: 'Wash them with flood water', isCorrect: false },
        ],
      },
      {
        questionText: 'What color code is used by the IMD to signal "Take Action" for disasters?',
        answerOptions: [
          { answerText: 'Yellow', isCorrect: false },
          { answerText: 'Green', isCorrect: false },
          { answerText: 'Red', isCorrect: true },
          { answerText: 'Blue', isCorrect: false },
        ],
      },
      {
        questionText: 'If you are driving and a flood starts, what should you do?',
        answerOptions: [
          { answerText: 'Drive faster through the water', isCorrect: false },
          { answerText: 'Stay in the car if water is rising', isCorrect: false },
          { answerText: 'Turn around, don’t drown', isCorrect: true },
          { answerText: 'Park under a bridge', isCorrect: false },
        ],
      }
    ],
    medium: [
      {
        questionText: 'What percentage of Uttar Pradesh is considered flood-prone?',
        answerOptions: [
          { answerText: '10%', isCorrect: false },
          { answerText: '27%', isCorrect: true },
          { answerText: '50%', isCorrect: false },
          { answerText: '75%', isCorrect: false },
        ],
      },
      {
        questionText: 'Which river is known as the "Sorrow of Gorakhpur" due to frequent flooding?',
        answerOptions: [
          { answerText: 'Ganga', isCorrect: false },
          { answerText: 'Yamuna', isCorrect: false },
          { answerText: 'Rapti', isCorrect: true },
          { answerText: 'Gomti', isCorrect: false },
        ],
      },
      {
        questionText: 'In the context of UP, what is "Loo"?',
        answerOptions: [
          { answerText: 'A type of flood', isCorrect: false },
          { answerText: 'A cold wave', isCorrect: false },
          { answerText: 'A hot, dry summer wind', isCorrect: true },
          { answerText: 'A traditional dance', isCorrect: false },
        ],
      },
      {
        questionText: 'Which district of UP falls under Seismic Zone IV (High Risk Zone)?',
        answerOptions: [
          { answerText: 'Jhansi', isCorrect: false },
          { answerText: 'Meerut', isCorrect: true },
          { answerText: 'Prayagraj', isCorrect: false },
          { answerText: 'Varanasi', isCorrect: false },
        ],
      },
      {
        questionText: 'What does the acronym SDMA stand for?',
        answerOptions: [
          { answerText: 'State District Management Authority', isCorrect: false },
          { answerText: 'State Disaster Management Authority', isCorrect: true },
          { answerText: 'Systematic Disaster Mitigation Agency', isCorrect: false },
          { answerText: 'Social Disaster Management Association', isCorrect: false },
        ],
      },
      {
        questionText: 'How much water should be stored per person per day in an emergency kit?',
        answerOptions: [
          { answerText: '1 Liter', isCorrect: false },
          { answerText: '4 Liters (approx 1 gallon)', isCorrect: true },
          { answerText: '10 Liters', isCorrect: false },
          { answerText: '500ml', isCorrect: false },
        ],
      },
      {
        questionText: 'Which part of Uttar Pradesh is most susceptible to Drought?',
        answerOptions: [
          { answerText: 'Terai region', isCorrect: false },
          { answerText: 'Bundelkhand', isCorrect: true },
          { answerText: 'Western UP', isCorrect: false },
          { answerText: 'Eastern UP', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the primary purpose of a "Mock Drill"?',
        answerOptions: [
          { answerText: 'To scare people', isCorrect: false },
          { answerText: 'To practice safety procedures', isCorrect: true },
          { answerText: 'To distribute food', isCorrect: false },
          { answerText: 'To celebrate a holiday', isCorrect: false },
        ],
      },
      {
        questionText: 'Which chemical is commonly used to purify water during floods?',
        answerOptions: [
          { answerText: 'Salt', isCorrect: false },
          { answerText: 'Chlorine tablets', isCorrect: true },
          { answerText: 'Sugar', isCorrect: false },
          { answerText: 'Vinegar', isCorrect: false },
        ],
      },
      {
        questionText: 'During a heatwave, when is it most important to stay indoors?',
        answerOptions: [
          { answerText: '6 AM to 9 AM', isCorrect: false },
          { answerText: '8 PM to 11 PM', isCorrect: false },
          { answerText: '12 PM to 4 PM', isCorrect: true },
          { answerText: 'After midnight', isCorrect: false },
        ],
      }
    ],
    hard: [
      {
        questionText: 'In which year did Uttar Pradesh experience a massive flood affecting over 20 districts?',
        answerOptions: [
          { answerText: '2008', isCorrect: true },
          { answerText: '2010', isCorrect: false },
          { answerText: '2005', isCorrect: false },
          { answerText: '2015', isCorrect: false },
        ],
      },
      {
        questionText: 'Who is the ex-officio Chairperson of the State Disaster Management Authority in UP?',
        answerOptions: [
          { answerText: 'The Governor', isCorrect: false },
          { answerText: 'The Chief Minister', isCorrect: true },
          { answerText: 'The Relief Commissioner', isCorrect: false },
          { answerText: 'The Home Minister', isCorrect: false },
        ],
      },
      {
        questionText: 'Which river system is primarily responsible for the "Tals" (depressions) in the Gandak basin?',
        answerOptions: [
          { answerText: 'Ganga', isCorrect: false },
          { answerText: 'Ghaghra', isCorrect: true },
          { answerText: 'Son', isCorrect: false },
          { answerText: 'Betwa', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the specific role of the NDRF?',
        answerOptions: [
          { answerText: 'Tax Collection', isCorrect: false },
          { answerText: 'Specialized response to disasters', isCorrect: true },
          { answerText: 'Road Construction', isCorrect: false },
          { answerText: 'Forest Conservation', isCorrect: false },
        ],
      },
      {
        questionText: 'Which structural measure is commonly used in UP to prevent river bank erosion?',
        answerOptions: [
          { answerText: 'Check Dams', isCorrect: false },
          { answerText: 'Geo-synthetic bags/textiles', isCorrect: true },
          { answerText: 'Windbreaks', isCorrect: false },
          { answerText: 'Terrace farming', isCorrect: false },
        ],
      },
      {
        questionText: 'According to the UP State Disaster Management Plan, which department is the nodal agency for Cold Waves?',
        answerOptions: [
          { answerText: 'Department of Agriculture', isCorrect: false },
          { answerText: 'Department of Revenue', isCorrect: true },
          { answerText: 'Department of Health', isCorrect: false },
          { answerText: 'Department of Irrigation', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the "Return Period" in flood frequency analysis?',
        answerOptions: [
          { answerText: 'The time it takes for water to recede', isCorrect: false },
          { answerText: 'Estimated time between flood events of a certain size', isCorrect: true },
          { answerText: 'The duration of the monsoon', isCorrect: false },
          { answerText: 'The time taken to rebuild houses', isCorrect: false },
        ],
      },
      {
        questionText: 'Which act provides the legal framework for disaster management in India?',
        answerOptions: [
          { answerText: 'Disaster Act 2000', isCorrect: false },
          { answerText: 'Disaster Management Act 2005', isCorrect: true },
          { answerText: 'Emergency Act 2010', isCorrect: false },
          { answerText: 'Safety Act 1999', isCorrect: false },
        ],
      },
      {
        questionText: 'The "Early Warning System" for floods in UP relies heavily on data from which organization?',
        answerOptions: [
          { answerText: 'Central Water Commission (CWC)', isCorrect: true },
          { answerText: 'Archaeological Survey of India', isCorrect: false },
          { answerText: 'Census of India', isCorrect: false },
          { answerText: 'NABARD', isCorrect: false },
        ],
      },
      {
        questionText: 'What is the main objective of the "Aapda Mitra" scheme?',
        answerOptions: [
          { answerText: 'Providing loans to farmers', isCorrect: false },
          { answerText: 'Training community volunteers for disaster response', isCorrect: true },
          { answerText: 'Building new hospitals', isCorrect: false },
          { answerText: 'Tree plantation drives', isCorrect: false },
        ],
      }
    ],
  };

  const currentQuestionData = difficulty ? questions[difficulty][currentQuestion] : null;

  const actionButtonStyle = {
    padding: '15px 40px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    background: '#FF6B6B',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(255, 107, 107, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      
      {/* Backgrounds and Overlays */}
      <FloatingBackground />
      <AnimatePresence>
        {isTransitioning && <LoadingOverlay text={loadingText} />}
      </AnimatePresence>

      {showScore && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <motion.h1 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        style={{ marginBottom: '30px', color: '#fff', fontSize: '3rem', textShadow: '3px 3px 0px rgba(0,0,0,0.1)', textAlign: 'center' }}
      >
        Disaster Awareness Quiz
      </motion.h1>

      {!hasStarted ? (
        <motion.div className="start-screen" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <h2 style={{ color: '#4ECDC4', fontSize: '2.5rem', marginBottom: '10px' }}>Welcome!</h2>
          <p style={{ color: '#555', fontSize: '1.2rem', marginBottom: '30px' }}>Turn on your sound to play!</p>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleStartApp} style={actionButtonStyle}
          >
            Start Game! 🚀
          </motion.button>
        </motion.div>
      ) : difficulty === null ? (
        <motion.div className="difficulty-selection" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <h2 style={{ color: '#4ECDC4', fontSize: '2rem', marginBottom: '30px' }}>Pick Your Level!</h2>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* The typo that caused the crash was fixed right here! */}
            <motion.button whileHover={{ scale: 1.1, rotate: -3 }} whileTap={{ scale: 0.9 }} onClick={() => handleDifficultyChange('easy')} style={{...actionButtonStyle, background: '#4ECDC4', boxShadow: '0 8px 15px rgba(78, 205, 196, 0.4)'}}>Easy 😊</motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.9 }} onClick={() => handleDifficultyChange('medium')} style={{...actionButtonStyle, background: '#FFA07A', boxShadow: '0 8px 15px rgba(255, 160, 122, 0.4)'}}>Medium 🧐</motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: -3 }} whileTap={{ scale: 0.9 }} onClick={() => handleDifficultyChange('hard')} style={{...actionButtonStyle, background: '#FF6B6B', boxShadow: '0 8px 15px rgba(255, 107, 107, 0.4)'}}>Hard 🧠</motion.button>
          </div>
        </motion.div>
      ) : showScore ? (
        <motion.div className="score-section" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', background: 'white', padding: '50px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 10 }}>
          <h2 style={{ color: '#4ECDC4', fontSize: '3rem', margin: '0' }}>You did it! 🏆</h2>
          <h3 style={{ fontSize: '2rem', color: '#555', margin: '20px 0' }}>Score: <span style={{ color: '#FF6B6B', fontSize: '3rem' }}>{score}</span> / {questions[difficulty].length}</h3>
          <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '30px' }}>High Score: {highScore}</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={restartQuiz} style={{...actionButtonStyle, background: '#4ECDC4'}}>Play Again! 🔄</motion.button>
        </motion.div>
      ) : currentQuestionData ? (
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.8, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ width: '100%', maxWidth: '750px', background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', zIndex: 10 }}
          >
            <div style={{ background: '#f0f4f8', padding: '10px 20px', borderRadius: '50px', display: 'inline-block', color: '#888', fontWeight: 'bold', marginBottom: '20px' }}>
              Question {currentQuestion + 1} of {questions[difficulty].length}
            </div>
            
            <div style={{ fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '30px', color: '#2C3E50', lineHeight: '1.4' }}>
              {currentQuestionData.questionText}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentQuestionData.answerOptions.map((option, index) => {
                let btnStyle = { 
                  padding: '20px', borderRadius: '20px', cursor: 'pointer', border: '3px solid #E2E8F0', 
                  background: '#F8FAFC', color: '#334155', fontSize: '18px', fontWeight: '600',
                  textAlign: 'left', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden'
                };
                
                if (answered) {
                  if (index === correctAnswerIndex) {
                    btnStyle.background = '#D1FAE5'; btnStyle.borderColor = '#34D399'; btnStyle.color = '#065F46';
                  } else if (index === selectedOptionIndex) {
                    btnStyle.background = '#FEE2E2'; btnStyle.borderColor = '#F87171'; btnStyle.color = '#991B1B';
                  } else {
                    btnStyle.opacity = '0.4';
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!answered ? { scale: 1.02, borderColor: '#4ECDC4', backgroundColor: '#F0FDFA' } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswerOptionClick(option.isCorrect, index)}
                    disabled={answered}
                    style={btnStyle}
                  >
                    {option.answerText}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : null}
      
      <SpeedInsights />
    </div>
  );
};

export default App;