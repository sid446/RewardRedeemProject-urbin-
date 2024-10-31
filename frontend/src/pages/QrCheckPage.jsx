import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';

function QrCheckPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrUsed, setQrUsed] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const getUidFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const uuid = params.get('uuid');
        return { uuid: uuid || null };
    };

    const checkQrCode = async () => {
        setLoading(true);
        setError(null);
        const { uuid } = getUidFromUrl();
        if (!uuid) {
            setError("UUID not found");
            setLoading(false);
            setQrUsed(null);
            return;
        }
        try {
            const res = await fetch(`https://backendqr-4384.onrender.com/api/v1/users/checkQr?uuid=${uuid}`, {
                method: "GET"
            });
            if (!res.ok) throw new Error("Unable to check QR status");
            
            const data = await res.json();
            setQrUsed(data.data);

            if (data.data === false) {
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
            const res = await fetch("https://backendqr-4384.onrender.com/api/v1/users/Used", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uuid })
            });
            if (!res.ok) throw new Error("Status was not able to be changed to used");
            
            setQrUsed(true);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        checkQrCode();
        return () => setShowConfetti(false);
    }, []);

    const handleUseQrCode = () => {
        if (qrUsed === false) {
            ChangeUsedStatus(getUidFromUrl().uuid);
        }
    };

    return (
        <>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="h-screen w-screen flex justify-center items-center bg-[#95C1D9] border-[1rem] border-[#F5D05A] shadow-md shadow-gray-500/50 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-repeat">
                
                <div className={`${qrUsed === false ? 'top-[33%]' : 'top-[27%]'} h-[3rem] w-[3rem] rounded-full bg-[#95C1D9] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-repeat  absolute left-4`}></div>
                <div className={`${qrUsed === false ? 'top-[33%]' : 'top-[27%]'} h-[3rem] w-[3rem] rounded-full bg-[#95C1D9] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] bg-repeat absolute right-4`}></div>

                <div className={`${qrUsed === null ? 'h-[40vh]' : qrUsed === false ? 'h-[65vh]' : 'h-[40vh]'} w-[80vw] flex flex-col items-center justify-center bg-[#F5D05A] shadow-md border border-gray-300 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] bg-repeat`}>
                    
                    {/* Render Content Based on QR Status */}
                    {qrUsed === null ? (
                        <div className="h-[40vh] flex flex-col items-center justify-center text-center gap-4">
                            <h1 className="text-4xl text-[#95C1D9] font-bold">Oops!!</h1>
                            <p className="text-3xl text-white font-bold">UUID not found or invalid QR code</p>
                            <p className="text-3xl text-white font-bold">Please try again with a valid QR code</p>
                        </div>
                    ) : qrUsed === true ? (
                        <div className="h-[40vh] flex flex-col items-center justify-center text-center gap-4">
                            <h1 className="text-4xl text-[#95C1D9] font-bold">Oops!!</h1>
                            <p className="text-3xl text-white font-bold">The QR code has already been used</p>
                            <p className="text-3xl text-white font-bold">Try again with another QR code</p>
                        </div>
                    ) : (
                        <div className="h-[65vh] flex flex-col items-center text-center gap-8">
                            <div className='w-full h-[27%] flex justify-center items-center border-dashed border-b-2 border-black' >
                            <h1 className="text-6xl font-bold text-gray-800">COUPON</h1>
                            </div>
                            <div className='flex flex-col gap-10 '>
                            <p className="text-4xl text-[#95C1D9] font-bold">Congratulations!</p>
                            <p className="text-3xl text-white font-bold">Thank you for making our environment more beautiful</p>
                            <p className="text-3xl text-white font-bold">Here is your reward</p>
                            </div>
                            <Link 
                                to="/coupon"
                                onClick={handleUseQrCode}
                                className="w-[15rem] h-[4rem] bg-[#95C1D9] text-white font-bold text-3xl flex items-center justify-center rounded-lg shadow-md"
                            >
                                Redeem
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default QrCheckPage;
