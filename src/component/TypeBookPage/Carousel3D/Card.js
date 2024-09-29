import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

function Card({ book }) {
  const [show, setShown] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
  });
  return (
    <animated.div
      className="bg-white flex flex-col cursor-pointer w-[16rem] pt-0 pr-2 pb-2 pl-2 rounded-xl"
      style={props3}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      <img
        src={book.image}
        className="mt-[-30%] w-100 max-h-[300px] rounded-2xl"
        alt=""
      />
      <h2 className="m-0 mt-1 font-oswald font-bold">{book.name}</h2>
      <p className="m-0 mt-0.5 mb-0.5 line-clamp-4 font-rubik ">
        {book.description}
      </p>
      <div></div>
    </animated.div>
  );
}

export default Card;
