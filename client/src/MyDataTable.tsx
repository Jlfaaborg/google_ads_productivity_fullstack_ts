/* eslint-disable react/jsx-key */
import "./css/MyDataTable.css";
import React, { SyntheticEvent, FC, useState, ChangeEvent, } from "react";
import { RootState, useAppDispatch } from "./redux/store";

import { useSelector } from "react-redux";


const MyDataTable: FC = () => {
  const dispatch = useAppDispatch();

  const [inEditMode, setInEditMode] = useState({
    status: false,
  });

  const [viewMode, setViewMode] = useState({
    status: "web",
  });

  const sheetData = useSelector((state: RootState) => {
    return state.dashboard.sheetData;
  });

  // const dataFromGoogle = useSelector((state: RootState) => {
  //   return state.api;
  // });

  const onSave = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch({ type: "dashboard/handleSave" });
    setInEditMode({
      status: false,
    });
  };

  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setInEditMode({
      status: false,
    });
  };

  const onEdit = (e: SyntheticEvent) => {
    e.preventDefault();
    setInEditMode({
      status: true,
    });
  };

  const changeView = (e: SyntheticEvent) => {
    e.preventDefault();
    switch (viewMode.status) {
      case "web":
        setViewMode({
          status: "phone"
        });
        break;
      case "phone":
        setViewMode({
          status: "web"
        });
        break;
      default:
        break;
    }

  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number, conversionToChange: string) => {
    const temp = Object.assign(
      {},
      { e, target: e.target.name, newValue: e.target.value, index, conversionToChange }
    );
    dispatch({ type: "dashboard/handleChange", payload: temp });
  };
  
  return (
    <React.Fragment>
      {viewMode.status === "web" && <div><h2>Website Conversions</h2><table className="Table">
        <thead>
          <tr key={"header"}>
            {Object.keys(sheetData.phoneConversions[0]).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheetData.phoneConversions.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((val, indexVal) => (
                <td>
                  {inEditMode.status ? (
                    <input
                      name={
                        Object.keys(sheetData.phoneConversions[0])[indexVal]
                      }
                      defaultValue={val.toString()}
                      onChange={(e) =>
                        handleChange(
                          e,
                          index,
                          "phoneConversions"
                        )
                      }
                    />
                  ) : (
                    val.toString()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table></div>}
      {viewMode.status === "phone" && <div><h2>Phone Conversions</h2><table className="Table">
        <thead>
          <tr key={"header"}>
            {Object.keys(sheetData.websiteConversions[0]).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sheetData.websiteConversions.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((val, indexVal) => (
                <td>
                  {inEditMode.status ? (
                    <input
                      name={
                        Object.keys(sheetData.websiteConversions[0])[indexVal]
                      }
                      defaultValue={val.toString()}
                      onChange={(e) =>
                        handleChange(
                          e,
                          index,
                          "websiteConversions"
                        )
                      }
                    />
                  ) : (
                    val.toString()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table></div>}
      {inEditMode.status ? (
        <React.Fragment>
          <button className={"btn-success"} onClick={(e) => onSave(e)}>
            Save
          </button>
          <button className={"btn-success"} onClick={(e) => onCancel(e)}>
            Cancel
          </button>
          <button className={"btn-primary"} onClick={(e) => changeView(e)}>
            Change View
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button className={"btn-primary"} onClick={(e) => onEdit(e)}>
            Edit
          </button>
          <button className={"btn-primary"} onClick={(e) => changeView(e)}>
            Change View
          </button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default MyDataTable;
