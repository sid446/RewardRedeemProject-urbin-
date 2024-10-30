import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

function QrCheckPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrUsed, setQrUsed] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const getUidFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const uuid = params.get('uuid');
        return {
            uuid: uuid ? uuid : null,
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
            const data = await res.json();
            setQrUsed(data.data);

            // Show confetti if the QR code is valid and hasn't been used
            if (!data.data) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
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
            const data = await res.json();
            setQrUsed(true);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        checkQrCode();
    }, []);

    const handleUseQrCode = () => {
        if (qrUsed === false) {
            ChangeUsedStatus(getUidFromUrl().uuid);
        }
    };

    return (
        <>
            {/* Conditionally render the confetti effect */}
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}


            <div className="h-screen w-screen border-[1rem] bg-[#95C1D9] shadow-md shadow-gray-500/50 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-repeat border-[#F5D05A] flex justify-center items-center">
            <div className={`h-[3rem] w-[3rem] rounded-full bg-[#95C1D9] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-repeat ${!qrUsed?'absolute top-[33%] left-4':'absolute top-[27%] left-4'}`}></div>
            <div className={`h-[3rem] w-[3rem] rounded-full bg-[#95C1D9] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-repeat absolute top-[33%] right-4 ${!qrUsed?'absolute top-[33%] right-4':'absolute top-[27%] right-4'}`}></div>
                <div className={`${!qrUsed ? 'h-[65vh]' : 'h-[40vh]'} w-[80vw] bg-[#F5D05A] shadow-md shadow-gray-500/50 border border-gray-300 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] bg-repeat`}>
                    {qrUsed !== true && (
                        <div className='w-full h-[28%] border-b-2 border-black border-dashed flex justify-center items-center'>
                           
                            <h1 className='font-sans bg-gradient-to-br from-[#1E1E1E] via-[#2B2A2A] to-[#3D3C3B] bg-clip-text text-transparent font-bold text-6xl'>COUPON</h1>
                        </div>
                    )}
                    <div className={`w-full ${!qrUsed ? 'h-[45vh]' : 'h-[40vh]'} flex flex-col justify-center items-center border-dashed border-t-2 border-black p-3 gap-8`}>
                        <h1 className='text-4xl text-[#95C1D9] font-sans font-bold text-'>{!qrUsed ? "Congratulations!" : "Oops!!"}</h1>
                        <h1 className='text-3xl text-white text-center font-sans font-bold'>{!qrUsed ? "Thank you for making our environment more beautiful" : "The QR code has already been used"}</h1>
                        <h1 className='text-3xl text-white font-sans text-center font-bold'>{!qrUsed ? "Here is your reward" : "Try again with another QR code"}</h1>
                        {!qrUsed && (
                         <button
                         onClick={handleUseQrCode}
                         className='w-[15rem] h-[4rem] text-white font-sans font-bold text-3xl transition-transform duration-500 ease-in-out shadow-md rounded-lg relative overflow-hidden bg-[url("https://www.transparenttextures.com/patterns/paper-1.png")] bg-repeat'
                         style={{ 
                             backgroundColor: '#95C1D9', // Fallback color
                         }}
                     >
                         <span className='bg-gradient-to-br from-[#e0e0e0] to-[#ffffff] bg-clip-text text-transparent'>
                             Redeem
                         </span>
                     </button>
                     
                        
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default QrCheckPage;
