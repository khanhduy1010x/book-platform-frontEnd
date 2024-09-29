import { config } from "@react-spring/web";
import { useEffect, useState } from "react";
import Carousel from "react-spring-3d-carousel";
export default function CarouselBase(props) {
  const [cards, setCards] = useState([]);
  const [goToSlide, setGoToSlide] = useState(null);
  useEffect(() => {
    const updatedCards = props.cards.map((element, index) => {
      return { ...element, onClick: () => {setGoToSlide(index); props.setCurrentSlide(element.book.id)}};
    });
    setCards(updatedCards);
  }, [props.cards]);

  const [offsetRadius, setOffsetRadius] = useState(2);
  const [showArrows, setShowArrows] = useState(false);
  useEffect(() => {
    setOffsetRadius(props.offset);
    setShowArrows(props.showArrows);
  }, [props.offset, props.showArrows]);
  return (
    <div
      style={{ width: props.width, height: props.height, margin: props.margin }}
    >
      <Carousel
        slides={cards}
        goToSlide={goToSlide}
        offsetRadius={offsetRadius}
        showNavigation={showArrows}
        animationConfig={config.gentle}
 />
    </div>
  );
}
