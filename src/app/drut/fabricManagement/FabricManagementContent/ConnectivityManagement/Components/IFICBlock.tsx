import { useState, useEffect } from "react";
import type { SetStateAction } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { debounce } from "lodash";

import classes from "../../../fabricManagement.module.scss";

import IFICAccordion from "./IFICAccordion";

import type {
  FicManager,
  OpticalSwitch,
  OxcPortOption,
} from "app/drut/fabricManagement/Models/Manager";

const IFICBlock = ({
  iFicData,
  fetchingConnectivityResponse,
  oxcPortOptions,
  setOxcResponse,
  expandedIficAccordion,
  setIficAccordion,
  selectedZone,
  selectedIFicPool,
  setIFicResponse,
  removeFicPeerPort,
  clearAllFicPeerConnections,
}: {
  iFicData: FicManager[];
  oxcPortOptions: OxcPortOption[];
  fetchingConnectivityResponse: boolean;
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedIficAccordion: string;
  setIficAccordion: (value: string) => void;
  selectedZone: string;
  selectedIFicPool: string;
  setIFicResponse: (response: SetStateAction<FicManager[]>) => void;
  removeFicPeerPort: (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => void;
  clearAllFicPeerConnections: (fic: FicManager) => void;
}): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [iFicDataCopy, setIFicDataCopy] = useState(iFicData);

  useEffect(() => {
    debounceSearch(searchText, iFicData);
  }, [searchText, iFicData]);

  useEffect(() => {
    setSearchText("");
  }, [selectedZone, selectedIFicPool]);

  const onDebounceSearch = (searchText: any, iFicData: FicManager[]) => {
    if (searchText === "") {
      setIFicDataCopy(iFicData);
    } else {
      const filteredIficData = [] as FicManager[];
      iFicData.forEach((row: FicManager) => {
        if (row.name.toLowerCase().includes(searchText.toLowerCase())) {
          filteredIficData.push(row);
        }
      });
      setIFicDataCopy(filteredIficData);
    }
  };

  const debounceSearch = debounce(
    (searchText: any, iFicData: FicManager[]) =>
      onDebounceSearch(searchText, iFicData),
    1000
  );

  return (
    <div className={classes.block}>
      <div className={classes.connectivity_management_table_header_multiple}>
        <span>
          <strong>IFIC</strong>&nbsp;
        </span>
        <span>
          <TextField
            placeholder="Search iFic"
            variant="standard"
            value={searchText}
            className={classes.config_input}
            sx={{ m: 0, minWidth: 150, maxWidth: 200 }}
            onChange={(e: any) => {
              setSearchText(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchText && (
                    <IconButton
                      className={classes.oxc_remove}
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchText("");
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <div className={classes.oxc_remove}>
                    <SearchIcon />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </span>
      </div>
      {iFicDataCopy && iFicDataCopy.length > 0 ? (
        <div>
          {iFicDataCopy.map((iFic: FicManager) => {
            return (
              <div key={`${iFic.id}`}>
                <IFICAccordion
                  iFic={iFic}
                  oxcPortOptions={oxcPortOptions}
                  setOxcResponse={setOxcResponse}
                  expandedIficAccordion={expandedIficAccordion}
                  setIficAccordion={setIficAccordion}
                  setIFicResponse={setIFicResponse}
                  removeFicPeerPort={removeFicPeerPort}
                  clearAllFicPeerConnections={clearAllFicPeerConnections}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={classes.no_info_available}>
          <em>{`${
            fetchingConnectivityResponse
              ? "Fetching Data..."
              : selectedIFicPool
              ? "No IFICs available."
              : "Select IFIC Pool to fetch information."
          }`}</em>
        </div>
      )}
    </div>
  );
};

export default IFICBlock;
