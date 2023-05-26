import React from "react";

import type { ReConfigType } from "./ResourceBlockReConfigType";

const ResoruceBlockReConfigContext = React.createContext<ReConfigType>(
  {} as ReConfigType
);

export default ResoruceBlockReConfigContext;
