// import { useEffect } from "react";

import DashboardDatpath from "./DashboardDatapaths";
import DashboardView from "./DashboardView";

interface Props {
  pageid: string;
}
const DashboardMain = ({ pageid }: Props): JSX.Element => {
  // useEffect(() => {}, [pageid]);
  return (
    <>
      {pageid === "sum" ? (
        <DashboardView key={`dv_${Math.random()}`} />
      ) : (
        <DashboardDatpath key={`dp_${Math.random()}`} />
      )}
    </>
  );
};
export default DashboardMain;
