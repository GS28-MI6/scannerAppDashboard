import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fas, fab, far);

const Like = (props) => {
  return (
    <FontAwesomeIcon
      className="clickeable"
      onClick={props.onClick}
      icon={[props.liked ? "fas" : "far", "heart"]}
      size="1x"
    />
  );
};

export default Like;