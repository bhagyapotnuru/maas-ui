import { getTypeTitle } from "./../../types";

import Meter from "app/base/components/Meter";

export type Props = {
  data: any;
  box: any;
  colorCode: any;
};
const DSMeterChart = ({ data, box, colorCode }: Props): JSX.Element => {
  const getSegment = (dt: any) => {
    const segments: Array<any> = [];
    const labels: Array<any> = [];
    const ct = dt.counters;
    Object.keys(ct).forEach((key: any) => {
      segments.push({
        color: colorCode[key].color,
        value: ct[key],
      });
      labels.push(
        <div className="u-align--right" key={key}>
          <p className="p-heading--small u-text--light">
            {key}
            <span className="u-nudge-right--small">
              <i
                className={`p-circle--${colorCode[key].link} u-no-margin--top`}
              ></i>
            </span>
          </p>
          <div className="u-nudge-left">{ct[key]}</div>
        </div>
      );
    });
    return [segments, labels];
  };

  return (
    <div className={`overall-dashboard-card__${box}`}>
      <div className="overall-cores">
        <h4 className="p-heading--small u-sv1">{`${data.total} ${
          getTypeTitle(data.title).title
        }`}</h4>
        <div className="overall-box2__meter">
          {getSegment(data)[1]}
          <div style={{ gridArea: "meter" }}>
            <Meter
              data={getSegment(data)[0]}
              max={data.total}
              segmented={
                false /*data.title.toLowerCase() === "storage" ? true : false*/
              }
              small
            />
          </div>
        </div>
        <div className="u-align--right">
          {/*
          <h4 className="p-heading--small u-no-max-width u-text--muted">
            Total {data?.data?.unit}
          </h4>
          */}
          <div>
            Total <b>{data?.data?.Composed}</b> of {data?.data?.total}{" "}
            {data?.data?.unit} Composed
            {data?.data1 && data?.data1 !== null ? (
              <>
                <br />
                Total Memory <b>{data?.data1?.Composed}</b> of{" "}
                {data?.data1?.total} {data?.data1?.unit} Composed
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSMeterChart;
