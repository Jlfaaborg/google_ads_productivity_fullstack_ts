import "./css/Parse.css";

import React, { DragEvent, FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "./redux/store";

import * as XLSX from "xlsx";

/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from "stream";
XLSX.stream.set_readable(Readable);


const Parse: FC = () => {
  const dispatch = useAppDispatch();

  const hasSheetData = useSelector((state: RootState) => {
    return state.dashboard.hasSheetData;
  });

  const storeSheetData = (data: Record<string, string>) => {
    const sheetData = Object.assign(
      {},
      {
        config: data["config"][0],
        phoneConversions: data["phoneConversions"],
        websiteConversions: data["websiteConversions"],
      }
    );
    dispatch({ type: "dashboard/setSheetData", payload: sheetData });
  };

  const [showDrop, setshowDrop] = useState(true);

  useEffect(() => {
    if (hasSheetData) {
      setshowDrop(false);
    } else {
      setshowDrop(true);
    }
  }, [hasSheetData]);

  const handleDropAsync = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "yellow";

    const f = e.dataTransfer.files[0];
    /* f is a File */
    const data = await f.arrayBuffer();
    const workbook = XLSX.read(data);
    // eslint-disable-next-line prefer-const
    let parsedData = {};
    for (const sheet in workbook.Sheets) {
      if (Object.hasOwnProperty.call(workbook.Sheets, sheet)) {
        const element = workbook.Sheets[sheet];
        parsedData[sheet] = XLSX.utils.sheet_to_json(element);
      }
    }
    storeSheetData(parsedData);
  }


  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "black";
  };

  const handleLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "blue";
  };

  return (
    <React.Fragment>
      {showDrop && (
        <div
          className="Parse"
          onDragOver={handleDrag}
          onDragLeave={handleLeave}
          onDrop={handleDropAsync}
        ></div>
      )}
    </React.Fragment>
  );
};

export default Parse;
