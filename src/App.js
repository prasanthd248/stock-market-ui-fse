import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Logo } from "./logo.svg";
import "./App.css";

let allCompanyDetailsCache = [];
let stockDetailsCache = [];

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
            const filteredStocks = stockDetailsCache.filter((stock) => {
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
                    stockDetailsCache = data;
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }, [allCompanyDetails, selectedValue]);

    return (
        <>
            <header>
                <div className="stock-header-section">
                    <div className="stock-main-container stock-header-footer-section-content">
                        <div className="stock-logo-section">
                            <Logo width="50px" height="50px" />
                            <span className="stock-header-text">
                                Stock Dashboard
                            </span>
                        </div>

                        <div className="stock-search">
                            <input type="text" ref={searchInputRef} />
                            <button
                                className="stock-btn"
                                type="button"
                                onClick={onSearchClick}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="stock-main-container">
                    <div className="stock-details-section">
                        <fieldset>
                            <legend>Company Details</legend>
                            <label htmlFor="company-details">
                                Select a company:{" "}
                                <select
                                    id="company-details"
                                    onChange={onSelectChange}
                                >
                                    <option value="default">
                                        Please select company
                                    </option>
                                    {allCompanyDetails.map((data, index) => {
                                        return (
                                            <option
                                                key={data.companyCode}
                                                value={index}
                                            >
                                                {data.companyName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>
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
                        </fieldset>
                    </div>
                    <div className="stock-details-section">
                        <fieldset>
                            <legend>Date Filter</legend>
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
                                className="stock-btn-1"
                            >
                                Filter Stocks
                            </button>
                        </fieldset>
                    </div>
                    <div className="stock-details-section">
                        <fieldset>
                            <legend>Stock Details</legend>
                            {selectedValue !== "default" &&
                            !!stockDetails.length ? (
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
                                                stockDetails.map(
                                                    (data, index) => {
                                                        return (
                                                            <tr
                                                                key={index.toString()}
                                                            >
                                                                <td>
                                                                    {data.price}
                                                                </td>
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
                                                    }
                                                )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th scope="row" colSpan="1">
                                                    MIN:
                                                </th>
                                                <td colSpan="1">
                                                    {Math.min.apply(
                                                        null,
                                                        stockDetails.map(
                                                            (item) => item.price
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" colSpan="1">
                                                    MAX:
                                                </th>
                                                <td colSpan="1">
                                                    {Math.max.apply(
                                                        null,
                                                        stockDetails.map(
                                                            (item) => item.price
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" colSpan="1">
                                                    AVG:
                                                </th>
                                                <td colSpan="1">
                                                    {getAverage(stockDetails)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ) : (
                                <div>No stocks data available!</div>
                            )}
                        </fieldset>
                    </div>
                </div>
            </main>
            <footer>
                <div className="stock-footer-section">
                    <div className="stock-main-container stock-header-footer-section-content"></div>
                </div>
            </footer>
        </>
    );
}

export default App;
