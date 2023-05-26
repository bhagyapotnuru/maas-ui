import { useEffect } from "react";

import { Button, Col, Row, Select } from "@canonical/react-components";

import classess from "../Managers/ManagerControls.module.css";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { SetSearchFilter } from "app/base/types";
import { paginationOptions } from "app/drut/types";

type Props = {
  searchText: string;
  setSearchText: SetSearchFilter;
  pageSize: string;
  prev: number;
  next: number;
  setNext: (value: number) => void;
  setPrev: (value: number) => void;
  setPageSize: (value: string) => void;
  userCount: number;
};

const IficBmcControls = ({
  searchText,
  userCount,
  setSearchText,
  pageSize,
  prev,
  next,
  setNext,
  setPrev,
  setPageSize,
}: Props): JSX.Element => {
  const previousNext = (type: string) => {
    if (type === "P") {
      setPrev(prev - 1);
      setNext(next - 1);
    } else {
      setPrev(prev + 1);
      setNext(next + 1);
    }
  };

  useEffect(() => {
    // Going to the first page if the  pageSize is updated!
    setPrev(0);
    setNext(1);
  }, [pageSize]);

  return (
    <>
      <Row className="u-nudge-down--small">
        <Col size={9}>
          <DebounceSearchBox
            onDebounced={(debouncedText) => setSearchText(debouncedText)}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </Col>
        <Col size={3} className={classess.show_select}>
          <Col size={1} className={classess.select_label_name}>
            <span>Show</span>
          </Col>
          <Col size={1}>
            <Select
              className={`u-auto-width ${classess.pagingation_select}`}
              defaultValue={pageSize.toString()}
              name="page-size"
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                setPageSize(evt.target.value);
              }}
              options={paginationOptions}
              wrapperClassName="u-display-inline-block u-nudge-right"
            />
          </Col>
          <Col size={1}>
            <Button
              hasIcon
              appearance="base"
              className="u-no-margin--right u-no-margin--bottom"
              disabled={prev === 0}
              onClick={() => previousNext("P")}
            >
              <i className="p-icon--chevron-up drut-prev-icon"></i>
            </Button>
            <Button
              hasIcon
              appearance="base"
              className="u-no-margin--right u-no-margin--bottom"
              disabled={userCount <= next * +pageSize}
              onClick={() => previousNext("N")}
            >
              <i className="p-icon--chevron-up drut-next-icon"></i>
            </Button>
          </Col>
        </Col>
      </Row>
    </>
  );
};

export default IficBmcControls;
