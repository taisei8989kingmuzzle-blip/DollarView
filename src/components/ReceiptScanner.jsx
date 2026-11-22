// import { useState, useRef } from 'react';



// function ReceiptScanner() {
//     const [receipt, setReceipt] = useState(null);
//     const [receiptPreview, setReceiptPreview] = useState(null);
//     const fileInputRef = useRef(null);

//     function handleReceiptChange(event) {
        
//         const file = event.target.files[0];
//         if (!file) {return;}
//         setReceipt(file);
//         setReceiptPreview(URL.createObjectURL(file));
//         sendReceiptToServer(file);
//     }

//     async function sendReceiptToServer(file)  {
//         const reader = new FileReader();

//         reader.onload = async () => {
//             const base64 = reader.result.split(",")[1];

//             const response = await fetch("http://localhost:3000/analyze-receipt", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ image: base64})
//             });

//             const data = await response.json();
//             console.log(data);
//         };

//         reader.readAsDataURL(file);
//     }
//     return (
//         <div>
//             <h2>Scan one of your receipts, or any sort of verification of financial transaction</h2>
//             <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleReceiptChange}></input>
//             {receiptPreview && <img src={receiptPreview} alt="Your financial verification would appear here" style={{maxWidth: "100%", maxHeight: "400px"}}/>}
//         </div>
//     );
// }
// export default ReceiptScanner;