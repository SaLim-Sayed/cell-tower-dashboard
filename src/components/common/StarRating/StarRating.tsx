import React from 'react';
import StarRatings from 'react-star-ratings';

interface StarRatingProps {
  value: number;
  id: string | number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, id }) => (
  <StarRatings
    rating={value}
    starRatedColor="gold"
    numberOfStars={5}
    starDimension="20px"
    starSpacing="2px"
    name={`signal-${id}`}
  />
);

export default StarRating;
