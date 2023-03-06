const getColumn = (data: any, header: any) => {
  const column: any = [];
  data.Health = data?.Status?.Health || "NA";
  data.State = data?.Status?.State || "NA";

  //data.forEach((dt: any) => {
  header.forEach((hd: any) => {
    if (data[hd.key]) {
      if (hd.key === "PortType") {
        if (data[hd.key] === "UpstreamPort") {
          column.push(
            <td>
              <div className="drut-port-type">
                <i className="p-icon--chevron-up"></i>{" "}
                <span style={{ float: "right" }}>{"Upstream"}</span>
              </div>
            </td>
          );
        } else {
          column.push(
            <td>
              <div className="drut-port-type">
                <i
                  className="p-icon--chevron-down"
                  style={{ float: "right", marginTop: "4px" }}
                ></i>{" "}
                <span>{"Downstream"}</span>
              </div>
            </td>
          );
        }
      } else if (hd.key === "PCI") {
        column.push(
          <td style={{ width: "300px", minWidth: "300px" }}>
            {data[hd.key].join(", ")}
          </td>
        );
      } else {
        column.push(<td>{data[hd.key]}</td>);
      }
    } else {
      column.push(<td>{"NA"}</td>);
    }
  });
  //});
  return <tr> {column} </tr>;
};

const tableRow = (data: any, header: any) => {
  const row: any = [];
  (data || []).forEach((element: any) => {
    row.push(getColumn(element, header));
  });
  return row;
};

const drutTable: any = (data: any, header: Array<any> = []): any => {
  const tbl: any = [];
  tbl.push(
    <table style={{ border: "1px solid #e2e2e2" }}>
      <thead>
        <tr>
          {header.map((dt: any) => {
            return dt.key !== "PCI" ? (
              <th>{dt.key}</th>
            ) : (
              <th style={{ width: "300px", minWidth: "300px" }}>
                Class / Device / Vender Id
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>{tableRow(data, header)}</tbody>
    </table>
  );
  return tbl;
};

export { drutTable };
