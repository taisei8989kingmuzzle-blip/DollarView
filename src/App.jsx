import {
  Wallet,
  TrendingUp,
  //TrendingDown,
  ScanLine,
  ArrowUpRight,
  ShoppingCart,
  Home,
  Car,
  Utensils,
} from "lucide-react";

import "./index.css";
import  { useState, useRef, useEffect} from 'react';
const transactions = [
  { name: "Grocery Store", category: "Food", amount: 86.42, icon: Utensils },
  { name: "Electricity Bill", category: "Utilities", amount: 124.50, icon: Home },
  { name: "Gas Station", category: "Transport", amount: 55.20, icon: Car },
  { name: "Online Shopping", category: "Shopping", amount: 72.99, icon: ShoppingCart },
];

function App() {

    const [ Action, setAction] = useState(() => {
     return JSON.parse(localStorage.getItem("dollarview_transactions") || "[]");
    });

    const [archives, setArchives] = useState(() => {
      return JSON.parse(localStorage.getItem("dollarview_archives"))
    });
    const fileInputRef = useRef(null);
    const [receipt, setReceipt] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalFoodExpense, setTotalFoodExpense] = useState(0);
    const [totalHousingExpense, setTotalHousingExpense] = useState(0);
    const [totalTransportExpense, setTotalTransportExpense] = useState(0);
    const [totalShoppingExpense, setTotalShoppingExpense] = useState(0);

    

     function handleReceiptChange(event) {
        
        const file = event.target.files[0];
        if (!file) {return;}
        setReceipt(file);
        setReceiptPreview(URL.createObjectURL(file));
        sendReceiptToServer(file);
    }

    function handleClear(){
      setTotalExpense(0);
      setTotalFoodExpense(0);
      setTotalHousingExpense(0);
      setTotalTransportExpense(0);
      setTotalShoppingExpense(0);
    }

    async function sendReceiptToServer(file)  {
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const base64 = reader.result.split(",")[1];

            const response = await fetch("http://localhost:3000/analyze-receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                  image: base64,
                  mimeType: file.type,
                })
            });

            const data = await response.json();

            if(!response.ok) {
              throw new Error(data.error || "Receipt analysis failed");
            }

            setReceiptData(data);
            console.log(data);
            setTotalExpense(prev => prev + Number(data.total_amount_spent));

            if (data.expense_category == 'Food') {
              setTotalFoodExpense(prev => prev + Number(data.total_amount_spent));
            } else if (data.expense_category == 'Housing') {
              setTotalHousingExpense(prev => prev + Number(data.total_amount_spent));
            } else if (data.expense_category == 'Transport') {
              setTotalTransportExpense(prev => prev + Number(data.total_amount_spent));
            } else if (data.expense_category == 'Shopping') {
              setTotalShoppingExpense(prev => prev + Number(data.total_amount_spent));
            }
            
          } catch(error) {
            console.error("Receipt upload error:", error);
          }

        };

        reader.readAsDataURL(file);
    }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Wallet size={26} />
          <span>DollarView</span>
        </div>

        <nav>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Transactions</div>
          <div className="nav-item">Insights</div>
        </nav>

        <div className="sidebar-bottom">
          <p>See where your money goes.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="header">
          <div>
            <p className="eyebrow">YOUR FINANCIAL OVERVIEW</p>
            <h1>Good afternoon.</h1>
            <p className="subtitle">
              Here's a look at your household spending.
            </p>
          </div>

          <button className="scan-button" onClick={() => fileInputRef.current.click()}>
            <ScanLine size={18} />
            Scan Receipt
          </button>
          <button className="clear-button" onClick={() => handleClear()}>
            Clear this month's data
          </button>
        </header>

        {/* Total Spending */}
        <section className="summary-card">
          <div>
            <p className="card-label">TOTAL SPENDING THIS MONTH</p>
            <h2>{totalExpense.toFixed(2)}</h2>
            <div className="comparison">
              <TrendingUp size={16} />
              <span>8.5% above your previous average</span>
            </div>
          </div>

          <div className="summary-icon">
            <Wallet size={30} />
          </div>
        </section>

        {/* Categories */}
        <section className="category-section">
          <h2>Spending categories</h2>

          <div className="category-grid">
            <div className="category-card">
              <div className="category-icon food">
                <Utensils size={20} />
              </div>
              <p>Food</p>
              <h3>{totalFoodExpense.toFixed(2)}</h3>
            </div>

            <div className="category-card">
              <div className="category-icon housing">
                <Home size={20} />
              </div>
              <p>Housing</p>
              <h3>{totalHousingExpense.toFixed(2)}</h3>
            </div>

            <div className="category-card">
              <div className="category-icon transport">
                <Car size={20} />
              </div>
              <p>Transport</p>
              <h3>{totalTransportExpense.toFixed(2)}</h3>
            </div>

            <div className="category-card">
              <div className="category-icon shopping">
                <ShoppingCart size={20} />
              </div>
              <p>Shopping</p>
              <h3>{totalShoppingExpense.toFixed(2)}</h3>
            </div>
          </div>
        </section>

        {/* Lower Dashboard */}
        <section className="bottom-grid">
          
        </section>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleReceiptChange} style={{display: "none"}}></input>
            
            {receiptPreview && 
            <section className="receipt-preview-section">
            <img src={receiptPreview} alt="Your financial verification would appear here" className="receiptPreviewImage"/>
            </section>
            }
                      {receiptData && (
            <div className="panel">
              <div className="panel-header">
                      <h2>Recent transactions</h2>
              </div>
              <div className="transaction">
                <div className="transaction-info">
                <h2>Extracted Receipt Data</h2>
                <strong>Merchant: {receiptData.merchant}</strong>
                <span>Date: {receiptData.date_of_transaction}</span>
                <span>Category: {receiptData.expense_category}</span>

                <strong className="amount">
                  -${Number(receiptData.total_amount_spent).toFixed(2)}
                </strong>
                </div>
              </div>
            </div>
        )}

        <div className="panel insight-panel">
            <div className="panel-header">
              <h2>DollarView insight</h2>
              <TrendingUp size={20} />
            </div>

            <div className="insight-content">
              <p className="insight-title">
                Your spending snapshot
              </p>

              <p>
                You have spent $4,280 this month. Food and housing
                account for the largest portions of your spending.
                Scan more receipts to unlock personalized insights.
              </p>
            </div>

            <button className="insight-button">
              Explore insights
              <ArrowUpRight size={18} />
            </button>
          </div>
      </main>
    
    </div>
  );
}



export default App;