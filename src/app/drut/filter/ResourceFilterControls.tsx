import { useEffect, useRef, useState } from "react";

import {
  Col,
  Row,
  SearchBox,
  ContextualMenu,
  Accordion,
  List,
  Button,
} from "@canonical/react-components";

type Props = {
  items: any;
  onFilterChange: any;
};

export const DEBOUNCE_INTERVAL = 500;

const ResourceFilterControls = ({
  items,
  onFilterChange,
}: Props): JSX.Element => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [expandedSection, setExpandedSection] = useState();

  const [searchText, setSearchText] = useState("");
  const [selected, setSelected]: [any, any] = useState([]);
  const [ft, setFt]: [any, any] = useState(items);
  const [debouncing, setDebouncing] = useState(false);

  const selectionchange = (key: any = "", elm: any = null) => {
    console.log(setExpandedSection);
    let newObj = JSON.parse(JSON.stringify(ft));
    if (elm === null) {
      newObj = JSON.parse(JSON.stringify(items));
      onFilterChange([]);
      setSelected([]);
      setSearchText("");
    } else {
      const fndata = newObj[key].ability.find(
        (dt: any) => dt.index === elm.index
      );
      let sel;
      const fnIndex = selected.find((dt: string) => dt === elm.data);
      if (!fnIndex) {
        sel = [...selected];
        sel.push(elm.data);
      } else {
        sel = selected.filter((dt: string) => dt !== elm.data);
      }
      onFilterChange(sel);
      setSearchText(sel.join(","));
      setSelected(sel);
      fndata.selected = !fndata.selected;
    }
    setFt(newObj);
  };

  const itemsData = (key: string, data: any) => {
    const listItems: Array<any> = [];
    data.forEach((elm: any) => {
      listItems.push(
        <Button
          key={`btn${elm.index}`}
          appearance="base"
          className={`u-align-text--left u-no-margin--bottom filter-accordion__item is-dense ${
            elm.selected ? "is-active" : "vcvc"
          }`}
          onClick={() => selectionchange(key, elm)}
        >
          {elm.data}
        </Button>
      );
    });
    return listItems;
  };

  const getFilterItems = (itm: any): Array<any> => {
    const finalData: Array<any> = [];
    if (itm) {
      Object.keys(itm).forEach((key, index) => {
        const obj = {
          title: key,
          key: key,
          content: (
            <List
              key={`filterItems${index}`}
              items={itemsData(key, itm[key].ability)}
            ></List>
          ),
        };
        finalData.push(obj);
      });
    }
    return finalData;
  };

  const onSearchValueChange = (e: any) => {
    if (selected && selected.length) {
      selectionchange();
    } else {
      setSearchText(e);
    }
  };

  const fiterString = (e: any) => {
    onFilterChange(e);
  };

  useEffect(() => {
    // If the filters change then update the search input text.
    setSearchText("");
  }, []);

  return (
    <Row>
      <Col size={4}>
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
            // onExpandedChange={setExpandedSection}
            sections={getFilterItems(ft)}
          />
        </ContextualMenu>
      </Col>
      <Col size={8} style={{ position: "relative" }}>
        <SearchBox
          externallyControlled
          onChange={(e) => {
            setDebouncing(true);
            // Clear the previous timeout.
            if (intervalRef.current) {
              clearTimeout(intervalRef.current);
            }

            onSearchValueChange(e);
            intervalRef.current = setTimeout(() => {
              fiterString(e);
              setDebouncing(false);
            }, DEBOUNCE_INTERVAL);
          }}
          value={searchText}
        />
        {/* TODO Caleb 23/04/2020 - Update SearchBox to allow spinner
            https://github.com/canonical-web-and-design/react-components/issues/112 */}
        {debouncing && (
          <i
            className="p-icon--spinner u-animation--spin"
            data-testid="search-spinner"
            style={{
              position: "absolute",
              top: ".675rem",
              right: searchText ? "5rem" : "3rem",
            }}
          ></i>
        )}
      </Col>
    </Row>
  );
};

export default ResourceFilterControls;
