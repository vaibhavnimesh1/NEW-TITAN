import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useData } from "../context/context";
import { dataDeduction, dataIncome } from "../constant/constant";
import "../App.css";

const RTI = ({ isRTI, setIsRTI }) => {
  const { clientData, startDate, startYear } = useData();
  const [incomeData, setIncomeData] = useState(dataIncome);
  const [deductionData, setDeductionData] = useState(dataDeduction);

  // console.log(incomeData?.some((item) => item.amount == ""));

  // console.log(deductionData);
  const [PrevYearState, setPrevYearState] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);

  const [totalDeduction, setTotalDeduction] = useState(0);
  const [prevYearData, setPrevYearData] = useState([]);

  const togglePrevYearState = () => {
    if (!prevYearData) {
      alert("No Previous Data Found!!!!");
      return;
    }
    setPrevYearState(!PrevYearState);
  };

  const handleIncomeChange = (id, value) => {
    const updatedIncomeTotal = incomeData?.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );

    setIncomeData(updatedIncomeTotal);

    const incomeTotal = updatedIncomeTotal.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalIncome(incomeTotal);
  };
  const handleDeductionChange = (id, value) => {
    const updatedDeduction = deductionData?.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    setDeductionData(updatedDeduction);

    const deductionTotal = updatedDeduction?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalDeduction(deductionTotal);
  };

  const taxableIncome = totalDeduction + totalIncome;

  const handleSubmission = () => {
    const dataStore = {
      Year: startYear.getFullYear(),
      data: {
        incomeData,
        deductionData,
      },
    };
    const emptyCondition = dataStore.data?.incomeData?.some(
      (item) => item.amount != ""
    );
    // console.log(dataStore?.data);
    const existingData = JSON.parse(localStorage.getItem("RTI_DATA")) || [];

    const index = existingData.findIndex(
      (item) => item.Year === startYear.getFullYear()
    );

    if (index === -1) {
      existingData.push(dataStore);
    } else {
      existingData[index] = dataStore;
    }

    if (emptyCondition) {
      localStorage.setItem("RTI_DATA", JSON.stringify(existingData));
      alert("Data Submitted Successfully!!!");
    } else {
      alert("Input field are empty");
    }
  };

  const compareData = () => {
    const curYear = startYear.getFullYear();
    const prevYear = curYear - 1;

    const PrevData = JSON.parse(localStorage.getItem("RTI_DATA")) || [];
    console.log(PrevData);

    if (PrevData) {
      const l = PrevData.find((item) => item.Year === prevYear);
      setPrevYearData(l);
    } else {
      alert("No Data Found");
    }
  };

  useEffect(() => {
    compareData();
  }, []);

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
                      {PrevYearState ? (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      ) : (
                        ""
                      )}
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
                        {PrevYearState && (
                          <td className="border border-collapse">
                            {prevYearData?.data?.incomeData?.find(
                              (data) => data.id === item.id
                            )?.amount || 0}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* income end */}

                {/* deduction table */}
                <table className="col-12 border-collapse mt-4">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Deduction</th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState ? (
                        <th className="col-3 ">{PrevYearState.Year}</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {deductionData?.map((item) => (
                      <tr key={item.id}>
                        <td className="number" style={{ width: "50px" }}>
                          {item.id}
                        </td>
                        <td className=" border  border-collapse">
                          {item?.description}
                        </td>
                        <td className=" border  border-collapse">
                          <input
                            type="number"
                            value={item.amount}
                            placeholder="..."
                            onChange={(e) =>
                              handleDeductionChange(item.id, e.target.value)
                            }
                          />
                        </td>
                        {PrevYearState && (
                          <td className="border border-collapse">
                            {prevYearData?.data?.deductionData?.find(
                              (data) => data.id === item.id
                            )?.amount || 0}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={2} className=" fs-5 ">
                        Total
                      </td>
                      <td>{taxableIncome.toFixed(2)}</td>
                      {PrevYearState
                       && <td>54</td>}
                    </tr>
                  </tfoot>
                </table>
                {/* deduction table */}
              </div>

              <div className="d-flex gap-2 mt-5">
                <button
                  className="btn bg-success py-0"
                  onClick={handleSubmission}
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
