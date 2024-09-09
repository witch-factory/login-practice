import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./utils/apiClient";

const ProtectedPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await apiClient.get("protected").json();
        console.log(response);
        setData(response.message);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProtectedData();
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
    </div>
  );
};

export default ProtectedPage;
