import FilterAccordion from "app/base/components/FilterAccordion";
import { formatSpeedUnits } from "app/utils";
import type { FilterValue } from "app/utils/search/filter-handlers";

type Props = {
  searchText?: string;
  setSearchText: (searchText: string) => void;
  filterItems: any;
  getResourceValue: any;
  itemsList: any;
};

const filterOrder = ["capacity", "manufacturer", "model"];

const filterNames = new Map([
  ["capacity", "Capacity"],
  ["manufacturer", "Manufacturer"],
  ["model", "Model"],
]);

const getValueDisplay = (filter: string, filterValue: FilterValue) =>
  filter === "link_speeds" && typeof filterValue === "number"
    ? formatSpeedUnits(filterValue)
    : filterValue;

const ResourceFilterAccordion = ({
  searchText,
  setSearchText,
  filterItems,
  getResourceValue,
  itemsList,
}: Props): JSX.Element => {
  return (
    <></>
    /*<FilterAccordion
      filterItems={filterItems}
      filterNames={filterNames}
      filterOrder={filterOrder}
      filterString={searchText}
      getValue={getResourceValue}
      getValueDisplay={getValueDisplay}
      items={itemsList}
      onUpdateFilterString={setSearchText}
    />*/
  );
};

export default ResourceFilterAccordion;
