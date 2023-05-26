import { useEffect, useState } from "react";

import { Route, Switch } from "react-router-dom";

import FabricManagementHeader from "../../FabricManagementHeader";
import managersUrl from "../../url";
import type { Rack, Zone } from "../Managers/AddManager/type";

import IficBmcContent from "./IficBmcContent";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import { fetchData } from "app/drut/config";

const IficBmc = (): JSX.Element => {
  const [error, setError] = useState("");
  const [zoneRackPairs, setZoneRackPairs] = useState([] as Zone[]);
  const [zoneName, setZoneName] = useState<Set<string> | null>(null);
  const [rackName, setRackname] = useState<Set<string> | null>(null);

  const headerContent: JSX.Element | null = null;
  const headerTitle = "Fabric Management";
  const abortController = new AbortController();

  useEffect(() => {
    getZones();
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (zoneRackPairs) {
      const zoneNames = (zoneRackPairs as Zone[]).map(
        (Zones: Zone) => Zones.zone_name
      );
      setZoneName(new Set<string>(zoneNames));

      const rackNames = (zoneRackPairs as Zone[])
        .map((zoneRackPairs: Zone) => zoneRackPairs.racks as Rack[])
        .reduce((accumulator: any, value: any) => accumulator.concat(value), [])
        .map((rack: Rack) => rack.rack_name);

      setRackname(new Set<string>(rackNames));
    }
  }, [zoneRackPairs]);

  const getZones = async () => {
    try {
      const promise = await fetchData(
        "dfab/nodegroups/?op=get_zones_and_racks",
        false,
        abortController.signal
      );
      if (promise.status === 200) {
        let response = await promise.json();
        response = response.filter(
          (zoneRackPair: Zone) =>
            zoneRackPair.zone_name.toLowerCase() !== "default_zone"
        );
        setZoneRackPairs(response);
      } else {
        setError(promise.text());
      }
    } catch (e: any) {
      setError(e);
    } finally {
    }
  };

  return (
    <>
      <Section
        key="managersHeader"
        className="u-no-padding--bottom"
        header={
          <FabricManagementHeader
            tag="Ific-Bmc"
            headerContent={headerContent}
            title={headerTitle}
          />
        }
      >
        <Switch>
          <Route exact path={managersUrl.fabricManagement.IficBmc.index}>
            <IficBmcContent
              error={error}
              setError={setError}
              zoneName={zoneName}
              rackName={rackName}
            />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Section>
    </>
  );
};

export default IficBmc;
