import type { SetStateAction } from "react";
import { useState, useEffect } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { debounce } from "lodash";

import classes from "../../../fabricManagement.module.scss";

import TFICAccordion from "./TFICAccordion";

import type {
  FicManager,
  OpticalSwitch,
  OxcPortOption,
} from "app/drut/fabricManagement/Models/Manager";

const TFICBlock = ({
  tFicData,
  oxcPortOptions,
  fetchingConnectivityResponse,
  setOxcResponse,
  expandedTficAccordion,
  setTficAccordion,
  selectedZone,
  selectedTFicPool,
  setTFicResponse,
  removeFicPeerPort,
  clearAllFicPeerConnections,
}: {
  tFicData: FicManager[];
  oxcPortOptions: OxcPortOption[];
  fetchingConnectivityResponse: boolean;
  setOxcResponse: (response: SetStateAction<OpticalSwitch[]>) => void;
  expandedTficAccordion: string;
  setTficAccordion: (value: string) => void;
  selectedZone: string;
  selectedTFicPool: string;
  setTFicResponse: (response: SetStateAction<FicManager[]>) => void;
  removeFicPeerPort: (
    fic: FicManager,
    pcieSwitchKey: string,
    pcieSwitchPortKey: string
  ) => void;
  clearAllFicPeerConnections: (fic: FicManager) => void;
}): JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const [tFicDataCopy, settFicDataCopy] = useState(tFicData);

  useEffect(() => {
    debounceSearch(searchText, tFicData);
  }, [searchText, tFicData]);

  useEffect(() => {
    setSearchText("");
  }, [selectedZone, selectedTFicPool]);

  const onDebounceSearch = (searchText: any, tFicData: FicManager[]) => {
    if (searchText === "") {
      settFicDataCopy(tFicData);
    } else {
      const filteredTficData = [] as FicManager[];
      tFicData.forEach((row: FicManager) => {
        if (row.name.toLowerCase().includes(searchText.toLowerCase())) {
          filteredTficData.push(row);
        }
      });
      settFicDataCopy(filteredTficData);
    }
  };

  const debounceSearch = debounce(
    (searchText: any, tFicData: FicManager[]) =>
      onDebounceSearch(searchText, tFicData),
    1000
  );

  return (
    <div className={classes.block}>
      <div className={classes.connectivity_management_table_header_multiple}>
        <span>
          <strong>TFIC</strong>&nbsp;
        </span>
        <span>
          <TextField
            placeholder="Search tFic"
            variant="standard"
            value={searchText}
            sx={{ m: 0, minWidth: 150, maxWidth: 200 }}
            className={classes.config_input}
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
      {tFicDataCopy && tFicDataCopy.length > 0 ? (
        <div>
          {tFicDataCopy.map((tFic: FicManager) => {
            return (
              <div key={`${tFic.id}`}>
                <TFICAccordion
                  tFic={tFic}
                  oxcPortOptions={oxcPortOptions}
                  setOxcResponse={setOxcResponse}
                  expandedTficAccordion={expandedTficAccordion}
                  setTficAccordion={setTficAccordion}
                  setTFicResponse={setTFicResponse}
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
              : selectedTFicPool
              ? "No TFICs available."
              : "Select TFIC Pool to fetch information."
          }`}</em>
        </div>
      )}
    </div>
  );
};

export default TFICBlock;
