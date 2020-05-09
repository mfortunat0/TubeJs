import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Loading from "./loading.gif";
import Axios from "axios";

function App() {
  toast.configure();
  const [image_state, image_setState] = useState("invisible");
  const [input_state, input_setState] = useState("");
  const [button_state, button_setState] = useState({ text: "Go", class: "" });

  const getFile = () => {
    image_setState("");
    button_setState({ class: "button_disable", text: "Wait" });

    let start = input_state.indexOf("=") + 1;

    let end;

    if (input_state.indexOf("&") > -1) {
      end = input_state.indexOf("&");
    } else {
      end = input_state.length;
    }

    let endpoint = input_state.slice(start, end);

    Axios.get(`http://localhost:3001/${endpoint}`).then(function (response) {
      toast.success("Convert completed, Click here to download !", {
        position: toast.POSITION.TOP_CENTER,
        onClick: () => {
          window.open(`http://localhost:3001/static/${response.data.name}`);
        },
      });

      image_setState("invisible");
      button_setState({ class: "", text: "Go" });
    });
  };

  const handle_input = (e) => {
    input_setState(e.target.value);
  };

  return (
    <div className="container">
      <input
        className="text-field"
        placeholder="Enter Youtube Link"
        type="text"
        onChange={(e) => handle_input(e)}
        value={input_state}
      />
      <button className={"button " + button_state.class} onClick={getFile}>
        {button_state.text}
      </button>
      <img className={image_state} src={Loading} alt="" />
    </div>
  );
}

export default App;
