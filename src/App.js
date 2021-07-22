import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";

let allCompanyDetailsCache = [];

const getAverage = (stockDetails) => {
    const priceList = stockDetails.map((data) => Number(data.price));
    const sum = priceList.reduce((a, b) => a + b, 0);
    return sum / priceList.length || 0;
};

const getFormattedDate = (datetimestamp) => {
    return new Date(datetimestamp).toLocaleDateString();
};

const getFormattedTime = (datetimestamp) => {
    return new Date(datetimestamp).toLocaleTimeString(navigator.language, {
        hour: "2-digit",
        minute: "2-digit",
    });
};

function App() {
    const [selectedValue, setSelectedValue] = useState("default");
    const [allCompanyDetails, setAllCompanyDetails] = useState([]);
    const [stockDetails, setStockDetails] = useState([]);
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    const searchInputRef = useRef(null);

    const onSelectChange = (e) => {
        setSelectedValue(e.target.value);
        setMinDate("");
        setMaxDate("");
    };

    const onSearchClick = () => {
        const searchValue = searchInputRef.current.value;
        const searchIndex = allCompanyDetailsCache.findIndex(
            (eachCompany) =>
                eachCompany.companyCode.toLowerCase() ===
                searchValue.toLowerCase()
        );
        if (searchIndex !== -1) {
            setSelectedValue(searchIndex);
            setMinDate("");
            setMaxDate("");
        }
    };

    const onMinDateChange = (e) => {
        setMinDate(e.target.value);
    };

    const onMaxDateChange = (e) => {
        setMaxDate(e.target.value);
    };

    const onFilterClick = () => {
        if (
            selectedValue !== "default" &&
            !!stockDetails.length &&
            minDate &&
            maxDate
        ) {
            const filteredStocks = stockDetails.filter((stock) => {
                const stockDate = new Date(getFormattedDate(stock.date));
                const minDateObj = new Date(getFormattedDate(minDate));
                const maxDateObj = new Date(getFormattedDate(maxDate));
                return stockDate >= minDateObj && stockDate <= maxDateObj;
            });
            setStockDetails(filteredStocks);
        }
    };

    useEffect(() => {
        fetch("http://3.108.217.203:8080/api/v1.0/market/company/getall")
            .then((response) => response.json())
            .then((data) => {
                setAllCompanyDetails(data);
                allCompanyDetailsCache = data;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    useEffect(() => {
        if (selectedValue !== "default") {
            fetch(
                `http://3.108.217.203:8080/api/v1.0/market/stock/infoStock?companyCode=${allCompanyDetails[selectedValue].companyCode}`
            )
                .then((response) => response.json())
                .then((data) => {
                    setStockDetails(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [allCompanyDetails, selectedValue]);

    return (
        <div>
            <div>
                <img src={logo} alt="company log" width="55px" height="55px" />

                <select onChange={onSelectChange}>
                    <option value="default">please select company</option>
                    {allCompanyDetails.map((data, index) => {
                        return (
                            <option key={data.companyCode} value={index}>
                                {data.companyName}
                            </option>
                        );
                    })}
                </select>

                <input type="text" ref={searchInputRef} />
                <button type="button" onClick={onSearchClick}>
                    Search
                </button>
            </div>
            <div>
                <p>
                    Company Code:{" "}
                    <span>
                        {selectedValue === "default"
                            ? ""
                            : `${allCompanyDetails[selectedValue].companyCode}`}
                    </span>{" "}
                </p>
                <p>
                    Company Name:{" "}
                    <span>
                        {selectedValue === "default"
                            ? ""
                            : `${allCompanyDetails[selectedValue].companyName}`}
                    </span>{" "}
                </p>
            </div>
            <div>
                <label htmlFor="fromDateId">From: </label>
                <input
                    type="date"
                    id="fromDateId"
                    value={minDate}
                    onChange={onMinDateChange}
                />
                <label htmlFor="toDateId">To: </label>
                <input
                    type="date"
                    id="toDateId"
                    min={minDate}
                    value={maxDate}
                    onChange={onMaxDateChange}
                />
                <button
                    disabled={!(minDate && maxDate)}
                    type="button"
                    onClick={onFilterClick}
                >
                    Filter Stocks
                </button>
            </div>
            {selectedValue !== "default" && !!stockDetails.length ? (
                <>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Stock Price</th>
                                    <th>Date(MM/DD/YYYY)</th>
                                    <th>Time(HH:MM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedValue !== "default" &&
                                    stockDetails.map((data, index) => {
                                        return (
                                            <tr key={index.toString()}>
                                                <td>{data.price}</td>
                                                <td>
                                                    {getFormattedDate(
                                                        data.date
                                                    )}
                                                </td>
                                                <td>
                                                    {getFormattedTime(
                                                        data.date
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <p>
                            MIN:{" "}
                            <span>
                                {Math.min.apply(
                                    null,
                                    stockDetails.map((item) => item.price)
                                )}
                            </span>
                        </p>
                        <p>
                            MAX:{" "}
                            <span>
                                {Math.max.apply(
                                    null,
                                    stockDetails.map((item) => item.price)
                                )}
                            </span>
                        </p>
                        <p>
                            AVG: <span>{getAverage(stockDetails)}</span>
                        </p>
                    </div>
                </>
            ) : (
                <div>No stocks data available!</div>
            )}
        </div>
    );
}

export default App;
