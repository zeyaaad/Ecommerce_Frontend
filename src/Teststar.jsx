import React, { useState } from 'react';
import StarRating from './StarRating'; // Import the StarRating component

const Teststar = () => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div>
      <h1>Rate this Product</h1>
      <StarRating rating={rating} onRatingChange={handleRatingChange} />
      <p>Your rating: {rating}</p>
    </div>
  );
};

export default Teststar;
