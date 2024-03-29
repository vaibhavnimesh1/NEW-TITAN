import { createContext, useContext, useState } from "react";

export const DataContext = createContext();

export const useData = () => useContext(DataContext);

const Context = ({ children }) => {
  const [total, setTotal] = useState(0);
  const [clientShareTotal, setClientShareTotal] = useState(0);
  const [startDate, setStartDate] = useState(new Date());

  const [startYear, setStartYear] = useState(new Date());
  const [clientData, setClientData] = useState({
    Name: "",
    Area: "",
    Year: "",
    Date: "",
  });
  console.log("Year ", startYear);

  return (
    <DataContext.Provider
      value={{
        startYear,
        setStartYear,
        startDate,
        setStartDate,
        clientData,
        setClientData,
        total,
        setTotal,
        clientShareTotal,
        setClientShareTotal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default Context;
