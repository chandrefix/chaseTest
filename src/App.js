import logo from "./logo.svg";
import "./App.css";
import ASHOKLEY from "./data";

import { useEffect } from "react";
var TotalAmount = 100000;
var Shareslocker = 0;
var lastSharePrice = 0;
var buyShareCount = 0;
var Report = [];
var buyDate = new Date();

function App() {
  const taxCalculation = (bp, sp, qty, NSE) => {
    /////////////////////////////////////
    // Tax calculation

    var turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));

    var brokerage = 0;

    var stt_total = Math.round(
      parseFloat(parseFloat(turnover * 0.001).toFixed(2))
    );

    var exc_trans_charge = NSE
      ? parseFloat(parseFloat(0.0000325 * turnover).toFixed(2))
      : parseFloat(parseFloat(0.0000375 * turnover).toFixed(2));
    var cc = 0;
    var dp = 15.93;
    if (sp == 0) dp = 0;

    var stax = parseFloat(
      parseFloat(0.18 * (brokerage + exc_trans_charge)).toFixed(2)
    );

    var sebi_charges = parseFloat(parseFloat(turnover * 0.000001).toFixed(2));
    sebi_charges = parseFloat(
      parseFloat(sebi_charges + sebi_charges * 0.18).toFixed(2)
    );

    var stamp_charges = Math.round(
      parseFloat(parseFloat(bp * qty * 0.00015).toFixed(2))
    );

    let total_tax = parseFloat(
      parseFloat(
        brokerage +
          stt_total +
          exc_trans_charge +
          cc +
          dp +
          stax +
          sebi_charges +
          stamp_charges
      ).toFixed(2)
    );
    return total_tax;
  };

  const backTrack = async () => {
    // var promise1 = new Promise(function (resolve, reject) {
    Promise.all(
      ASHOKLEY.data.candles.map(async (i) => {
        let day = new Date(i[0]).toString().split(" ")[0];
        let time = new Date(i[0]).toString().split(" ")[4];

        if (day === "Fri" && time === "15:20:00") {
          if (TotalAmount > 10000 && buyShareCount === 0) {
            buyShareCount = (TotalAmount / i[4]).toFixed(0) - 1;
            let buyAmount = i[4];

            // buy
            TotalAmount = TotalAmount - buyAmount * buyShareCount;
            Shareslocker = buyShareCount;
            buyDate = i[0];
            lastSharePrice = buyAmount;
            Report = [
              ...Report,
              {
                flow: "buy",
                amount: buyAmount,
                buyShareCount: buyShareCount,
                time: i[0],
                balance: TotalAmount,
              },
            ];

            console.log("buy", TotalAmount);
            // alert(TotalAmount)
          } else if (
            buyShareCount > 0 &&
            new Date(buyDate).toString().split(" ")[2] <
              new Date(i[0]).toString().split(" ")[2]
          ) {
            if (i[4] > lastSharePrice) {
              let SellAmount = i[4];

              // Sell
            

              // let taxAmount = await taxCalculation(
              //   lastSharePrice,
              //   SellAmount,
              //   buyShareCount,
              //   true
              // );
              let bp = lastSharePrice;
              let sp = SellAmount;
              let qty = buyShareCount;
              let NSE = true;

              let turnover = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));

              let brokerage = 0;

              let stt_total = Math.round(
                parseFloat(parseFloat(turnover * 0.001).toFixed(2))
              );

              let exc_trans_charge = NSE
                ? parseFloat(parseFloat(0.0000325 * turnover).toFixed(2))
                : parseFloat(parseFloat(0.0000375 * turnover).toFixed(2));
                let cc = 0;
                let dp = 15.93;
              if (sp == 0) dp = 0;

              let stax = parseFloat(
                parseFloat(0.18 * (brokerage + exc_trans_charge)).toFixed(2)
              );

              let sebi_charges = parseFloat(
                parseFloat(turnover * 0.000001).toFixed(2)
              );
              sebi_charges = parseFloat(
                parseFloat(sebi_charges + sebi_charges * 0.18).toFixed(2)
              );

              let stamp_charges = Math.round(
                parseFloat(parseFloat(bp * qty * 0.00015).toFixed(2))
              );

              let total_tax = parseFloat(
                parseFloat(
                  brokerage +
                    stt_total +
                    exc_trans_charge +
                    cc +
                    dp +
                    stax +
                    sebi_charges +
                    stamp_charges
                ).toFixed(2)
              );
              TotalAmount =
                TotalAmount + SellAmount * buyShareCount - total_tax;



                Shareslocker = 0;
                buyDate = i[0];
                lastSharePrice = SellAmount;
                buyShareCount = 0;
                Report = [
                  ...Report,
                  {
                    flow: "sell",
                    amount: SellAmount,
                    buyShareCount: buyShareCount,
                    time: i[0],
                    balance: TotalAmount,
                  },
                ];

              console.log("sell", TotalAmount);
            }
          }
        }
      })
    );
    // });

    // promise1.then(function (value) {
    console.log("TotalAmount", TotalAmount);
    debugger;
    // });
  };

  //   useEffect(() => {
  //     const script = document.createElement('script');
  //     script.src = "https://chase-var.hostedpaymentservice.net/includes/hpfParent.min.js";
  //     script.async = true;
  //     document.body.appendChild(script);
  //     return () => {
  //         document.body.removeChild(script);
  //     }
  // }, []);

  return (
    <div className="App">
      <div id="secureFrameWrapper">
        <button onClick={backTrack}>Test</button>
        {/* <iframe id="secureFrame" class="secureFrame" style={{border:"1px dashed slategrey", backgroundColor:"#f4f4f4"}}
            height="270px" width="400px"
            src="https://chase-var.hostedpaymentservice.net/hpf/?uid=EKT7GYAYP8J5BLRGCXFJLGEENRP7O10V">
        </iframe> */}
      </div>
    </div>
  );
}

export default App;
