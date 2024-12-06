import React, { useState } from 'react';
import DonutChart from './Chart';
import './Sidebar.css';
import batteryIcon from "../img/batteryIcon.svg";
import sendIcon from "../img/sendIcon.svg";
import truck from "../img/truck-icon.svg";
import truckrunning from "../img/truck-icon1.svg";
import truckstop from "../img/truck-icon2.svg";
import truckidle from "../img/truck-icon3.svg";
import truckoffline from "../img/truck-icon4.svg";

function Sidebar({ allData, showData, setShowData, setActiveCategory, activeCategory, chartData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10; 

  const totalPages = Math.ceil(showData.length / itemsPerPage) || 1;

  const categoryColors = {
    all: '#FF0000',
    running: '#36A2EB',
    stop: '#FF6384',
    idle: '#FF9F40',
    offline: '#4BC0C0',
  };

  const activeColor = categoryColors[activeCategory] || '#FF0000';

  const categoryIcons = {
    all: truck,
    running: truckrunning,
    stop: truckstop,
    idle: truckidle,
    offline: truckoffline,
  };

  const activeIcon = categoryIcons[activeCategory] || truck;

  const paginatedData = showData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (category) => {
    setActiveCategory(category);

    if (category === 'all') {
      const allVehicles = [
        ...(allData.RUNNING || []),
        ...(allData.STOP || []),
        ...(allData.IDLE || []),
        ...(allData.OFFLINE || []),
      ];
      setShowData(allVehicles);
    } else {
      setShowData(allData[category.toUpperCase()] || []);
    }

    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      handleFilterChange(activeCategory);
    } else {
      const filteredData = showData.filter(vehicle => {
        const vehicleId = vehicle.id ? vehicle.id.toString().toLowerCase() : '';
        return vehicleId.includes(query);
      });
      setShowData(filteredData);
    }

    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-buttons-container">
        <button
          className={`sidebar-button all ${activeCategory === 'all' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`sidebar-button running ${activeCategory === 'running' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('running')}
        >
          Running
        </button>
        <button
          className={`sidebar-button stop ${activeCategory === 'stop' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('stop')}
        >
          Stop
        </button>
        <button
          className={`sidebar-button idle ${activeCategory === 'idle' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('idle')}
        >
          Idle
        </button>
        <button
          className={`sidebar-button offline ${activeCategory === 'offline' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('offline')}
        >
          Offline
        </button>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by Vehicle ID"
        value={searchQuery}
        onChange={handleSearch}
      />

      <DonutChart data={chartData.filter(item => activeCategory === 'all' || item.name.toLowerCase() === activeCategory)} />

      <div className="vehicle-details-container">
        <h3>Vehicle Details</h3>
        <div className="vehicle-grid">
          {paginatedData.map((vehicle, index) => (
            <div key={index} className="vehicle-item" style={{borderBottomColor : activeColor}}>
              <div style={{height : "47px", width : "90px"}}>
                <img src={activeIcon} alt="Truck Icon" style={{ width: '100%', height: '100%' }} />
              </div>
              <div>
                <p><strong>ID:</strong> {vehicle.id}</p>
                <p><strong>Status:</strong> {vehicle.status}</p>
              </div>
              <div style={{display : 'grid', gridTemplateColumns : "repeat(2, 2fr)"}}>
                <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '20px' }}></i>
                <i className="fa-solid fa-power-off" style={{ fontSize: '20px' }}></i>
                <img src={batteryIcon} alt="Battery Icon" style={{width:'20px', height:'20px'}}/>
                <img src={sendIcon} alt="Send Icon" style={{fwidth:'20px', height:'20px'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination-container">
        {totalPages > 1 && (
          <>
            <button
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
