import { useState, useEffect } from "react";

import {
  Accordion,
  Button,
  Col,
  ContextualMenu,
  List,
  Row,
  Select,
} from "@canonical/react-components";

import classess from "./ManagerControls.module.css";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import type { SetSearchFilter } from "app/base/types";

type Props = {
  searchText: string;
  setSearchText: SetSearchFilter;
  pageSize: string;
  prev: number;
  next: number;
  setNext: (value: number) => void;
  setPrev: (value: number) => void;
  setPageSize: (value: string) => void;

  managerCount: number;
  filterData: any;
};

const ManagerControls = ({
  searchText,
  managerCount,
  setSearchText,
  filterData,
  pageSize,
  prev,
  next,
  setNext,
  setPrev,
  setPageSize,
}: Props): JSX.Element => {
  const [expandedSection, setExpandedSection] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const previousNext = (type: any) => {
    if (type === "P") {
      setPrev(prev - 1);
      setNext(next - 1);
    } else {
      setPrev(prev + 1);
      setNext(next + 1);
    }
  };

  useEffect(() => {
    // Going to the first page if the search text or filters are updated!
    setPrev(0);
    setNext(1);
  }, [searchText]);

  const onItemClick = (item: any) => {
    setSelectedItem(item);
    setSearchText(item);
  };

  const itemsData = (data: any) => {
    const listItems: Array<any> = [];
    if (data) {
      data.forEach((item: any) => {
        listItems.push(
          <Button
            key={`btn${item.index}`}
            appearance="base"
            className={`u-align-text--left u-no-margin--bottom filter-accordion__item is-dense ${
              item === selectedItem ? "is-active" : "vcvc"
            }`}
            onClick={() => onItemClick(item)}
          >
            {item}
          </Button>
        );
      });
    }
    return listItems;
  };

  const getFilterItems = (items: any): Array<any> => {
    const finalData: Array<any> = [];
    if (items) {
      Object.keys(items).forEach((key, index) => {
        const obj = {
          title: key,
          key: key,
          content: (
            <List
              key={`filterItems${index}`}
              items={itemsData(items[key])}
            ></List>
          ),
        };
        finalData.push(obj);
      });
    }
    return finalData;
  };

  return (
    <>
      <Row className="u-nudge-down--small">
        <Col size={3}>
          <ContextualMenu
            className="filter-accordion filter-List-item"
            constrainPanelWidth
            hasToggleIcon
            position="left"
            toggleClassName="filter-accordion__toggle"
            toggleLabel="Filters"
          >
            <Accordion
              className="filter-accordion__dropdown"
              expanded={expandedSection}
              externallyControlled
              onExpandedChange={setExpandedSection}
              sections={getFilterItems(filterData)}
            />
          </ContextualMenu>
        </Col>

        <Col size={6}>
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
              options={[
                {
                  value: "25",
                  label: "25",
                },
                {
                  value: "50",
                  label: "50",
                },
                {
                  value: "100",
                  label: "100",
                },
                {
                  value: "200",
                  label: "200",
                },
              ]}
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
              disabled={managerCount < next * +pageSize}
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

export default ManagerControls;
