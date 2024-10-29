import React, { useState, useEffect } from 'react';

function QrCheckPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrUsed, setQrUsed] = useState(false);

    const getUidFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const uuid = params.get('uuid');
        return {
            uuid: uuid ? uuid : null, // Return null if uuid is not found
        };
    };

    const checkQrCode = async () => {
        setLoading(true);
        setError(null);
        const { uuid } = getUidFromUrl();
        if (!uuid) {
            setError("UUID not found");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`http://localhost:8000/api/v1/users/checkQr?uuid=${uuid}`, {
                method: "GET"
            });
            if (!res.ok) {
                throw new Error("Unable to check QR status");
            }
            const data = await res.json(); // Added missing parentheses
            console.log(data.data);
            setQrUsed(data.data); // Use the QR used status from the API response
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const ChangeUsedStatus = async (uuid) => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/users/Used", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uuid })
            });
            if (!res.ok) {
                throw new Error("Status was not able to be changed to used");
            }
            const data = await res.json(); // Added missing parentheses
            console.log(data.message);
            setQrUsed(true); // Update the state to reflect the QR code has been used
        } catch (err) {
            console.error(err.message);
        }
    };

    // Check the QR code status only once when the component mounts
    useEffect(() => {
        checkQrCode(); // Call the function properly
    }, []);

    const handleUseQrCode = () => {
        if (qrUsed === false) {
            ChangeUsedStatus(getUidFromUrl().uuid);
        }
    };

    return (
        <>
            <div className="h-screen w-screen border-[1rem] bg-[#95C1D9] border-[#F5D05A] flex justify-center items-center">
                <div className={`${!qrUsed ? 'h-[65vh]' : 'h-[40vh]'} w-[80vw] bg-[#F5D05A]`}>
                    {qrUsed !== true && (
                        <div className='w-full h-[28%] border-b-2 border-black border-dashed flex justify-center items-center'>
                            <div className='h-[3rem] w-[3rem] rounded-full bg-[#95C1D9] absolute top-[33%] left-4'></div>
                            <div className='h-[3rem] w-[3rem] rounded-full bg-[#95C1D9] absolute top-[33%] right-4'></div>
                            <h1 className='font-sans font-bold text-6xl'>COUPON</h1>
                        </div>
                    )}
                    <div className={`w-full h-[72%] flex flex-col justify-center items-center p-3 gap-8`}>
                        <h1 className='text-4xl text-white font-sans font-bold'>{!qrUsed?"Congratulation":"Oops!!"}</h1>
                        <h1 className='text-3xl text-white text-center font-sans font-bold'>{!qrUsed?"Thank you for making our environment more beautiful":"The QR code have already been used"}</h1>
                        <h1 className='text-3xl text-white font-sans text-center font-bold'>{!qrUsed?"Here is your reward":"Try Again with other Qr code"}</h1>
                        {!qrUsed && (
                            <button onClick={handleUseQrCode} className='w-[15rem] h-[4rem] bg-[#95C1D9] hover:border-2'>
                                <h1 className='text-3xl text-white font-sans font-bold'>Redeem</h1>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default QrCheckPage;
