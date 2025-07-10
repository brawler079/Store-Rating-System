import { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [average, setAverage] = useState(null);

  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/ratings', config);
      setRatings(res.data.ratings);
      setAverage(res.data.averageRating);
      setStoreName(res.data.storeName || '');
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Store Owner Dashboard</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded mb-6">
        <h3 className="text-lg font-semibold">Store: {storeName || 'Loading...'}</h3>
        <p className="text-gray-600">Average Rating: {average ? average.toFixed(2) : 'N/A'}</p>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h4 className="text-lg font-semibold mb-2">Ratings from Users</h4>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-3 text-gray-500">
                  No ratings yet.
                </td>
              </tr>
            ) : (
              ratings.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-3">{entry.user.name}</td>
                  <td className="p-3">{entry.user.email}</td>
                  <td className="p-3">{entry.rating}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
