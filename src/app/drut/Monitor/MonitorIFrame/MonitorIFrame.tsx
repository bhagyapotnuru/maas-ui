import React from "react";

type Props = {
  src?: string;
  style?: any;
};

const IFrame = (props: Props): JSX.Element => {
  return (
    <React.Fragment>
      <iframe src={props.src} style={props.style} />
    </React.Fragment>
  );
};
export default IFrame;
