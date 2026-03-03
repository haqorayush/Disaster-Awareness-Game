import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import floodAnimation from './assets/flood.json'; // Lottie file

const Question = ({ scenario, options, handleAnswer }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-card shadow-2xl rounded-xl p-6 max-w-lg mx-auto"
    >
      <div className="w-48 h-48 mx-auto mb-4">
        <Lottie animationData={floodAnimation} loop={true} />
      </div>
      
      <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-6">
        {scenario.text}
      </h2>

      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(option)}
            className="p-4 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border-2 border-blue-200"
          >
            {option.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
