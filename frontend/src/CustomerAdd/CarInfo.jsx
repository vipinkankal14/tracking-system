import React, { useState, useEffect } from "react";
import "./scss/page.scss";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const CarInfo = ({ data, updateData }) => {
  const [carStocks, setCarStocks] = useState([]);
  const [dropdownState, setDropdownState] = useState({
    teamLeader: false,
    teamMember: false,
    model: false,
    version: false,
    color: false,
    carType: false,
  });

  // Fetch car stocks data
  useEffect(() => {
    fetch("http://localhost:5000/api/showAllCarStocks") // Example API endpoint
      .then((response) => response.json())
      .then((data) => setCarStocks(data))
      .catch((error) => console.error("Error fetching car stocks:", error));
  }, []);

  const toggleDropdown = (dropdownName) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  const handleChange = (name, value) => {
    updateData(name, value);

    // Auto-populate prices when all selections are made
    if (["carType", "model", "version", "color"].includes(name)) {
      const selectedCar = carStocks.find(
        (stock) =>
          stock.carType === (name === "carType" ? value : data.carType) &&
          stock.model === (name === "model" ? value : data.model) &&
          stock.version === (name === "version" ? value : data.version) &&
          stock.color === (name === "color" ? value : data.color)
      );

      if (selectedCar) {
        updateData("exShowroomPrice", selectedCar.exShowroomPrice || "");
        updateData("bookingAmount", selectedCar.bookingAmount || "");

        updateData("cardiscount", selectedCar.cardiscount || "");
      } else {
        updateData("exShowroomPrice", "");
        updateData("bookingAmount", "");
        updateData("cardiscount", "");
      }
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      {/* Dealership Advisor */}
      <div className="row g-3">
        <h6>Dealership Advisor</h6>
        {/* Team Leader */}
        <div className="col-md-3">
          <label htmlFor="teamLeader">Team Leader</label>
          <div className="dropdown-wrapper">
            <select
              className="form-control input-underline input-margin"
              id="teamLeader"
              value={data.teamLeader}
              onChange={(e) => handleChange("teamLeader", e.target.value)}
              onClick={() => toggleDropdown("teamLeader")}
              required
            >
              <option value="">Select Team Leader</option>
              <option value="leader1">Leader 1</option>
              <option value="leader2">Leader 2</option>
              <option value="leader3">Leader 3</option>
            </select>
            {dropdownState.teamLeader ? (
              <KeyboardArrowUpOutlinedIcon />
            ) : (
              <KeyboardArrowDownOutlinedIcon />
            )}
          </div>
        </div>

        {/* Team Member */}
        <div className="col-md-3">
          <label htmlFor="teamMember">Team Member</label>
          <div className="dropdown-wrapper">
            <select
              className="form-control input-underline input-margin"
              id="teamMember"
              value={data.teamMember}
              onChange={(e) => handleChange("teamMember", e.target.value)}
              onClick={() => toggleDropdown("teamMember")}
              required
            >
              <option value="">Select Team Member</option>
              <option value="member1">Member 1</option>
              <option value="member2">Member 2</option>
              <option value="member3">Member 3</option>
            </select>
            {dropdownState.teamMember ? (
              <KeyboardArrowUpOutlinedIcon />
            ) : (
              <KeyboardArrowDownOutlinedIcon />
            )}
          </div>
        </div>
      </div>

      {/* Car Details */}
      <div className="row g-2">
        <h6>Choose Your Car</h6>

        {/* Car Type */}
        <div className="col-md-2">
          <label htmlFor="carType">Car Type</label>
          <select
            className="form-control input-underline input-margin"
            id="carType"
            value={data.carType}
            onChange={(e) => handleChange("carType", e.target.value)}
            required
          >
            <option value="">Select Car Type</option>
            {[...new Set(carStocks.map((stock) => stock.carType))].map(
              (carType, index) => (
                <option key={index} value={carType}>
                  {carType}
                </option>
              )
            )}
          </select>
        </div>

        {/* Model */}
        <div className="col-md-2">
          <label htmlFor="model">Model</label>
          <select
            className="form-control input-underline input-margin"
            id="model"
            value={data.model}
            onChange={(e) => handleChange("model", e.target.value)}
            required
            disabled={!data.carType}
          >
            <option value="">Select Model</option>
            {carStocks
              .filter((stock) => stock.carType === data.carType)
              .map((filteredStock, index) => (
                <option key={index} value={filteredStock.model}>
                  {filteredStock.model}
                </option>
              ))}
          </select>
        </div>

        {/* Version */}
        <div className="col-md-2">
          <label htmlFor="version">Version</label>
          <select
            className="form-control input-underline input-margin"
            id="version"
            value={data.version}
            onChange={(e) => handleChange("version", e.target.value)}
            required
            disabled={!data.model}
          >
            <option value="">Select Version</option>
            {carStocks
              .filter(
                (stock) =>
                  stock.carType === data.carType &&
                  stock.model === data.model
              )
              .map((filteredStock, index) => (
                <option key={index} value={filteredStock.version}>
                  {filteredStock.version}
                </option>
              ))}
          </select>
        </div>

        {/* Color */}
        <div className="col-md-2">
          <label htmlFor="color">Color</label>
          <select
            className="form-control input-underline input-margin"
            id="color"
            value={data.color}
            onChange={(e) => handleChange("color", e.target.value)}
            required
            disabled={!data.version}
          >
            <option value="">Select Color</option>
            {carStocks
              .filter(
                (stock) =>
                  stock.carType === data.carType &&
                  stock.model === data.model &&
                  stock.version === data.version
              )
              .map((filteredStock, index) => (
                <option key={index} value={filteredStock.color}>
                  {filteredStock.color}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="row g-2">
        <h6>Your Chosen Car Price</h6>

        <div className="col-md-2">
          <label htmlFor="exShowroomPrice">Ex-Showroom Price</label>
          <input
            type="number"
            className="form-control input-underline input-margin"
            id="exShowroomPrice"
            value={data.exShowroomPrice}
            readOnly
          />
        </div>

        <div className="col-md-2">
          <label htmlFor="bookingAmount">Booking Amount</label>
          <input
            type="number"
            className="form-control input-underline input-margin"
            id="bookingAmount"
            value={data.bookingAmount}
            readOnly
          />
        </div>

      </div>
    </div>
  );
};

export default CarInfo;
