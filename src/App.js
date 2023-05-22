import "./App.css";
import { useEffect, useState, useRef } from "react";

function App() {
  const iframeRef = useRef(null);
  const [UID, setUID] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://chase-var.hostedpaymentservice.net/includes/hpfParent.min.js";
    script.async = false;
    script.onload = () => {
      setIsScriptLoaded(true);
      
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  useEffect(() => {
    const iframe = iframeRef.current;

    const handleMessage = (event) => {
      debugger
      if (event.data === 'paymentComplete') {
        completePayment();
      }
    };

    if (iframe) {
      iframe.addEventListener('message', handleMessage);
      window.completePayment = completePayment;
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('message', handleMessage);
      }
    };
  }, [isScriptLoaded, UID]);

  //payment default functions

  function handlePaymentErrors(data) {
    alert(
      "postMessage function handlePaymentErrors is called. \nError: " +
        Object.values(data)
    );
  }

  const completePayment = () => {
    console.log('Payment completed!');
    debugger
    // Additional logic here...
  };
  // function completePayment(data) {
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
    alert(
      "postMessage function cancelPayment is called. \n You have canceled the payment."
    );
  }

  // const completePayment = (data) => {
  //   debugger;
  //   console.log("completePayment");
  // };

  window.addEventListener(
    "message",
    function (event) {
      if (event.origin === "https://chase-var.hostedpaymentservice.net") {
        console.log(event.data);
        debugger
      }
    },
    false
  );

  return (
    <div className="App">
      <div id="secureFrameWrapper">
        {isScriptLoaded ? (
          <iframe
            id="secureFrame"
            class="secureFrame"
            style={{
              border: "1px dashed slategrey",
              backgroundColor: "#f4f4f4",
            }}
            height="270px"
            width="400px"
            ref={iframeRef}
            src={"https://chase-var.hostedpaymentservice.net/hpf/?uid=" + UID}
          ></iframe>
        ) : null}
        <input onChange={(e) => setUID(e.target.value)}></input>
      </div>
    </div>
  );
}

export default App;
