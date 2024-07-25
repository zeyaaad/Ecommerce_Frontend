import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index) => setHoveredRating(index);
  const handleMouseLeave = () => setHoveredRating(0);
  const handleClick = (index) => onRatingChange(index);

  const renderStar = (index) => {
    const isFilled = index <= (hoveredRating || rating);
    return (
      <span
        key={index}
        className={`star ${isFilled ? 'filled' : ''}`}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(index)}
      >
        ★
      </span>
    );
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
};

export default StarRating;
