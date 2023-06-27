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
import { useSelector, useDispatch } from "react-redux";

import { MANAGER_TYPES } from "../Managers/AddManager/constants";

import classes from "./ManagerControls.module.css";

import DebounceSearchBox from "app/base/components/DebounceSearchBox";
import { paginationOptions } from "app/drut/types";
import { actions } from "app/store/drut/managers/slice";
import type { Zone, Rack } from "app/store/drut/managers/types";
import type { RootState } from "app/store/root/types";

const ManagerControls = (): JSX.Element => {
  const { next, prev, pageSize, count, selectedItem, zones, searchText } =
    useSelector((state: RootState) => state.Managers);
  let rackNames = (zones as Zone[])
    .filter(
      (zoneRack: any) =>
        !["drut", "default_zone"].includes(zoneRack.zone_name.toLowerCase())
    )
    .map((zoneRackPair: Zone) => zoneRackPair.racks)
    .reduce((accumulator: any, value: any) => accumulator.concat(value), [])
    .map((rack: Rack) => rack.rack_fqgn);
  rackNames = new Set<string>(rackNames);

  const filterData = {
    "Manager Type": MANAGER_TYPES,
    Pools: rackNames,
  };

  const dispatch = useDispatch();

  const [expandedSection, setExpandedSection] = useState();
  const previousNext = (type: any) => {
    if (type === "P") {
      dispatch(actions.setPrev(prev - 1));
      dispatch(actions.setNext(next - 1));
    } else {
      dispatch(actions.setPrev(prev + 1));
      dispatch(actions.setNext(next + 1));
    }
  };

  useEffect(() => {
    // Going to the first page if the pageSize is updated!
    dispatch(actions.setPrev(0));
    dispatch(actions.setNext(1));
  }, [pageSize]);

  const onItemClick = (item: any, key: any) => {
    dispatch(actions.setSelectedItem(item === "OXC" ? "OPTICAL_SWITCH" : item));
    dispatch(actions.setSearchText(item));
    dispatch(actions.setFilterType(key));
  };

  const itemsData = (data: any, key: any) => {
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
            onClick={() => onItemClick(item, key)}
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
              items={itemsData(items[key], key)}
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
            onDebounced={(debouncedText) => {
              if (debouncedText === "") {
                dispatch(actions.setFilterType(""));
                dispatch(actions.setSelectedItem(""));
              }
              dispatch(actions.setSearchText(debouncedText));
            }}
            searchText={searchText}
            setSearchText={(s: string) => {
              dispatch(actions.setSearchText(s));
            }}
          />
        </Col>
        <Col size={3} className={classes.show_select}>
          <Col size={1}>
            <Select
              className={`u-auto-width ${classes.pagingation_select}`}
              defaultValue={pageSize.toString()}
              name="page-size"
              onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                dispatch(actions.setPageSize(evt.target.value));
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
            <span>{next}</span>
            <Button
              hasIcon
              appearance="base"
              className="u-no-margin--right u-no-margin--bottom"
              disabled={count < next * +pageSize}
              onClick={() => previousNext("N")}
            >
              <i className="p-icon--chevron-up drut-next-icon"></i>
            </Button>
          </Col>
        </Col>
      </Row>
      {count > 0 && (
        <Row className={classes.show_select}>
          <span>
            <b>
              {`${+prev * +pageSize + 1} - ${
                +next * +pageSize >= count ? count : +next * +pageSize
              } `}
            </b>
            of <b>{count}</b>
          </span>
        </Row>
      )}
    </>
  );
};

export default ManagerControls;
