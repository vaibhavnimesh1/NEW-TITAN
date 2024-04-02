import React, { useState } from "react";
import { format } from "date-fns";
import { useData } from "../context/context";
import { dataIncome } from "../constant/constant";
import "../App.css";

const RTI = ({ isRTI, setIsRTI }) => {
  const [incomeData, setIncomeData] = useState(dataIncome);
  const { clientData, startDate, startYear } = useData();

  const [PrevYearState, setPrevYearState] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  console.log(totalIncome);

  const togglePrevYearState = () => setPrevYearState(!PrevYearState);

  const handleIncomeChange = (id, value) => {
    const updatedIncomeTotal = incomeData.map((item) =>
      id === item.id ? { ...item, amount: parseFloat(value) || 0 } : item
    );
    setIncomeData(updatedIncomeTotal);

    setTotalIncome(
      updatedIncomeTotal.reduce((acc, curr) => acc + curr),
      0
    );
  };

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
                <table className="col-12 border-collapse">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Income</th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState ? <th className="col-3 ">2022</th> : ""}
                    </tr>
                  </thead>
                  <tbody>
                    {incomeData?.map((item) => (
                      <tr key={item.id}>
                        <td className="number" style={{ width: "50px" }}>
                          {item.id}
                        </td>
                        <td className=" border  border-collapse">
                          {item.description}
                        </td>
                        <td className=" border  border-collapse">
                          <input
                            type="number"
                            value={item.amount}
                            placeholder="..."
                            onChange={(e) =>
                              handleIncomeChange(item.id, e.target.value)
                            }
                          />
                        </td>
                        {PrevYearState ? (
                          <td className=" border  border-collapse">Content</td>
                        ) : (
                          ""
                        )}{" "}
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={2}>Total</td>
                      <td>{totalIncome}</td>
                      {PrevYearState && <td>54</td>}
                    </tr>
                  </tfoot>
                </table>
                {/* income end */}
              </div>

              <div className="d-flex gap-2 mt-5">
                <button
                  className="btn bg-success py-0"
                  // onClick={handleSubmission}
                >
                  Submit Data
                </button>
                <button
                  className="btn bg-warning py-0"
                  onClick={togglePrevYearState}
                >
                  {PrevYearState
                    ? "Hide Previous Year Data"
                    : "Show Previous Year Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTI;
