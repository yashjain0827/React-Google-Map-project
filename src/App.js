import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Tracking from './components/Tracking';
import car1 from './img/car1.svg';
import carStopIcon from './img/carStop.svg';
import carIdleIcon from './img/carIdle.svg';
import carOfflineIcon from './img/carOffline.svg';
import './App.css';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

function App() {
  const [allData, setAllData] = useState(null); 
  const [showData, setShowData] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('all'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const googleMapRef = useRef(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: '', 
  });


  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) return; 

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [mapLoaded]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://aisadmin.watsoo.com/backend/api/v1/get/newDashboardData?userId=59&userType=ADMIN&companyId=1'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const allFetchedData = result?.data || {};

      const tepmShowData = [
        ...(allFetchedData.RUNNING || []),
        ...(allFetchedData.STOP || []),
        ...(allFetchedData.IDLE || []),
        ...(allFetchedData.OFFLINE || []),
      ];

      setAllData(allFetchedData); 
      setShowData(tepmShowData); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const getMarkerIcon = (status) => {
    switch (status) {
      case 'RUNNING':
        return car1;
      case 'STOP':
        return carStopIcon;
      case 'IDLE':
        return carIdleIcon;
      case 'OFFLINE':
        return carOfflineIcon;
      default:
        return carIdleIcon; 
    }
  };

  
  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="app">
      <header className="header">Watsoo Xpress
      <button className="next-button" onClick={() => navigate('./components/Tracking')}>Device Tracking</button>
      </header>

      <div className="main-container">
        <Sidebar
          activeCategory={activeCategory}
          chartData={[
            { name: 'Running', value: (allData?.RUNNING || []).length },
            { name: 'Stop', value: (allData?.STOP || []).length },
            { name: 'Idle', value: (allData?.IDLE || []).length },
            { name: 'Offline', value: (allData?.OFFLINE || []).length },
          ]}
          showData={showData} 
          setShowData={setShowData}
          setActiveCategory={setActiveCategory}
          allData={allData}
        />

        <div className="content">
        
            <div className="google-map">
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={5}
                  ref={googleMapRef}
                  onLoad={handleMapLoad} 
                >
                  {showData.map((location, index) => (
                    <Marker
                      key={index}
                      position={{
                        lat: location.latitude,
                        lng: location.longitude,
                      }}
                      icon={getMarkerIcon(location.status)} 
                    />
                  ))}
                </GoogleMap>
              )}
            </div>          
        </div>
      </div>
    </div>
  );
}

function Track(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/components/Tracking" element={<Tracking />} />
      </Routes>
    </Router>
  )
}

export default Track;
