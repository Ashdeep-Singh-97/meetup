import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import { LatLngTuple } from 'leaflet';

const Home = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [destinationLat, setDestinationLat] = useState<number | null>(null);
  const [destinationLon, setDestinationLon] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDestination, setShowDestination] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lon);
        },
        () => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchPlace = () => {
    if (latitude && longitude) {
      setLoading(true);
      axios
        .post('http://localhost:3000/api/v1/getplaces', {
          latitude,
          longitude,
        })
        .then((response) => {
          const data = response.data;
          setPlace(data.place);
          setDestinationLat(data.latitude);
          setDestinationLon(data.longitude);
          setShowDestination(true);
        })
        .catch(() => {
          setError('Failed to fetch place');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const renderMap = () => {
    if (latitude && longitude && destinationLat && destinationLon) {
      // Type assertion to ensure coordinates are in the expected format (LatLngTuple)
      const userLocation: LatLngTuple = [latitude, longitude];
      const destinationLocation: LatLngTuple = [destinationLat, destinationLon];

      return (
        <MapContainer center={userLocation} zoom={15} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
          <Marker position={destinationLocation}>
            <Popup>{place}</Popup>
          </Marker>
          <Polyline positions={[userLocation, destinationLocation]} color="blue" />
        </MapContainer>
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-8 max-w-lg mx-auto bg-gray-50 rounded-lg shadow-lg mt-10">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Your Location</h1>
          {latitude && longitude ? (
            <p className="text-lg text-gray-700 mt-2">
              Latitude: {latitude.toFixed(4)}, Longitude: {longitude.toFixed(4)}
            </p>
          ) : (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-blue-700">Nearby Destination</h2>
          <button
            onClick={fetchPlace}
            className="w-full py-2 mt-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Show Nearby Place
          </button>

          {loading && (
            <div className="flex justify-center items-center mt-4">
              <div className="animate-spin w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent" />
            </div>
          )}

          {showDestination && place ? (
            <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-100">
              <p className="font-semibold text-gray-700">{place}</p>
              <p className="text-gray-600">Latitude: {destinationLat?.toFixed(4)}</p>
              <p className="text-gray-600">Longitude: {destinationLon?.toFixed(4)}</p>
            </div>
          ) : showDestination && !loading && (
            <p className="mt-4 text-gray-600">No destination found.</p>
          )}
        </div>

        {showDestination && renderMap()}
      </div>
    </>
  );
};

export default Home;
