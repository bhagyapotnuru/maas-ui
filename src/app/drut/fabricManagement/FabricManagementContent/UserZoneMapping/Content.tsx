import { useState, useEffect } from "react";

import { Notification, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import Controls from "./Controls";
import Table from "./Table";

import { useWindowTitle } from "app/base/hooks";
import { paginationOptions } from "app/drut/types";
import { fetcUserZoneData, actions } from "app/store/drut/userzones/slice";
import type { UserZone, Data } from "app/store/drut/userzones/types";
import type { RootState } from "app/store/root/types";

export enum Label {
  Title = "User-Zone List",
}

type Props = {
  setRenderAddZonesForm: (val: any) => void;
  setRenderRemoveZonesForm: (val: any) => void;
  setCurrentUser: (val: Data) => void;
};

const Content = ({
  setRenderAddZonesForm,
  setRenderRemoveZonesForm,
  setCurrentUser,
}: Props): JSX.Element => {
  const [pageSize, setPageSize] = useState(paginationOptions[0].value);
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(1);
  const [searchText, setSearchText] = useState("");

  const abortController = new AbortController();
  useWindowTitle("User Zone Mapping");

  const dispatch = useDispatch();
  const { loading, items, errors } = useSelector(
    (state: RootState) => state.UserZone
  );

  useEffect(() => {
    dispatch(fetcUserZoneData(abortController.signal));
    return () => {
      abortController.abort();
    };
  }, []);

  const getData = (items: UserZone[]) => {
    let res: Data[] = [];
    if (items?.length) {
      res = items.map((r: UserZone) => ({
        ...r,
        zonesValue: r?.zones?.map((zone) => zone.zone_fqgn).join(", ") || "",
        active_zone: r?.zones?.find((zone) => zone.is_active)?.zone_fqgn || "",
      }));
    }
    return res;
  };

  const userData: Data[] = getData(items);

  return (
    <>
      {errors?.length && (
        <Notification
          onDismiss={() => dispatch(actions.cleanup())}
          inline
          severity="negative"
        >
          {errors.toString()}
        </Notification>
      )}
      {loading ? (
        <Notification inline severity="information">
          <Spinner text="Loading..." />
        </Notification>
      ) : (
        <div aria-label={Label.Title}>
          <Controls
            aria-label="User-Zone list controls"
            searchText={searchText}
            setSearchText={setSearchText}
            userCount={userData?.length}
            pageSize={pageSize}
            setPageSize={setPageSize}
            next={next}
            setNext={setNext}
            prev={prev}
            setPrev={setPrev}
          />
          <Table
            setCurrentUser={setCurrentUser}
            setRenderAddZonesForm={setRenderAddZonesForm}
            setRenderRemoveZonesForm={setRenderRemoveZonesForm}
            aria-label="User-Zone"
            data={userData || []}
            searchText={searchText}
            pageSize={pageSize}
            prev={prev}
            next={next}
            setSearchText={setSearchText}
          />
        </div>
      )}
    </>
  );
};

export default Content;
