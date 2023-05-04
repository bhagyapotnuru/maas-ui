import { useState } from "react";

import { Route, Switch, useLocation } from "react-router-dom";

import { rsTypeUI } from "../../types";

import resourceUrl from "./../url";
import AddResource from "./AddResource";
import ResourceList from "./ResourceList";
import ResourceListHeader from "./ResourceList/ResourceListHeader";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks/index";
import NotFound from "app/base/views/NotFound";

const Resources = (): JSX.Element => {
  const [selected, setSelected]: any[] = useState("All");
  const [stats, setStats]: any[] = useState({});
  const [isDetails, setIsDetails]: any[] = useState(false);
  const location = useLocation();

  useWindowTitle("MATRIX-Resource Blocks");

  const onclickTab = (dt: any) => {
    setSelected(dt);
  };

  const handleContentChange = (dt: any, flag: boolean) => {
    setStats(dt);
    setIsDetails(flag);
  };

  return (
    <Section
      className="u-no-padding--bottom"
      header={
        <ResourceListHeader
          currentTab="All"
          isDetails={isDetails}
          onclickTab={onclickTab}
          resourceType={rsTypeUI}
          stats={stats}
        />
      }
      key={location.key}
    >
      <Switch>
        <Route exact path={resourceUrl.resources.index}>
          <ResourceList
            onChangeContent={(nd: any, flag: boolean) =>
              handleContentChange(nd, flag)
            }
            selected={selected}
          />
        </Route>
        <Route exact path={resourceUrl.resources.resourceDetails(null)}>
          <ResourceList
            onChangeContent={(nd: any, flag: boolean) =>
              handleContentChange(nd, flag)
            }
            selected={selected}
          />
        </Route>
        <Route exact path={resourceUrl.resources.add}>
          <AddResource />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Section>
  );
};

export default Resources;
