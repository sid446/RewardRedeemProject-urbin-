
// for generating and showing qr
// import { useState } from 'react';
// import './App.css';

// function App() {
//   const [qrDataUrl, setQrDataUrl] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false); // Added loading state

//   const generateQr = async () => {
//     setLoading(true); // Set loading to true before fetching
//     setError(null); // Reset error state
//     setQrDataUrl(null); // Clear previous QR code

//     try {
//       const res = await fetch("http://localhost:8000/api/v1/users/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": 'application/json',
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to generate QR code");
//       }

//       const data = await res.json();
//       setQrDataUrl(data.data); // Assuming data.data contains the QR code Data URL
//     } catch (err) {
//       setError(err.message); // Use the caught error variable
//     } finally {
//       setLoading(false); // Set loading to false when done
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">QR Code Generator</h1>
//       <button
//         onClick={generateQr}
//         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//         disabled={loading} // Disable button while loading
//       >
//         {loading ? 'Generating...' : 'Generate QR Code'}
//       </button>

//       {error && <p className="text-red-500">{error}</p>}
//       {qrDataUrl && (
//         <div className="mt-4">
//           <h2 className="text-lg">Generated QR Code:</h2>
//           <img src={qrDataUrl} alt="QR Code" className="mt-2" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import { useEffect, useState } from 'react';

function App() {
  const [qrUsed, setQrUsed] = useState(null); // Initial state is null to indicate status not checked
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to get the UUID (code) from the URL
  const getUuidFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const uuid = params.get('uuid');

    return {
      uuid: uuid ? uuid : null, // Return null if uuid is not found
    };
  };

  // Function to check QR code status
  const checkQrCode = async () => {
    setLoading(true);
    setError(null);
    const { uuid } = getUuidFromUrl(); // This gets the 'uuid' parameter

    if (!uuid) {
      setError("No UUID provided in the URL.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/checkQr?uuid=${uuid}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to check QR code status");
      }

      const data = await response.json();
      setQrUsed(data.data); // Store the usage status

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to mark the QR code as used
  const markQrCodeAsUsed = async (uuid) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/users/Used`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid }), // Send the UUID in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to mark QR code as used");
      }

      const data = await response.json();
      console.log(data.message); // Log the success message
      setQrUsed(true); // Update the state to reflect that the QR code has been used
    } catch (err) {
      console.error(err.message);
    }
  };

  // Check the QR code status only once when the component mounts
  useEffect(() => {
    checkQrCode(); // Call to check QR code status on component mount
  }, []);

  // Function to handle QR code usage
  const handleUseQrCode = () => {
    if (qrUsed === false) {
      markQrCodeAsUsed(getUuidFromUrl().uuid);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">QR Code Checker</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {qrUsed !== null && (
        <div className="mt-4">
          <h2 className="text-lg">
            {qrUsed ? "QR Code has been used." : "QR Code is available."}
          </h2>
          {!qrUsed && (
            <button onClick={handleUseQrCode} className="mt-2 p-2 bg-blue-500 text-white rounded">
              Use QR Code
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

