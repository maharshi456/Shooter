import { useEffect, useState } from "react";

const keys = {
  KeyW: "forward",
  KeyA: "left",
  KeyD: "right",
  KeyS: "backward",
  Space: "jump",
};

export const usePersonControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const moveFieldByKey = (key) => keys[key];

  const setMovementStatus = (code, status) => {
    setMovement((val) => ({ ...val, [code]: status }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      setMovementStatus(moveFieldByKey(e.code), true);
    };

    const handleKeyUp = (e) => {
      setMovementStatus(moveFieldByKey(e.code), false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
};
