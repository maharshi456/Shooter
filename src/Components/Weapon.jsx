import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { useEffect, useRef, useState } from "react";
import { WeaponModel } from "../WeaponModel";
import { useFrame, useLoader } from "@react-three/fiber";
import { usePointerLockControlsStore } from "../App";
import { create } from "zustand";
import FlashShoot from "../assets/images/bullet_flash.png";
import AkShoot from "../assets/sounds/ak-firing.mp3";

const recoilAmount = 0.05;
const recoilDuration = 50;
const easing = TWEEN.Easing.Quadratic.Out;
const SHOOT_BUTTON = parseInt(import.meta.env.VITE_SHOOT_BUTTON);
const AIM_BUTTON = parseInt(import.meta.env.VITE_AIM_BUTTON);

export const useAimingStore = create((set) => ({
  isAiming: null,
  setIsAiming: (value) => set(() => ({ isAiming: value })),
}));

export const Weapon = (props) => {
  const texture = useLoader(THREE.TextureLoader, FlashShoot);
  const weaponRef = useRef();
  const [isShooting, setIsShooting] = useState(false);
  const [recoilAnimation, setRecoilAnimation] = useState(null);
  const [isRecoilAnimationFinished, setIsRecoilAnimationFinished] =
    useState(true);

  // bullet flash
  const [flashAnimation, setFlashAnimation] = useState(null);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const setIsAiming = useAimingStore((state) => state.setIsAiming);

  // fire sound
  const audio = new Audio(AkShoot);

  const generateRecoilOffset = () => {
    return new THREE.Vector3(
      Math.random() * recoilAmount,
      Math.random() * recoilAmount,
      Math.random() * recoilAmount
    );
  };

  const generateNewPositionOfRecoil = (
    currentPosition = new THREE.Vector3(0, 0, 0)
  ) => {
    const recoilOffset = generateRecoilOffset();
    return currentPosition.clone().add(recoilOffset);
  };

  const initRecoilAnimation = () => {
    const currentPosition = new THREE.Vector3(0, 0, 0);
    const newPosition = generateNewPositionOfRecoil(currentPosition);

    const twRecoilAnimation = new TWEEN.Tween(currentPosition)
      .to(newPosition, recoilDuration)
      .easing(easing)
      .repeat(1)
      .yoyo(true)
      .onUpdate(() => {
        weaponRef.current.position.copy(currentPosition);
      })
      .onStart(() => {
        setIsRecoilAnimationFinished(false);
      })
      .onComplete(() => {
        setIsRecoilAnimationFinished(true);
      });

    setRecoilAnimation(twRecoilAnimation);
  };

  const startShooting = () => {
    if (!recoilAnimation) return;

    audio.play();

    recoilAnimation.start();
    flashAnimation.start();
  };

  const initFlashAnimation = () => {
    const currentFlashParams = { opacity: 0 };

    const twFlashAnimation = new TWEEN.Tween(currentFlashParams)
      .to({ opacity: 1 }, recoilDuration)
      .easing(easing)
      .onUpdate(() => {
        setFlashOpacity(() => currentFlashParams.opacity);
      })
      .onComplete(() => {
        setFlashOpacity(() => 0);
      });

    setFlashAnimation(twFlashAnimation);
  };

  useEffect(() => {
    initFlashAnimation();
  }, []);

  useEffect(() => {
    initRecoilAnimation();
  }, []);

  useEffect(() => {
    if (isShooting) {
      startShooting();
    }
  }, [isShooting]);

  useFrame(() => {
    TWEEN.update();

    if (isShooting && isRecoilAnimationFinished) {
      startShooting();
    }
  });

  const mouseButtonHandler = (button, state) => {
    if (!usePointerLockControlsStore.getState().isLock) return;

    switch (button) {
      case SHOOT_BUTTON:
        setIsShooting(state);
        break;
      case AIM_BUTTON:
        setIsAiming(state);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      e.preventDefault();
      mouseButtonHandler(e.button, true);
    });

    document.addEventListener("mouseup", (e) => {
      e.preventDefault();
      mouseButtonHandler(e.button, false);
    });
  }, []);

  return (
    <group {...props}>
      <group ref={weaponRef}>
        <mesh position={[0, 0.05, -2]} scale={[0.5, 0.5, 0]}>
          <planeGeometry attach="geometry" args={[1, 1]} />
          <meshBasicMaterial
            attach="material"
            map={texture}
            transparent={true}
            opacity={flashOpacity}
          />
        </mesh>
        <WeaponModel />
      </group>
    </group>
  );
};
