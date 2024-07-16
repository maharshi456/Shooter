import * as TWEEN from "@tweenjs/tween.js";
import { PointerLockControls, Sky } from "@react-three/drei";
import Ground from "./Components/Ground";
import { Physics } from "@react-three/rapier";
import Player from "./Components/Player";
import Cubes from "./Cube";
import { useFrame } from "@react-three/fiber";
import { create } from "zustand";

const shadowOffSet = 50;

export const usePointerLockControlsStore = create(() => ({
  isLock: false,
}));

function App() {
  useFrame(() => {
    TWEEN.update();
  });

  const PointerLockControlsLockHandler = () => {
    usePointerLockControlsStore.setState({ isLock: true });
  };

  const PointerLockControlsUnLockHandler = () => {
    usePointerLockControlsStore.setState({ isLock: false });
  };

  return (
    <>
      <PointerLockControls
        onLock={PointerLockControlsLockHandler}
        unlock={PointerLockControlsUnLockHandler}
      />
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={3} />
      <directionalLight
        castShadow
        intensity={3}
        shadow-camera-top={shadowOffSet}
        shadow-camera-bottom={-shadowOffSet}
        shadow-camera-left={shadowOffSet}
        shadow-camera-right={-shadowOffSet}
        position={[100, 100, 0]}
      />
      <Physics gravity={[0, -10, 0]}>
        <Ground />
        <Player />
        <Cubes />
      </Physics>
    </>
  );
}

export default App;
