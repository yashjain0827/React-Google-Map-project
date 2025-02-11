import React, { useState, useRef, useEffect } from 'react';
import DonutChart from './Chart';
import './DashboardDetails.css';
import batteryIcon from "../img/batteryIcon.svg";
import sendIcon from "../img/sendIcon.svg";
import truck from "../img/truck-icon.svg";
import truckrunning from "../img/truck-icon1.svg";
import truckstop from "../img/truck-icon2.svg";
import truckidle from "../img/truck-icon3.svg";
import truckoffline from "../img/truck-icon4.svg";

function DashboardDetails({ allData, showData, setShowData, setActiveCategory, activeCategory, chartData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleData, setVisibleData] = useState([]);
  const containerRef = useRef(null);

  const ITEMS_PER_LOAD = 10;

  const categoryColors = {
    all: '#FF0000',
    running: '#36A2EB',
    stop: '#FF6384',
    idle: '#FF9F40',
    offline: '#4BC0C0',
  };


  const categoryIcons = {
    all: truck,
    running: truckrunning,
    stop: truckstop,
    idle: truckidle,
    offline: truckoffline,
  };

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
      setVisibleData(allVehicles.slice(0, ITEMS_PER_LOAD)); 
    } else {
      const filteredVehicles = allData[category.toUpperCase()] || [];
      setShowData(filteredVehicles);
      setVisibleData(filteredVehicles.slice(0, ITEMS_PER_LOAD));
    }
  };
// Need to check later
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
      setVisibleData(filteredData.slice(0, ITEMS_PER_LOAD)); 
    }
  };

  // const handleSearch = (event) => {
  //   const query = event.target.value.toLowerCase();
  //   setSearchQuery(query);
  
  //   if (query === '') {
  //     setShowData(showData); 
  //     setVisibleData(showData.slice(0, ITEMS_PER_LOAD));
  //   } else {
  //     const filteredData = showData.filter(vehicle => {
  //       const vehicleId = vehicle.id ? vehicle.id.toString().toLowerCase() : '';
  //       return vehicleId.includes(query);
  //     });
  //     setShowData(filteredData);
  //     setVisibleData(filteredData.slice(0, ITEMS_PER_LOAD)); 
  //   }
  // };
  

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

  
    if (scrollTop + clientHeight >= scrollHeight * 0.7) {
      loadMoreData();
    }
  };

  const loadMoreData = () => {
    if (visibleData.length < showData.length) {
      const nextBatch = showData.slice(visibleData.length, visibleData.length + ITEMS_PER_LOAD);
      setVisibleData(prev => [...prev, ...nextBatch]);
    }
  };

  useEffect(() => {
    setVisibleData(showData.slice(0, ITEMS_PER_LOAD));
  }, [showData]);

  const iconByStatus = (status) => {
    return categoryIcons[status.toLowerCase()] || categoryIcons.default;
  };

  const borderColorByStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
        return categoryColors.running;
      case 'stop':
        return categoryColors.stop;
      case 'idle':
        return categoryColors.idle;
      case 'offline':
        return categoryColors.offline;
      default:
        return categoryColors.all;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-buttons-container">
        <button
          className={`dashboard-button all ${activeCategory === 'all' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`dashboard-button running ${activeCategory === 'running' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('running')}
        >
          Running
        </button>
        <button
          className={`dashboard-button stop ${activeCategory === 'stop' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('stop')}
        >
          Stop
        </button>
        <button
          className={`dashboard-button idle ${activeCategory === 'idle' ? 'selected' : ''}`}
          onClick={() => handleFilterChange('idle')}
        >
          Idle
        </button>
        <button
          className={`dashboard-button offline ${activeCategory === 'offline' ? 'selected' : ''}`}
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

      <div
        className="vehicle-details-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <h3>Vehicle Details</h3>
        <div className="vehicle-grid">
          {visibleData.map((vehicle, index) => (
            <div key={index} className="vehicle-item" style={{ borderBottomColor: borderColorByStatus(vehicle.status) }}>
              <div style={{ height: "47px", width: "90px" }}>
                <img src={iconByStatus(vehicle.status)} alt="Truck Icon" style={{ width: '100%', height: '100%' }} />
              </div>
              <div>
                <p><strong>ID:</strong> {vehicle.id}</p>
                <p><strong>Status:</strong> {vehicle.status}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: "repeat(2, 2fr)" }}>
                <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '20px' }}></i>
                <i className="fa-solid fa-power-off" style={{ fontSize: '20px' }}></i>
                <img src={batteryIcon} alt="Battery Icon" style={{ width: '20px', height: '20px' }} />
                <img src={sendIcon} alt="Send Icon" style={{ width: '20px', height: '20px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardDetails;
