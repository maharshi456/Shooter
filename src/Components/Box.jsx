import React from "react";
import PropTypes from "prop-types";
import { RigidBody } from "@react-three/rapier";

const Box = (props) => {
  return (
    <RigidBody>
      <mesh position={[0, 3, -5]}>
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
};

Box.propTypes = {};

export default Box;
