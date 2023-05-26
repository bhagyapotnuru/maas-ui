import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

type Props = {
  datapathOrders: any;
};

const DataPathOrderDetailsTable = (props: Props): JSX.Element => {
  const dataPathOrderTableColumns = [
    "Order Status",
    "Order Number",
    "Order Type",
    "Operation Type",
    "Pcie Port",
    "Created Time",
    "Failure Reason",
  ];
  const getDpOrderStatusIcon = (orderStatus: string) => {
    if (orderStatus === "SUCCESS") {
      return "p-icon--success";
    } else if (orderStatus === "IN_PROGRESS") {
      return "p-icon--status-in-progress";
    } else if (orderStatus === "FAILED") {
      return "p-icon--error";
    } else if (orderStatus === "PENDING") {
      return "p-icon--status-waiting";
    }
  };

  const TableCell = styled(MuiTableCell)(({ theme }) => ({
    "&.MuiTableCell-root": {
      wordBreak: "break-all",
    },
  }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            {dataPathOrderTableColumns.map((cell) => {
              return (
                <TableCell align="left">
                  {cell.replace(/([A-Z])/g, " $1").trim()}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {(props.datapathOrders || []).map((dporder: any) => {
            return (
              <TableRow
                key={dporder.OrderNumber}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <i className={getDpOrderStatusIcon(dporder?.OrderStatus)} />
                  {`(${dporder.OrderStatus})` || "-"}
                </TableCell>
                <TableCell align="left">{dporder.OrderNumber || "-"}</TableCell>
                <TableCell align="left">{dporder.OrderType || "-"}</TableCell>
                <TableCell align="left">
                  {dporder?.OperationType?.toUpperCase() || "-"}
                </TableCell>
                <TableCell align="left">
                  {dporder?.PciePort?.["@odata.id"]?.replace(
                    "/redfish/v1/Fabrics/DFabric",
                    ""
                  ) || "-"}
                </TableCell>
                <TableCell align="left">{dporder.Timestamp || "-"}</TableCell>
                <TableCell align="left">
                  {dporder.FailureReason || "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataPathOrderDetailsTable;
