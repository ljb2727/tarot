import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Card.css'; // We will create this

const Card = ({ card, isFlipped, onClick, style }) => {
  return (
    <div className="card-container" onClick={onClick} style={style}>
      <motion.div
        className="card-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, animationDirection: 'normal' }}
      >
        <div className="card-front">
          <img 
            src={card.image} 
            alt={card.name_kr} 
            style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
            onError={(e) => { e.target.src = '/cards/card_back.png'; }} // Fallback if image missing
          />
        </div>
        <div className="card-back">
          <img src="/cards/card_back.png" alt="Card Back" />
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
