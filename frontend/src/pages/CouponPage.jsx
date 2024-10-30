import React, { useRef } from 'react';
import starbucks from '../assets/starbucks.png';
import barcode from '../assets/tag.png';
import download from "../assets/download.png";
import share from "../assets/share.png";
import { toPng } from 'html-to-image';

function CouponPage() {
    const couponRef = useRef(null);

    // Function to handle downloading the coupon as an image
    const handleDownload = () => {
        if (couponRef.current) {
            toPng(couponRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'starbucks_coupon.png'; // Name of the downloaded file
                    link.href = dataUrl; // Image data URL
                    link.click(); // Trigger the download
                })
                .catch((error) => {
                    console.error('Failed to download the coupon:', error);
                });
        }
    };

    // Function to handle sharing the coupon
    const handleShare = async () => {
        if (navigator.share) {
            try {
                const dataUrl = await toPng(couponRef.current);
                const blob = await (await fetch(dataUrl)).blob(); // Convert data URL to Blob
                const file = new File([blob], 'starbucks_coupon.png', { type: 'image/png' }); // Create File object
                
                // Share the file
                await navigator.share({
                    title: 'Starbucks Coupon',
                    text: 'Check out this Starbucks coupon!',
                    files: [file], // Share the file
                });
                console.log('Successfully shared');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };
    

    return (
        <div ref={couponRef} className='bg-[#E1E1E1] w-screen h-screen flex flex-col pt-[5rem] items-center gap-5'>
            <div  className='w-[85%] h-[60%] bg-[#FFFFFF] flex flex-col rounded-xl'>
                <div className='w-full h-[40%] flex'>
                    <div className='w-[50%] h-[40%] flex px-4 pt-8'>
                        <img className='w-[8rem] h-[8rem]' src={starbucks} alt="Starbucks Logo" />
                    </div>
                    <div className='w-[50%] h-[40%] pt-8 flex flex-col gap-4'>
                        <h1 className='font-sans font-bold text-2xl'>STARBUCKS</h1>
                        <div className='w-[70%] h-[5rem] flex justify-between'>
                            <div className='flex flex-col'>
                                <h1 className='font-sans font-semibold'>BUY</h1>
                                <h1 className='font-sans font-semibold'>GET</h1>
                            </div>
                            <h1 className='font-sans font-semibold text-5xl'>1</h1>
                            <div className='w-[2rem] h-[3.1rem] flex items-end'>
                                <h1 className='font-sans font-semibold'>FREE</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[60%] p-5 flex flex-col justify-center gap-4 items-center'>
                    <h1 className='text-center font-medium mb-4'>
                        Purchase Any Starbucks Beverage AND Receive A Complimentary Second Beverage
                    </h1>
                    <ul className='list-disc list-inside text-left text-sm text-[#555]'>
                        <li className='mb-2'>
                            <h1 className='inline'>Redeemable at all Starbucks Coffee Stores in India.</h1>
                        </li>
                        <li className='mb-2'>
                            <h1 className='inline'>Not valid with any other discounts and promotions.</h1>
                        </li>
                        <li className='mb-2'>
                            <h1 className='inline'>Valid for Coffee and Tea beverages only.</h1>
                        </li>
                    </ul>
                </div>
            </div>

            <div className='w-[85%] h-[20%] bg-[#FFFFFF] rounded-xl flex flex-col justify-center items-center'>
                <div className='w-full h-[70%] flex flex-col justify-center items-center'>
                    <img className='w-[10rem] h-[7rem]' src={barcode} alt="Barcode" />
                </div>
                <div className='w-full h-[40%] flex justify-between p-4'>
                    <img 
                        className='w-[1.5rem] h-[1.5rem] cursor-pointer' 
                        src={share} 
                        alt="Share" 
                        onClick={handleShare} 
                    />
                    <h4 className='text-sm text-zinc-500'>Valid within 1 week of redemption.</h4>
                    <img 
                        className='w-[1.5rem] h-[1.5rem] cursor-pointer' 
                        src={download} 
                        alt="Download" 
                        onClick={handleDownload} 
                    />
                </div>
            </div>
        </div>
    );
}

export default CouponPage;
