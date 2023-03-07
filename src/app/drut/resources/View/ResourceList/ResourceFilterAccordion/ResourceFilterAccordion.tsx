import { Spinner } from "@canonical/react-components";
import discoverySelectors from "app/store/discovery/selectors";
import { useSelector } from "react-redux";

// import FilterAccordion from "app/base/components/FilterAccordion";
// import {
//   FilterDiscoveries,
//   getDiscoveryValue,
// } from "app/store/discovery/utils";

// type Props = {
//   searchText?: string;
//   setSearchText: (searchText: string) => void;
// };

// const filterOrder = ["fabric_name", "vlan", "observer_hostname", "subnet"];

// const filterNames = new Map([
//   ["fabric_name", "Fabric"],
//   ["observer_hostname", "Rack"],
//   ["subnet", "Subnet"],
//   ["vlan", "VLAN"],
// ]);

const ResourceFilterAccordion = (): JSX.Element => {
  const loaded = useSelector(discoverySelectors.loaded);

  if (!loaded) {
    return <Spinner />;
  }

  return (
    <></>
    /*<FilterAccordion
      filterItems={FilterDiscoveries}
      filterNames={filterNames}
      filterOrder={filterOrder}
      filterString={searchText}
      getValue={getDiscoveryValue}
      items={discoveries}
      onUpdateFilterString={setSearchText}
    />*/
  );
};

export default ResourceFilterAccordion;
