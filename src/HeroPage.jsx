import { useState, useEffect, useContext } from "react";

import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { CSVLink } from "react-csv";
import ReactDatePicker from "react-datepicker";
import { useData } from "./context/context";
import Interview from "./components/Interview";
import RTI from "./components/RTI";

const HeroPage = () => {
  const { total, clientShareTotal } = useData();
  // const yera = new date().getFullYear()

  const {
    startYear,
    setStartYear,
    startDate,
    setStartDate,
    clientData,
    setClientData,
  } = useData();
  console.log("year in hero ", startYear);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isInterview, setIsInterview] = useState(false);
  const [isRTI, setIsRTI] = useState(false);

  const handleInputChange = (e, inputName) => {
    const { value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [inputName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditMode(false);
  };

  const toggleInterviewNotes = () => {
    setIsInterview(true);
    setIsRTI(false);
  };
  const toggleRTI = () => {
    setIsRTI(true);
    setIsInterview(false);
  };

  const csvData = [
    ["", "INTERVIEW", "NOTES", ""],
    [" ", "", "", " "],
    ["Description", "Ref", "Total", "Client share"],

    ["Total", " ", total, clientShareTotal],
  ];
const handleStartDate=(startYear)=>{
  setStartYear(new Date(startYear))
  // console.log();
}
  return (
    <>
      <div className="container position-relative">
        <div className="row mt-2">
          <h1>Client Profile</h1>

          <p>
            Lorem ipsum dolor sit amet consectetur Adipisicing elit.
            Perferendis, sint!
          </p>
          <div className="col-12 mt-5">
            <div className="row col-12 gap-2 d-flex bg-light p-3 rounded justify-content-between">
              <div className="col-4 left d-flex flex-column justify-content-between p-0">
                <div className="name">
                  <h1>{clientData.Name}</h1>
                  <p>Developer</p>
                  <p>Jnx@mail.com</p>
                </div>

                <button>
                  {" "}
                  <CSVLink
                    data={csvData}
                    className=" text-light "
                    onClick={() => {}}
                  >
                    {" "}
                    Export Data{" "}
                  </CSVLink>
                </button>
              </div>

              {/* Input section */}
              <div className="col-7 right   position-relative ">
                <span className="edit-btn fs-3">
                  <button
                    className="btn   btn-warning edit"
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit
                  </button>
                  <button className="btn  btn-success" onClick={handleSubmit}>
                    Submit
                  </button>
                </span>
                <form>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      Client
                      <span className="">
                        <input
                          type="text"
                          placeholder="Enter client name.."
                          disabled={!isEditMode}
                          value={clientData.Name}
                          onChange={(e) => handleInputChange(e, "Name")}
                        />
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      Area
                      <span className="">
                        <input
                          type="text"
                          placeholder="Enter area.."
                          disabled={!isEditMode}
                          value={clientData.Area}
                          onChange={(e) => handleInputChange(e, "Area")}
                        />
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      Date
                      <span className="">
                        <ReactDatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MM/dd"
                          disabled={!isEditMode}
                          value={startDate}
                        />
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                      Year
                      <span className="">
                        <ReactDatePicker
                          // defaultValue={startYear}
                          value={startYear}
                          selected={startYear}
                          onChange={(startYear) =>handleStartDate(startYear)}
                          showYearPicker
                          dateFormat="yyyy"
                        />
                      </span>
                    </li>
                  </ul>
                </form>
              </div>
            </div>
            {/* Input section */}
          </div>
        </div>

        <div className="col btn  gx-4  lower-btn">
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#staticBackdrop"
            aria-controls="staticBackdrop"
            className=" m-2 "
            onClick={toggleInterviewNotes}
          >
            Create Interview
          </button>
          <button
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#staticBackdrop"
            aria-controls="staticBackdrop"
            className=" m-2 "
            onClick={toggleRTI}
          >
            RTI
          </button>
        </div>
        {isRTI ? <RTI isRTI={isRTI} setIsRTI={setIsRTI} /> : ""}
        {isInterview ? (
          <Interview
            isInterview={isInterview}
            setIsInterview={setIsInterview}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default HeroPage;
