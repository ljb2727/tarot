import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Card.css'; // We will create this

const Card = ({ card, isFlipped, onClick, style }) => {
  const baseUrl = import.meta.env.BASE_URL;
  const cardBackPath = `${baseUrl}cards/card_back.png`;
  
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
            onError={(e) => { e.target.src = cardBackPath; }} // Fallback if image missing
          />
        </div>
        <div className="card-back">
          <img src={cardBackPath} alt="Card Back" />
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
