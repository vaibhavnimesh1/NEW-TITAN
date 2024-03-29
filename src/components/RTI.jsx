import React, { useState } from "react";
import { format } from "date-fns";
import { useData } from "../context/context";
import { dataIncome } from "../constant/constant";
import "../App.css"

const RTI = ({ isRTI, setIsRTI }) => {
  const { clientData, startDate, startYear } = useData();

  // const [incomeData, setIncomeData] = useState(dataIncome);

  console.log("Table");
  return (
    <div className="row col-12 mt-5 lower bg-light py-4 px-2 ">
      <div
        className={`offcanvas offcanvas-start  ${isRTI ? "show" : ""}`}
        data-bs-backdrop="static"
        tabIndex="-1"
        id="staticBackdrop"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-center" id="staticBackdropLabel">
            RTI Data
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setIsRTI(false)}
          ></button>
        </div>
        <div className="container  overflow-y-scroll ">
          <div className="row">
            <div className="col p-0">
              <table className="table upper col-12">
                <thead className="col-3">
                  <tr>
                    <th scope="col">Client :</th>
                    <td scope="col">{clientData.Name}</td>
                    <th scope="col">Schedule Ref</th>
                    <td scope="col">B</td>
                  </tr>
                </thead>
                <tbody className="col-9">
                  <tr className="col-3">
                    <th scope="row">Area :</th>
                    <td>{clientData.Area}</td>
                    <th>Staff Member</th>
                    <td>No</td>
                  </tr>
                  <tr className="col-3">
                    <th scope="row">Year :</th>
                    <td>{format(startYear, "yyyy")}</td>
                    <th>Manager Review</th>
                    <td>No</td>
                  </tr>
                  <tr className="col-3">
                    <th scope="row">Date :</th>

                    <td>{format(startDate, "MM/dd")}</td>

                    <th>Partner Review</th>
                    <td colSpan="2">No</td>
                  </tr>
                </tbody>
              </table>

              {/* Tax year section */}

              <div className="col">
                {/* income start */}
                <table className="col-12">
                  <tr className=" col-12">
                    <th className=" col-4" colSpan={2}>Income</th>
                    <th className=" col-4">{format(startYear, "yyyy")}</th>
                    <th className=" col-4">2023</th>
                  </tr>

                  <tbody>
                    <tr>
                      <td>af</td>
                      <td>gha</td>
                      <td>gha</td>
                      <td>gha</td>
                    </tr>
                    <tr>
                      <td>af</td>
                      {/* <td>af</td> */}
                      <td>gha</td>
                      <td>gha</td>
                    </tr>
                  </tbody>
                </table>
                {/* income start */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTI;
