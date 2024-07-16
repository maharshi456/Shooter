import CubeLoc from "./cubes.json";
import { RigidBody } from "@react-three/rapier";

export const Cubes = () => {
  return CubeLoc.map((coords, index) => <Cube key={index} position={coords} />);
};

const Cube = (props) => {
  return (
    <RigidBody {...props}>
      <mesh castShadow receiveShadow>
        <meshStandardMaterial color="white" />
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
};

export default Cubes;
