import React from 'react';
import { useMediaQuery } from 'react-responsive';
import StarRatings from 'react-star-ratings';

interface StarRatingProps {
  value: number;
  id: string | number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, id }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <StarRatings
      rating={value}
      starRatedColor="gold"
      numberOfStars={5}
      starDimension={isMobile ? "13px" : "20px"}
      starSpacing="2px"
      name={`signal-${id}`}
    />
  );
}

export default StarRating;
