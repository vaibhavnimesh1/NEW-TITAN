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
  console.log(currentYearData);
  const { clientData, startDate, startYear } = useData();
  const [incomeData, setIncomeData] = useState(dataIncome);
  // const [constantData, setconstantData] = useState(dataIncome);
  const [deductionData, setDeductionData] = useState(dataDeduction);
  const [lessCreditData, setLessCreditData] = useState(dataLessCredit);
  const [plusData, setPlusData] = useState(dataPlus);
  const [perITR, setPerITR] = useState(0);
  const [PrevYearState, setPrevYearState] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalLess, setTotalLess] = useState(0);
  const [totalPlus, setTotalPlus] = useState(0);
  const [overAllTotal, setOverAllTotal] = useState(0);
  const [isLocalData, setIsLocalData] = useState(true);
  const [differenceTotal, setDifferenceTotal] = useState(0);
  const [prevYearData, setPrevYearData] = useState([]);
  const [overAll, setOverAll] = useState(0);

  const taxableIncome =
    totalDeduction !== null && totalIncome !== null
      ? totalDeduction + totalIncome
      : 0;

  const togglePrevYearState = () => {
    const isLastYearData = currentYearData.some(
      (i) => i.Year === startYear.getFullYear() - 1
    );

    if (isLastYearData == false) {
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
    const updatedIncomeTotal = currentYearData
      ?.find((item) => item?.Year === year)
      ?.data.incomeData?.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );
    // console.log(updatedIncomeTotal);
    if (updatedIncomeTotal == undefined) {
      const updatedIncomeTotal = incomeData.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );
    }

    setIncomeData(updatedIncomeTotal);
    const yearIndex = currentYearData?.findIndex((item) => item?.Year === year);

    if (yearIndex !== -1) {
      const updatedYearData = [...currentYearData];
      updatedYearData[yearIndex].data.incomeData = updatedIncomeTotal;
      setCurrentYearData(updatedYearData);
    }

    const incomeTotal = updatedIncomeTotal?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalIncome(incomeTotal);
  };

  const handledeductionChange = (id, value, year) => {
    const updatedIncomeTotal = currentYearData
      ?.find((item) => item?.Year === year)
      ?.data.deductionData?.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );

    console.log(updatedIncomeTotal);
    if (updatedIncomeTotal === undefined) {
      const updatedIncomeTotal = deductionData.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );
    }

    setDeductionData(updatedIncomeTotal);
    const yearIndex = currentYearData?.findIndex((item) => item?.Year === year);

    if (yearIndex !== -1) {
      const updatedYearData = [...currentYearData];
      updatedYearData[yearIndex].data.deductionData = updatedIncomeTotal;
      setCurrentYearData(updatedYearData);
    }

    const incomeTotal = updatedIncomeTotal?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalDeduction(incomeTotal);
  };
  const handleLessCreditChange = (id, value, year) => {
    const updatedIncomeTotal = currentYearData
      ?.find((item) => item?.Year === year)
      ?.data.lessCreditData?.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );

    console.log(updatedIncomeTotal);
    if (updatedIncomeTotal === undefined) {
      const updatedIncomeTotal = lessCreditData.map((item) =>
        item.id === id ? { ...item, amount: value || 0 } : item
      );
    }

    setLessCreditData(updatedIncomeTotal);
    const yearIndex = currentYearData?.findIndex((item) => item?.Year === year);

    if (yearIndex !== -1) {
      const updatedYearData = [...currentYearData];
      updatedYearData[yearIndex].data.lessCreditData = updatedIncomeTotal;
      setCurrentYearData(updatedYearData);
    }

    const incomeTotal = updatedIncomeTotal?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalDeduction(incomeTotal);
  };

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
        lessCreditData,
        perITR,
        differenceTotal,
        overAllTotal,
      },
    };

    console.log(dataStore);
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
    setconstantData(dataIncome);
    const curYear = startYear.getFullYear();
    const prevYear = curYear - 1;

    const PrevData = JSON.parse(localStorage.getItem("PREV_YEAR_DATA")) || [];
    setCurrentYearData(PrevData);

    if (PrevData) {
      const dat = PrevData.find((item) => item.Year === curYear);
      const data = PrevData.find((item) => item.Year === prevYear);
      console.log(dat, data);
      //   if (dat == undefined) {
      //     // setIsLocalData(true);
      //    return
      //  }

      setOverAll(dat?.data?.overAllTotal);
      setPrevYearData(data);
    } else {
      alert("No Data Found");
    }
  };
  const handleIncomeChangeDown = (id, value) => {
    const updatedIncomeTotal = incomeData.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    console.log(updatedIncomeTotal);

    setIncomeData(updatedIncomeTotal);

    const incomeTotal = updatedIncomeTotal.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalIncome(incomeTotal);
  };
  const handleLessCreditChangeDown = (id, value) => {
    const updatedIncomeTotal = lessCreditData.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    console.log(updatedIncomeTotal);

    setLessCreditData(updatedIncomeTotal);

    const incomeTotal = updatedIncomeTotal.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalLess(incomeTotal);
  };
  const handledeductionChangeDown = (id, value) => {
    const updatedIncomeTotal = deductionData.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    console.log(updatedIncomeTotal);

    setDeductionData(updatedIncomeTotal);

    const incomeTotal = updatedIncomeTotal.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalDeduction(incomeTotal);
  };

  useEffect(() => {
    // setconstantData(dataIncome);
    // compareData();
    const curYear = startYear.getFullYear();

    const PrevData = JSON.parse(localStorage.getItem("PREV_YEAR_DATA")) || [];
    setCurrentYearData(PrevData);
    const dat = PrevData.find((item) => item.Year === curYear);
    if (!dat) {
      setIsLocalData(false);
    } else {
      const incomeTotal = PrevData?.find(
        (i) => i.Year === curYear
      )?.data?.incomeData?.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );
      const deductionTotal = PrevData?.find(
        (i) => i.Year === curYear
      )?.data?.deductionData?.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );
      const lessTotal = PrevData?.find(
        (i) => i.Year === curYear
      )?.data?.lessCreditData?.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );
      // console.log(lessTotal);

      setTotalIncome(incomeTotal);
      setTotalDeduction(deductionTotal);
      setTotalLess(lessTotal);
      setOverAllTotal(deductionTotal + incomeTotal + lessTotal);
    }
  }, []);
  useEffect(() => {
    const tot = taxableIncome + totalPlus + totalLess;
    setOverAllTotal(tot);
    const diff = tot - perITR;
    setDifferenceTotal(diff);
    setOverAllTotal(totalDeduction + totalIncome + totalLess);
  }, [
    taxableIncome,
    totalPlus,
    totalLess,
    totalDeduction,
    perITR,
    currentYearData,
    isRTI,
  ]);

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
                      {PrevYearState ? (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  {isLocalData ? (
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
                                type="number"
                                value={item.amount}
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
                  ) : (
                    <tbody>
                      {incomeData.map((item) => (
                        <tr key={item.id}>
                          <td className="number" style={{ width: "50px" }}>
                            {item.id}
                          </td>
                          <td className="border border-collapse">
                            {item.description}
                          </td>
                          <td className="border border-collapse">
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) =>
                                handleIncomeChangeDown(
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
                  )}
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
                      {PrevYearState ? (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  {isLocalData ? (
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
                                type="number"
                                value={item.amount}
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
                  ) : (
                    <tbody>
                      {deductionData.map((item) => (
                        <tr key={item.id}>
                          <td className="number" style={{ width: "50px" }}>
                            {item.id}
                          </td>
                          <td className="border border-collapse">
                            {item.description}
                          </td>
                          <td className="border border-collapse">
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) =>
                                handledeductionChangeDown(
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
                  )}
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

                {/* plus table  */}

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
                <table className="col-12 border-collapse">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">less Credit Data</th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState ? (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  {isLocalData ? (
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
                                type="number"
                                value={item.amount}
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
                  ) : (
                    <tbody>
                      {lessCreditData.map((item) => (
                        <tr key={item.id}>
                          <td className="number" style={{ width: "50px" }}>
                            {item.id}
                          </td>
                          <td className="border border-collapse">
                            {item.description}
                          </td>
                          <td className="border border-collapse">
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) =>
                                handleLessCreditChangeDown(
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
                  )}
                  <tfoot className="">
                    {
                      <>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Estimated Tax Payable/(Refundable)
                          </td>
                          {/* <td>{overAll}</td> */}
                          <td>{overAllTotal.toFixed(2)}</td>
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
                {/* Less Credits Table */}

                {/* fott */}

                <table className="col-12 my-4 ">
                 
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
