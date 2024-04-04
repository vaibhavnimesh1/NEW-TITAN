import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useData } from "../context/context";

const Interview = ({ isInterview, setIsInterview }) => {
  const { setClientShareTotal, total, setTotal, clientShareTotal } = useData();
  const { clientData, startDate, selectedDate } = useData();
  console.log(selectedDate);
  const [rows, setRows] = useState([["", "", "", ""]]);

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("tableData");
    if (data) {
      setRows(JSON.parse(data));
    }

    const savedLinks = localStorage.getItem("links");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const handleAddLink = () => {
    let formattedLink = newLink.trim();
    if (!formattedLink.startsWith("http://")) {
      formattedLink = "http://" + formattedLink;
    }

    if (formattedLink === "http://") {
      alert("Please enter a valid link.");
    } else {
      setLinks([...links, formattedLink]);
      setNewLink("");
    }
  };

  const handleSaveLink = (link) => {
    window.open(link, "_blank");
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;

    if (colIndex === 2 || colIndex === 3) {
      const columnTotal = newRows.reduce((total, row) => {
        const cellValue = parseFloat(row[colIndex]);
        return isNaN(cellValue) ? total : total + cellValue;
      }, 0);

      if (colIndex === 2) {
        setTotal(columnTotal.toFixed(2));
      } else if (colIndex === 3) {
        setClientShareTotal(columnTotal.toFixed(2));
      }
    }

    setRows(newRows);
  };
  const submitData = () => {
    const filteredRows = rows.filter((row) => row.some((cell) => cell !== ""));

    if (filteredRows.length === 0) {
      alert("Write something!!!");
      return;
    }

    localStorage.setItem("interviewTable", JSON.stringify(filteredRows));

    console.log("submitted");
    alert("Data is submitted");
  };

  const addRow = () => {
    const newRow = ["", "", "", ""];
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = () => {
    if (rows.length > 0) {
      setRows((prevRows) => prevRows.slice(0, -1));
    }
  };

  console.log(rows);
  return (
    <div className="row col-12 mt-5 lower bg-light py-4 px-2 position-relative  ">
      <div
        className={`offcanvas offcanvas-start  ${isInterview ? "show" : ""}`}
        data-bs-backdrop="static"
        tabIndex="-1"
        id="staticBackdrop"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-center" id="staticBackdropLabel">
            Interview Notes
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setIsInterview(false)}
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
                    <td>{format(selectedDate, "yyyy")}</td>
                    <th>Manager Review</th>
                    <td>No</td>
                  </tr>
                  <tr className="col-3">
                    <th scope="row">Date :</th>

                    <td>{format(startDate.toString(), "MM/dd")}</td>

                    <th>Partner Review</th>
                    <td colSpan="2">No</td>
                  </tr>
                </tbody>
              </table>

              {/* inner-table-data */}

              <table className="col-12 add-section">
                <thead className="col-12">
                  <tr>
                    <th colSpan="1">Description</th>
                    <th>Ref</th>
                    <th>Total</th>
                    <th>Client share</th>
                  </tr>
                </thead>
                <tbody className="col-12 data-body">
                  {rows.length === 0 ? (
                    <tr>
                      <td>
                        <textarea
                          value=""
                          onChange={(e) => updateCell(0, 0, e.target.value)}
                          placeholder="Enter Des.."
                        />
                      </td>
                      <td>
                        <textarea
                          value=""
                          onChange={(e) => updateCell(0, 1, e.target.value)}
                          placeholder="Enter Ref"
                        />
                      </td>
                      <td>
                        <textarea
                          value=""
                          onChange={(e) => {
                            updateCell(0, 2, e.target.value);
                          }}
                          placeholder="Enter Total"
                        />
                      </td>
                      <td>
                        <textarea
                          value=""
                          onChange={(e) => {
                            if (isNaN(e.target.value)) return;
                            updateCell(0, 3, e.target.value);
                          }}
                          placeholder="Enter Client Share"
                        />
                      </td>
                    </tr>
                  ) : (
                    rows?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((data, colIndex) => (
                          <td key={colIndex} className="p-0">
                            <textarea
                              value={data}
                              onChange={(e) => {
                                {
                                  updateCell(
                                    rowIndex,
                                    colIndex,
                                    e.target.value
                                  );
                                }
                              }}
                              placeholder="Enter data"
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2">Total</td>
                    <td>{total}</td>
                    <td>{clientShareTotal}</td>
                  </tr>
                </tfoot>
              </table>

              {/* inner-table-data */}

              <div className="d-flex gap-2 mt-5">
                <button className="btn bg-primary" onClick={addRow}>
                  Add Row
                </button>
                <button className="btn bg-danger py-0" onClick={deleteRow}>
                  Delete Row
                </button>
                <button className="btn bg-warning py-0" onClick={submitData}>
                  Submit Data
                </button>

                <div className="d-flex gap-2  link-add ">
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="Enter link"
                  />
                  <button className="btn bg-success" onClick={handleAddLink}>
                    Save Link
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              {links.map((link, index) => (
                <button
                  key={index}
                  className="btn btn-primary me-2 mb-2"
                  onClick={() => handleSaveLink(link)}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
