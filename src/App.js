import "./App.css";
import { useEffect, useState } from "react";


function App() {
  const [UID, setUID] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://chase-var.hostedpaymentservice.net/includes/hpfParent.min.js";
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
        window.completePayment = completePayment;
    };
      document.body.appendChild(script);
      return () => {
          document.body.removeChild(script);
      }
  }, []);


  //payment default functions

  function handlePaymentErrors(data) {
    alert("postMessage function handlePaymentErrors is called. \nError: " + Object.values(data));
}
// function completePayment(data: any) {
//     // alert("postMessage function completePayment is called. \n Response:" + Object.values(data));
//     alert(data.token_id);
// }
function hpfReady() {
    console.log("HPF Form finished loading.");
}
function scrollRelay(scrollX, scrollY) {
    console.log("Scroll X: " + scrollX + "\nScroll Y: " + scrollY);
}
function startPayment() {
    console.log("Payment processing start.");
}
function cancelPayment() {
    alert("postMessage function cancelPayment is called. \n You have canceled the payment.");
}

const completePayment = (data) => {
    debugger
    console.log("completePayment")

}

window.addEventListener("message", function (event) {
  if (event.origin === "https://chase-var.hostedpaymentservice.net") {
    debugger
console.log(event.data)
  }
}, false)


  return (
    <div className="App">
      <div id="secureFrameWrapper">
      { isScriptLoaded ? <iframe id="secureFrame" class="secureFrame" style={{border:"1px dashed slategrey", backgroundColor:"#f4f4f4"}}
            height="270px" width="400px"
            src={"https://chase-var.hostedpaymentservice.net/hpf/?uid=" + UID}>
        </iframe> : null}
        <input onChange={(e) => setUID(e.target.value)}></input>
      </div>
    </div>
  );
}

export default App;
