import React from "react";
import { Table } from "react-bootstrap";

const CarStockShow = () => {
  // Sample hardcoded data for the table
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

  return (
    <div className="car-stock-show">
      <h4 className="text-center my-4">Car Stock Details</h4>
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
          {carStocks.map((stock, index) => (
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
    </div>
  );
};

export default CarStockShow;
