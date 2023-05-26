import DoughnutChart from "app/base/components/DoughnutChart";
export type Props = {
  data: any;
  box: any;
  colorCode: any;
};
const DSPieChart = ({ data, box, colorCode }: Props): JSX.Element => {
  const getSegment = (dt: any) => {
    const segments: Array<any> = [];
    const labels: Array<any> = [];
    const ct = dt.counters;
    Object.keys(ct).forEach((key: any, index: any) => {
      segments.push({
        color: colorCode[key].color,
        tooltip: `${key} (${ct[key]})`,
        value: ct[key],
      });
      labels.push(
        <tr key={"" + index + Math.random()}>
          <td>{key}</td>
          <td className="u-align--right">
            {ct[key]}
            <span className="u-nudge-right--small">
              <i className={`p-circle--${colorCode[key].link}`}></i>
            </span>
          </td>
        </tr>
      );
    });
    return [segments, labels];
  };

  return (
    <div className={`overall-dashboard-card__${box}`}>
      <div className="overall-ram">
        <div className="overall-ram__chart-container">
          <h4 className="p-heading--small">{data.title}</h4>
          <DoughnutChart
            className="overall-ram__chart"
            label={data.total}
            segmentHoverWidth={24}
            segmentWidth={18}
            segments={getSegment(data)[0]}
            size={120}
          />
        </div>
        <table className="overall-ram__table" style={{ border: "0px" }}>
          <thead>
            <tr key={`${Math.random()}`}>
              <th colSpan={2} className="u-align--right u-text--light">
                <span className="u-nudge-left">
                  <b>{data.total}</b> {data.totalTitle || "Blocks"}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>{getSegment(data)[1]}</tbody>
        </table>
      </div>
    </div>
  );
};

export default DSPieChart;
