import React, { useState } from "react";
import { Badge, Table } from "react-bootstrap";
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
      <Table striped  hover responsive>
        <thead className="">
          <tr>
             <th>VIN</th>
            <th className="d-none d-sm-table-cell">Chassis Number</th>
            <th className="d-none d-sm-table-cell">Engine Number</th>
            <th className="d-none d-sm-table-cell">Manufacturer Date</th>
            <th className="d-none d-sm-table-cell">Date In</th>
            <th className="d-none d-sm-table-cell">Model</th>
            <th className="d-none d-sm-table-cell">Version</th>
            <th className="d-none d-sm-table-cell">Color</th>
            <th className="d-none d-sm-table-cell">Fuel Type</th>
            <th className="hide-desktop">details</th>
          </tr>
        </thead>
        <tbody>
          {filteredCarStocks.map((stock, index) => (
            <tr key={index}>
               <td>{stock.vin}</td>
              <td className="d-none d-sm-table-cell">{stock.chassisNumber}</td>
              <td className="d-none d-sm-table-cell">{stock.engineNumber}</td>
              <td className="d-none d-sm-table-cell">{stock.manufacturerDate}</td>
              <td className="d-none d-sm-table-cell">{stock.dateIn}</td>
              <td className="d-none d-sm-table-cell">{stock.model}</td>
              <td className="d-none d-sm-table-cell">{stock.version}</td>
              <td className="d-none d-sm-table-cell">{stock.color}</td>
              <td className="d-none d-sm-table-cell">{stock.fuelType}</td>
              <td className="hide-desktop">
                <Badge bg="primary">details</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CarStockShow;
