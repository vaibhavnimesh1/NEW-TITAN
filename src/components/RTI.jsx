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

const RTI = ({ isRTI, setIsRTI }) => {
  const [currentYearData, setCurrentYearData] = useState([]);
  // console.log(currentYearData);
  const { clientData, startDate, startYear } = useData();
  const [incomeData, setIncomeData] = useState(dataIncome);
  const [deductionData, setDeductionData] = useState(dataDeduction);
  const [lessCreditData, setLessCreditData] = useState(dataLessCredit);
  const [plusData, setPlusData] = useState(dataPlus);
  // console.log(lessCreditData);
  const [perITR, setPerITR] = useState(0);

  // console.log(incomeData?.some((item) => item.amount == ""));

  // console.log(deductionData);
  const [PrevYearState, setPrevYearState] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalLess, setTotalLess] = useState(0);
  const [totalPlus, setTotalPlus] = useState(0);
  const [overAllTotal, setOverAllTotal] = useState(0);
  const [differenceTotal, setDifferenceTotal] = useState(0);

  const [totalDeduction, setTotalDeduction] = useState(0);
  const [prevYearData, setPrevYearData] = useState([]);
  // console.log(prevYearData);

  const taxableIncome = totalDeduction + totalIncome;

  useEffect(() => {
    const tot = taxableIncome + totalPlus + totalLess;
    setOverAllTotal(tot);

    const diff = tot - perITR;
    setDifferenceTotal(diff);
  }, [taxableIncome, totalPlus, totalLess, perITR]);

  useEffect(() => {
    console.log("hh");
  }, [currentYearData]);

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

  const handlePrevYearPlusChange = (id, value) => {
    console.log(id, value);
    const updatedPlusData = prevYearData?.data?.plusData?.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    console.log(updatedPlusData);
    console.log(prevYearData);
    const data = prevYearData;
    data.data.plusData = updatedPlusData;
    console.log(data.data.plusData);
    setPrevYearData(data);
    // setPrevYearData((prevData) => ({
    //   ...prevData,
    //   data: {
    //     ...prevData.data,
    //     plusData: updatedPlusData,
    //   },
    // }));
  };

  const handlePlusChange = (id, value) => {
    console.log(" id ", id);
    console.log(" value ", value);
    const updatedPlusData = plusData?.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    setPlusData(updatedPlusData);

    const lessTotal = updatedPlusData?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalPlus(lessTotal);
  };

  const handleLessCreditChange = (id, value) => {
    const updatedLessCredit = lessCreditData?.map((item) =>
      item.id === id ? { ...item, amount: value || 0 } : item
    );
    setLessCreditData(updatedLessCredit);

    const lessTotal = updatedLessCredit?.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    setTotalLess(lessTotal);
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
    // const emptyCondition = dataStore.data?.incomeData?.some(
    //   (item) => item.amount != ""
    // );
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
    // if (emptyCondition) {
    // } else {
    //   alert("All input field are empty!!!");
    // }
  };

  const compareData = () => {
    const curYear = startYear.getFullYear();
    const prevYear = curYear - 1;

    const PrevData = JSON.parse(localStorage.getItem("PREV_YEAR_DATA")) || [];
    // console.log(PrevData);

    setCurrentYearData(PrevData);

    if (PrevData) {
      const data = PrevData.find((item) => item.Year === prevYear);
      setPrevYearData(data);
    } else {
      alert("No Data Found");
    }
  };
  const handlePerITRChange = (value) => {
    const newValue = parseFloat(value);
    setPerITR(isNaN(newValue) ? "" : newValue);
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
              {/* headinig  */}

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
              {/* headinig  */}

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
                    {PrevYearState === true
                      ? currentYearData
                          .find((item) => item.Year === startYear.getFullYear())
                          ?.data?.incomeData?.map((item) => (
                            <tr key={item.id}>
                              <td className="number" style={{ width: "50px" }}>
                                {item.id}
                              </td>
                              <td className="border border-collapse">
                                {item?.description}
                              </td>
                              <td className="border border-collapse">
                                <input
                                  type="number"
                                  value={item.amount}
                                  placeholder="..."
                                  onChange={(e) =>
                                    handleDeductionChange(
                                      item.id,
                                      e.target.value
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
                          ))
                      : incomeData?.map((item) => (
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
                      {PrevYearState && (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {PrevYearState === true
                      ? currentYearData
                          .find((item) => item.Year === startYear.getFullYear())
                          ?.data?.deductionData?.map((item) => (
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
                                    handleDeductionChange(
                                      item.id,
                                      e.target.value
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
                          ))
                      : deductionData?.map((item) => (
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
                        Taxable Income
                      </td>
                      <td>{taxableIncome.toFixed(2)}</td>
                      {PrevYearState && (
                        <td>{prevYearData?.data?.taxableIncome}</td>
                      )}
                    </tr>
                  </tfoot>
                </table>
                {/* deduction table */}

                {/* plus table
                 */}
                <table className="col-12 border-collapse mt-4">
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
                    {PrevYearState === true
                      ? currentYearData
                          .find((item) => item.Year === startYear.getFullYear())
                          .data?.plusData?.map((item) => (
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
                                    handlePrevYearPlusChange(
                                      item.id,
                                      e.target.value
                                    )
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
                          ))
                      : plusData?.map((item) => (
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
                                  handlePlusChange(item.id, e.target.value)
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
                </table>
                {/* plus table */}

                {/* Less Credits Table */}
                <table className="col-12 border-collapse mt-4">
                  <thead>
                    <tr>
                      <th className="id" style={{ width: "50px" }}>
                        ID
                      </th>
                      <th className="col-6 ">Less Credits </th>
                      <th className="col-3 ">{format(startYear, "yyyy")}</th>
                      {PrevYearState && (
                        <th className="col-3 ">{prevYearData?.Year}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {PrevYearState === true
                      ? currentYearData
                          .find((item) => item.Year === startYear.getFullYear())
                          .data?.lessCreditData?.map((item) => (
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
                                    handleLessCreditChange(
                                      item.id,
                                      e.target.value
                                    )
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
                          ))
                      : lessCreditData?.map((item) => (
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
                                  handleLessCreditChange(
                                    item.id,
                                    e.target.value
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

                <table className="col-12">
                  <tfoot className="">
                    {prevYearData ? (
                      <>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Estimated Tax Payable/(Refundable)
                          </td>
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
                            <td>{prevYearData?.data?.perITR}</td>
                          )}
                        </tr>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Difference
                          </td>
                          <td>{differenceTotal.toFixed(2)}</td>
                          {PrevYearState && <td>4</td>}
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Estimated Tax Payable/(Refundable)
                          </td>
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
                            <td>{prevYearData?.data?.perITR}</td>
                          )}
                        </tr>
                        <tr>
                          <td colSpan={2} className="fs-5">
                            Difference
                          </td>
                          <td>{differenceTotal.toFixed(2)}</td>
                          {PrevYearState && <td>4</td>}
                        </tr>
                      </>
                    )}
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

export default RTI;
