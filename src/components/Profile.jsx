import { useUser } from "../contexts/UserProvider";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchProfile() {
    try {
      const result = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include",
      });
      if (result.status === 401) {
        logout();
        return;
      }
      const data = await result.json();
      setData(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h3>Profile...</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          ID: {data._id} <br />
          Email: {data.email} <br />
          First Name: {data.firstname} <br />
          Last Name: {data.lastname} <br />
        </div>
      )}
    </div>
  );
}
