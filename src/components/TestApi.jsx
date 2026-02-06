import { useEffect, useState } from 'react'; 

export default function TestApi() { 
  const [message, setMessage] = useState('...Loading...'); 
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let isMounted = true;

    async function fetchData() { 
      try {
        const result = await fetch(`${API_URL}/api/hello`);
        if (!result.ok) {
          throw new Error(`Request failed with status ${result.status}`);
        }
        const data = await result.json();
        if (isMounted) {
          setMessage(data.message ?? 'No message');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setMessage('');
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  return(
    <div>
      {error ? `Error: ${error}` : `Message: ${message}`}
    </div>
  );
}