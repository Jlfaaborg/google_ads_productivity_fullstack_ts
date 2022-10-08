/* eslint-disable react/display-name */
import React, { SyntheticEvent, FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";




const Results: FC = () => {
    const hasErrors = useSelector((state: RootState) => state.api.hasErrors);
    const hasResults = useSelector((state: RootState) => state.api.hasResults);

    const errors = useSelector((state: RootState) => state.api.error);
    const dataFromBackend = useSelector((state: RootState) => state.api.dataFromBackend);
    return (
        <div>
            <div>
                {hasErrors ? errors.map(err => {
                    return (<div><h4>Error! Code:{err.code}</h4><h4>Message:{err.message}</h4><h4>Location:{err.location}</h4><h4>At: {err.trigger}</h4></div>)
                }) : <div>No Errors</div>}
            </div>
            <div>
                {hasResults ? dataFromBackend.map(data => {
                    return (<div><h4>Success! Resource:{data.resource_name}</h4></div>)
                }) : <div>Nothing Uploaded</div>}
            </div>
        </div >
    )

};



export default Results;