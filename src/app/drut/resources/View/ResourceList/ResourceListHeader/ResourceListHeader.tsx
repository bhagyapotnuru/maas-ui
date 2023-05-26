import { useEffect, useState } from "react";

import { Button } from "@canonical/react-components";
import { createBrowserHistory } from "history";
import PropType from "prop-types";
import { Link } from "react-router-dom";

import { getTypeTitle } from "../../../../types";

import SectionHeader from "app/base/components/SectionHeader";

interface Props {
  resourceType: any;
  stats: any;
  isDetails: boolean;
  onclickTab: any;
  currentTab: any;
}
const ResourceListHeader = ({
  resourceType,
  stats,
  isDetails,
  onclickTab,
  currentTab,
}: Props): JSX.Element => {
  const history = createBrowserHistory();
  const [tabs, setTabs]: any[] = useState([]);
  const [total, setTotal]: any[] = useState(0);

  const onclickTabEvent = (e: any) => {
    onclickTab(e);
    setLinkData(e);
  };

  const setLinkData = (currentTab: any): any => {
    let linkData: any = [];
    if (!isDetails) {
      linkData = [
        {
          active: currentTab === "All" ? true : false,
          label: `${stats["total"] || 0} All`,
          onClick: () => onclickTabEvent("All"),
        },
      ];
      resourceType.forEach((element: any) => {
        const tt = getTypeTitle(element);
        linkData.push({
          active: currentTab === element ? true : false,
          label: `${stats[element] ? stats[element] : "0"} ${tt.title} (${
            tt.short
          })`,
          onClick: () => onclickTabEvent(element),
        });
      });
      setTotal(stats["total"]);
    }

    setTabs(linkData);
  };

  const getHeaderButtons = (isDetails: boolean) => {
    const headerBtn = [
      <Button
        element={Link}
        key="resource-block-re-config"
        to="/drut-cdi/resource-block-re-config"
      >
        Reconfigure Resource Block
      </Button>,
      <Button element={Link} key="node-list" to="/drut-cdi/nodes">
        Node List
      </Button>,
      // <ContextualMenu
      //   hasToggleIcon
      //   className="drut-button"
      //   links={[
      //     {
      //       children: "Dashboard",
      //       onClick: () =>
      //         history.push(isDetails ? "../../drut-cdi" : "../drut-cdi"),
      //     },
      //     {
      //       children: "Compose Node",
      //       onClick: () => history.push(isDetails ? "../compose" : "compose"),
      //     },
      //     {
      //       children: "Events",
      //       onClick: () =>
      //         history.push(isDetails ? "../dfab-events" : "dfab-events"),
      //     },
      //   ]}
      //   position="right"
      //   toggleLabel="dFabric"
      // />,
    ];

    if (isDetails) {
      headerBtn.unshift(
        <Button
          key="resource-list"
          onClick={() => history.push("../resources")}
        >
          Resource List
        </Button>
      );
    }
    return headerBtn;
  };

  useEffect(() => {
    setLinkData(currentTab);
  }, [stats, isDetails]);

  return (
    <SectionHeader
      subtitle={
        isDetails
          ? "Resource Details"
          : `${total || 0} resource blocks available [ ${Object.keys(stats)
              .filter((key) => key.toLowerCase() !== "total")
              .reduce(
                (acc: number, currVal: any) => acc + stats[currVal],
                0
              )} Resources ]`
      }
      buttons={getHeaderButtons(isDetails)}
      title="Resources"
      tabLinks={tabs}
    />
  );
};

ResourceListHeader.protoTypes = {
  resourceType: PropType.array,
  stats: PropType.object,
  onclickTab: PropType.func,
  currentTab: PropType.string,
};

export default ResourceListHeader;
