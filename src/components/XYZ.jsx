import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useData } from "../context/context";
import {
  dataDeduction,
  dataIncome,
  dataLessCredit,
  dataPlus,
} from "../constant/constant";
import "../App.css";

const XYZ = ({ isRTI, setIsRTI }) => {
  const [currentYearData, setCurrentYearData] = useState([]);
  const { clientData, startDate, startYear } = useData();
  const [incomeData, setIncomeData] = useState(dataIncome);
  const [deductionData, setDeductionData] = useState(dataDeduction);
  const [lessCreditData, setLessCreditData] = useState(dataLessCredit);
  const [plusData, setPlusData] = useState(dataPlus);
  const [perITR, setPerITR] = useState(0);
  const [PrevYearState, setPrevYearState] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalLess, setTotalLess] = useState(0);
  const [totalPlus, setTotalPlus] = useState(0);
  const [overAllTotal, setOverAllTotal] = useState(0);
  // console.log(overAllTotal);
  const [differenceTotal, setDifferenceTotal] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [prevYearData, setPrevYearData] = useState([]);

  const taxableIncome = totalDeduction + totalIncome;
  // console.log(taxableIncome, totalDeduction, totalIncome);
  const [overAll, setOverAll] = useState(0);

  const togglePrevYearState = () => {
    if (!currentYearData) {
      alert("No Previous Data Found!!!!");
      return;
    }
    setPrevYearState(!PrevYearState);
    if (currentYearData.length > 0) {
      const curYear = startYear.getFullYear();
      const prevYear = curYear - 1;
      const data = currentYearData.find((item) => item.Year === prevYear);
      setPrevYearData(data);
    }
  };

  const handleIncomeChange = (id, value, year) => {
    console.log(updatedIncomeTotal);
    const updatedIncomeTotal = currentYearData
      ?.find((item) => item?.Year === year)
      ?.data.incomeData?.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );
    // console.log(updatedIncomeTotal);

    setIncomeData(updatedIncomeTotal);
    console.log(updatedIncomeTotal);
    const yearIndex = currentYearData.findIndex((item) => item?.Year === year);
    console.log(updatedIncomeTotal);
    if (yearIndex !== -1) {
      const updatedYearData = [...currentYearData];
      updatedYearData[yearIndex].data.incomeData = updatedIncomeTotal;
      setCurrentYearData(updatedYearData);
    }
    console.log(updatedIncomeTotal);
    const incomeTotal = updatedIncomeTotal?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setOverAll(incomeTotal)
    setTotalIncome(incomeTotal);
  };

  const handledeductionChange = (id, value, year) => {
    const updatedIncomeTotal = currentYearData
      ?.find((item) => item?.Year === year)
      ?.data.deductionData?.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );

    setDeductionData(updatedIncomeTotal);

    const yearIndex = currentYearData.findIndex((item) => item?.Year === year);

    if (yearIndex !== -1) {
      const updatedYearData = [...currentYearData];
      updatedYearData[yearIndex].data.deductionData = updatedIncomeTotal;
      setCurrentYearData(updatedYearData);
    }

    const incomeTotal = updatedIncomeTotal.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalIncome(incomeTotal);
  };
  const handleLessCreditChange = (id, value, year) => {
    const updatedIncomeTotal = currentYearData
      ?.find((item) => item?.Year === year)
      ?.data.lessCreditData?.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );

    setLessCreditData(updatedIncomeTotal);

    const yearIndex = currentYearData.findIndex((item) => item?.Year === year);

    if (yearIndex !== -1) {
      const updatedYearData = [...currentYearData];
      updatedYearData[yearIndex].data.lessCreditData = updatedIncomeTotal;
      setCurrentYearData(updatedYearData);
    }

    const incomeTotal = currentYearData
      ?.find((item) => item.Year === startYear.getFullYear())
      ?.data?.incomeData?.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );
    setTotalLess(incomeTotal);
  };

  useEffect(() => {
    const tot = taxableIncome + totalPlus + totalLess;
    setOverAllTotal(tot);
    const diff = tot - perITR;
    setDifferenceTotal(diff);
  }, [taxableIncome, totalPlus, totalLess, perITR, currentYearData, isRTI]);

  useEffect(() => {
    compareData();
  }, []);

  const handlePerITRChange = (value) => {
    const newValue = parseFloat(value);
    setPerITR(isNaN(newValue) ? "" : newValue);
  };
  const handleSubmission = () => {
    const dataStore = {
      Year: startYear.getFullYear(),
      data: {
        incomeData,
        deductionData,
        plusData,
        perITR,
        overAllTotal,
        lessCreditData,
      },
    };

    const existingData =
      JSON.parse(localStorage.getItem("PREV_YEAR_DATA")) || [];

    const index = existingData.findIndex(
      (item) => item.Year === startYear.getFullYear()
    );

    if (index === -1) {
      existingData.push(dataStore);
    } else {
      existingData[index] = dataStore;
    }

    localStorage.setItem("PREV_YEAR_DATA", JSON.stringify(existingData));
    alert("Data Submitted Successfully!!!");
  };

  const compareData = () => {
    const curYear = startYear.getFullYear();
    const prevYear = curYear - 1;

    const PrevData = JSON.parse(localStorage.getItem("PREV_YEAR_DATA")) || [];
    setCurrentYearData(PrevData);

    if (PrevData) {
      const data = PrevData.find((item) => item.Year === prevYear);
      const dat = PrevData.find((item) => item.Year === curYear);

      setOverAll(dat?.data?.overAllTotal);
      console.log(overAll);

      console.log(dat);
      setPrevYearData(data);
    } else {
      alert("No Data Found");
    }

    console.log(prevYearData);
  };
  console.log(overAll);
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
              <div className="col">
                {/* incomeData */}

                <table className="col-12 border-collapse">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Income</th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState === true && (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearData
                      ?.find((item) => item.Year === startYear.getFullYear())
                      ?.data?.incomeData?.map((item) => (
                        <tr key={item.id}>
                          <td className="number" style={{ width: "50px" }}>
                            {item.id}
                          </td>
                          <td className="border border-collapse">
                            {item.description}
                          </td>
                          <td className="border border-collapse">
                            <input
                              type="text"
                              value={item.amount}
                              placeholder="..."
                              onChange={(e) =>
                                handleIncomeChange(
                                  item.id,
                                  e.target.value,
                                  startYear.getFullYear()
                                )
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
                {/* incomeData */}

                {/* deductionData */}
                <table className="col-12 border-collapse my-4">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Deduction</th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState === true && (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearData
                      ?.find((item) => item.Year === startYear.getFullYear())
                      ?.data?.deductionData?.map((item) => (
                        <tr key={item.id}>
                          <td className="number" style={{ width: "50px" }}>
                            {item.id}
                          </td>
                          <td className="border border-collapse">
                            {item.description}
                          </td>
                          <td className="border border-collapse">
                            <input
                              type="text"
                              value={item.amount}
                              placeholder="..."
                              onChange={(e) =>
                                handledeductionChange(
                                  item.id,
                                  e.target.value,
                                  startYear.getFullYear()
                                )
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
                        Taxable Income
                      </td>
                      <td>{taxableIncome.toFixed(2)}</td>
                      {PrevYearState && (
                        <td>{prevYearData?.data?.taxableIncome}</td>
                      )}
                    </tr>
                  </tfoot>
                </table>
                {/* deductionData */}

                {/* plus table
                 */}
                {/* <table className="col-12 border-collapse mt-4">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Plus </th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState && (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearData
                      ?.find((item) => item.Year === startYear.getFullYear())
                      ?.data?.plusData?.map((item) => (
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
                                handlePlusChange(item.id, e.target.value , startYear.getFullYear())
                              }
                            />
                          </td>
                          {PrevYearState && (
                            <td className="border border-collapse">
                              {prevYearData?.data?.plusData?.find(
                                (data) => data.id === item.id
                              )?.amount || 0}
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table> */}
                {/* plus table  */}

                {/* Less Credits Table */}
                <table className="col-12 border-collapse my-4">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Less Credit</th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState === true && (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearData
                      ?.find((item) => item.Year === startYear.getFullYear())
                      ?.data?.lessCreditData?.map((item) => (
                        <tr key={item.id}>
                          <td className="number" style={{ width: "50px" }}>
                            {item.id}
                          </td>
                          <td className="border border-collapse">
                            {item.description}
                          </td>
                          <td className="border border-collapse">
                            <input
                              type="text"
                              value={item.amount}
                              placeholder="..."
                              onChange={(e) =>
                                handleLessCreditChange(
                                  item.id,
                                  e.target.value,
                                  startYear.getFullYear()
                                )
                              }
                            />
                          </td>
                          {PrevYearState && (
                            <td className="border border-collapse">
                              {prevYearData?.data?.lessCreditData?.find(
                                (data) => data.id === item.id
                              )?.amount || 0}
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
                {/* Less Credits Table */}

                {/* fott */}

                <table className="col-12 my-4 ">
                  <tfoot className="">
                    {
                      <>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Estimated Tax Payable/(Refundable)
                          </td>
                          <td>{overAll}</td>
                          {/* <td>{ overAllTotal.toFixed(2)}</td> */}
                          {PrevYearState && (
                            <td>{prevYearData?.data?.overAllTotal}</td>
                          )}
                        </tr>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Per ITR
                          </td>
                          <td>
                            <input
                              type="number"
                              value={perITR}
                              onChange={(e) =>
                                handlePerITRChange(e.target.value)
                              }
                            />
                          </td>
                          {PrevYearState && (
                            <td>{prevYearData?.data?.perITR || 0}</td>
                          )}
                        </tr>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Difference
                          </td>
                          <td>{differenceTotal.toFixed(2)}</td>
                          {PrevYearState && (
                            <td>{prevYearData?.data?.differenceTotal || 0}</td>
                          )}
                        </tr>
                      </>
                    }
                  </tfoot>
                </table>
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

export default XYZ;
