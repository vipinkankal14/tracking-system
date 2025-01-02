import React, { useState } from "react";
import { Table } from "react-bootstrap";
import "./scss/CarStockShow.scss"; // Make sure SCSS file is correctly imported

const CarStockShow = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const carStocks = [
    {
      vin: "1HGCM82633A123456",
      chassisNumber: "CHS123456789",
      engineNumber: "ENG987654321",
      manufacturerDate: "2024-01-15",
      dateIn: "2024-01-20",
      model: "Civic",
      version: "EX",
      color: "Red",
      fuelType: "Petrol",
    },
    {
      vin: "WBA1K520XEV123789",
      chassisNumber: "CHS987654321",
      engineNumber: "ENG123456789",
      manufacturerDate: "2023-12-10",
      dateIn: "2024-01-05",
      model: "BMW 1 Series",
      version: "Sport",
      color: "Black",
      fuelType: "Diesel",
    },
  ];

  const filteredCarStocks = carStocks.filter((stock) =>
    Object.values(stock).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <h4 className="text-center my-4"> CAR STOCK DETAILS</h4>
      <div className="d-flex justify-content-center justify-content-md-start">
        <div className="mb-4 input-container">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>VIN</th>
            <th>Chassis Number</th>
            <th>Engine Number</th>
            <th>Manufacturer Date</th>
            <th>Date In</th>
            <th>Model</th>
            <th>Version</th>
            <th>Color</th>
            <th>Fuel Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredCarStocks.map((stock, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{stock.vin}</td>
              <td>{stock.chassisNumber}</td>
              <td>{stock.engineNumber}</td>
              <td>{stock.manufacturerDate}</td>
              <td>{stock.dateIn}</td>
              <td>{stock.model}</td>
              <td>{stock.version}</td>
              <td>{stock.color}</td>
              <td>{stock.fuelType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CarStockShow;
