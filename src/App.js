import logo from "./logo.svg";
import { useState } from "react";

const mock = [
  {
    companyCode: "001",
    companyName: "Tata consultancy",
    stockDetails: [
      {
        price: 100,
        date: "07/06/2021",
        time: "10.10",
      },
      {
        price: 101,
        date: "07/05/2021",
        time: "10.10",
      },
      {
        price: 102,
        date: "07/05/2021",
        time: "10.10",
      },
    ],
  },
  {
    companyCode: "002",
    companyName: "CTS",
    stockDetails: [
      {
        price: 55,
        date: "06/06/2021",
        time: "10.10",
      },
      {
        price: 56,
        date: "06/05/2021",
        time: "10.10",
      },
      {
        price: 57,
        date: "06/05/2021",
        time: "10.10",
      },
    ],
  },
];

const getAverage = (stockDetails) => {
  const priceList = stockDetails.map(data => Number(data.price));
  const sum = priceList.reduce((a, b) => a + b, 0);
  const avg = (sum / priceList.length) || 0;
  return avg;
}

function App() {
  const [selectedValue, setSelectedValue] = useState("default");
  console.log("selectedValue:", selectedValue);

  const onSelectChange = (params) => {
    console.log("changed", params.target.value);
    setSelectedValue(params.target.value);
  };




  return (
    <div>
      <div>
        <img src={logo} alt="company log" width="55px" height="55px" />

        <select onChange={onSelectChange}>
          <option value="default">please select company</option>
          {mock.map((data, index) => {
            return (
              <option key={data.companyCode} value={index}>
                {data.companyName}
              </option>
            );
          })}
        </select>

        <input type="text" />
        <button type="button">Search</button>
      </div>
      <div>
        <p>
          Company Code:{" "}
          <span>
            {selectedValue === "default"
              ? ""
              : `${mock[selectedValue].companyCode}`}
          </span>{" "}
        </p>
        <p>
          Company Name:{" "}
          <span>
            {selectedValue === "default"
              ? ""
              : `${mock[selectedValue].companyName}`}
          </span>{" "}
        </p>
      </div>
      <div>
        <label htmlFor="fromDateId">From: </label>
        <input type="date" id="fromDateId" />
        <label htmlFor="toDateId">To: </label>
        <input type="date" id="toDateId" />
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Stock Price</th>
              <th>Date(DD/MM/YYYY)</th>
              <th>Time(HH:MM)</th>
            </tr>
          </thead>
          <tbody>
            {selectedValue !== "default" &&
              mock[selectedValue].stockDetails.map((data, index) => {
                return (
                  <tr key={index.toString()}>
                    <td>{data.price}</td>
                    <td>{data.date}</td>
                    <td>{data.time}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {selectedValue !== "default" && (
        <div>
          <p>
            MIN:{" "}
            <span>
              {Math.min.apply(
                null,
                mock[selectedValue].stockDetails.map((item) => item.price)
              )}
            </span>
          </p>
          <p>
            MAX:{" "}
            <span>
              {Math.max.apply(
                null,
                mock[selectedValue].stockDetails.map((item) => item.price)
              )}
            </span>
          </p>
          <p>
            AVG:{" "}
            <span>
              {getAverage(mock[selectedValue].stockDetails)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
