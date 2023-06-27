import React from "react";

import type { NodeDataPathType } from "./NodeDataPathType";

const NodeDataPathContext = React.createContext<NodeDataPathType>(
  {} as NodeDataPathType
);

export default NodeDataPathContext;
