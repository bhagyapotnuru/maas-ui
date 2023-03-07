import { useEffect, useState } from "react";

import {
  Col,
  Row,
  Spinner,
  Input,
  Select,
  Button,
  MainTable,
} from "@canonical/react-components";

import { fetchData, postData, throwHttpMessage } from "../../../config";

const AddResourceGroups = (): JSX.Element => {
  const abortController = new AbortController();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [pname, setPname] = useState("");
  const [pid, setPid] = useState("");
  const [qname, setQname] = useState("");
  const [pqname, setPQname] = useState("");
  const [groupdata, setGroupData] = useState([]);
  const [refresh, setRefresh] = useState("");

  const getParrent = () => {
    clearAll();
    console.log(fetchData, loading, error);
    fetchData("dfab/manage/", false, abortController.signal)
      .then((response: any) => {
        return throwHttpMessage(response, setError);
      })
      .then(
        (dt: any) => {
          console.log(dt);
          const data = dt.map((d: any) => {
            return {
              id: d.id,
              value: d.id,
              label: d.qname,
              name: d.name,
              parent_id: d.parent_id,
              parent_name: d.parent_name,
              qname: d.qname,
            };
          });
          data.unshift({ id: "", value: "", label: "--No Parent--" });
          setGroupData(data);
          setLoading(false);
        },
        (error: any) => {
          setLoading(false);
          console.log(error);
        }
      );
  };

  const setStateValues = (type: any, value: any) => {
    if (type === "n") {
      setName(value);
      const pq = pqname === "" ? `${value}` : `${pqname}.${value}`;
      setQname(pq);
    } else if (type === "p") {
      fillParentData(value);
    }
  };

  const fillParentData = (value: any) => {
    const sp: any = groupdata.find((t: any) => t.id == value);
    if (sp) {
      setPQname(sp.qname);
      setQname(`${sp.qname}.${name}`);
      setPname(sp.qname);
      setPid(value);
    } else {
      setQname(`${name}`);
      setPQname("");
      setPname("");
      setPid("");
    }
  };

  const getQName = (name: any, pqname: any) => {
    if (pqname !== undefined && pqname !== "") {
      return `${pqname}.${name}`;
    } else {
      return `${name}`;
    }
  };

  const clearAll = () => {
    setName("");
  };

  const createGroup = () => {
    if (name === "" || qname === "") {
      alert(`Name or qualified name can not be blank.`);
      return;
    }
    const fnData = {
      name: name,
      parent_id: pid,
      parent_name: pname,
      qname: qname,
    };
    postData("dfab/manage/", fnData)
      .then((response: any) => {
        if (response.status === 200) {
          return response.json();
        } else {
          response.text().then((text: any) => {
            setError(`Error: ${text}`);
          });
          throw response.text;
        }
      })
      .then(
        () => {
          setLoading(false);
          setName("");
          setStateValues("p", pid);
          setRefresh(Math.random().toString());
        },
        (error: any) => {
          setLoading(false);
          console.log(error);
        }
      )
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getGPIformation = (gp: any) => {
    const groups = gp.filter((g: any) => g.id !== "");
    return groups.map((elm: any) => {
      return {
        key: elm.Id,
        className: "",
        columns: [
          {
            key: "qname",
            className: "drut-na",
            content: <span>{elm?.qname || "NA"}</span>,
          },
          {
            key: "name",
            className: "drut-na",
            content: <span>{elm?.name || "NA"}</span>,
          },
          {
            key: "parent_name",
            className: "drut-na",
            content: <span>{elm?.parent_name || "NA"}</span>,
          },
        ],
        sortData: {
          name: elm?.name,
          parent_name: elm?.parent_name,
          qname: elm?.qname,
        },
      };
    });
  };

  const gp_header = [
    {
      content: "Qualified Name",
      sortKey: "qname",
    },
    {
      content: "Group Name",
      sortKey: "name",
    },
    {
      content: "Parent Group",
      sortKey: "parent_name",
    },
  ];

  useEffect(() => {
    getParrent();
  }, [refresh]);

  return (
    <>
      <h2>Add Group</h2>
      {loading ? <Spinner /> : null}

      <Row>
        <Col size={5}>
          <label>Group Name</label>
          <Input
            onChange={(e: any) => setStateValues("n", e.target.value)}
            type="text"
            value={name}
          />
        </Col>
        <Col size={7}>
          <label>Parent Group</label>
          <Select
            className=""
            defaultValue={pid}
            name="page-size"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setStateValues("p", e.target.value);
            }}
            options={groupdata}
            wrapperClassName=""
          />
        </Col>
        <Col size={12}>
          <label>Fully qualified group name</label>
          <Input disabled={true} type="text" value={getQName(name, pqname)} />
        </Col>
        <Col size={12}>
          <Button
            appearance="base"
            className="p-button--positive u-no-margin--right u-no-margin--bottom"
            disabled={name === ""}
            hasIcon
            onClick={() => createGroup()}
          >
            Save
          </Button>
        </Col>
      </Row>
      <br />
      <h2>Group List</h2>
      <hr />
      <Row>
        <Col size={12}>
          <div>
            {loading ? (
              <Spinner text="loading ..." />
            ) : (
              <MainTable
                className={"event-logs-table"}
                emptyStateMsg="Data not available."
                headers={gp_header}
                rows={getGPIformation(groupdata)}
                sortable
              />
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};
export default AddResourceGroups;
