import { useState } from "react";
import { pagesApi } from "../services/pages";

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await pagesApi.getBySlug("organization");
      console.log("API Result:", result);
      setData(result);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Pages API</h1>
      <button onClick={testApi} className="bg-blue-600 text-white px-4 py-2 rounded">
        Test getBySlug("organization")
      </button>
      
      {loading && <div className="mt-4">Loading...</div>}
      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      {data && (
        <div className="mt-4">
          <h2 className="font-bold">Success!</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
