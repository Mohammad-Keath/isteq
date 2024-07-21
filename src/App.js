import logo from "./logo.png";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCountdownSeconds } from "./use-countdown";
import { useParams } from "react-router";

function App() {
  const [ip, setIp] = useState("");
  const [answer, setAnswer] = useState();

  const { id } = useParams();

  const { startCountdown, countdown, counting } = useCountdownSeconds(30);

  useEffect(() => {
    axios.get("https://api.ipify.org?format=json").then((response) => {
      setIp(response.data.ip);
    });
  }, []);

  const sendToTelegram = () => {
    const telegramBotToken = "7449980412:AAEXn1I3Wt6iegMCLCoSwInw1RRr_ALLC7w";
    const chatId = "-4154163141";

    axios
      .post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: chatId,
        text: `Client Id:${id}\nIP Address: ${ip}\n repeated issue: ${answer} `,
      })
      .then((response) => {
        startCountdown();
        console.log("Message sent: ", response.data);
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="home">
        <div>
          {/* <h1 className="serverErrorCode">504</h1> */}
          <h1 className="serverError">Automated Rerouting Tool</h1>
          <p className="text">
            {/* Welcome! */}
            Our automated rerouting tool is designed to determine the optimal
            uplink for your current situation. This process involves a series of
            tests performed within your browser, executed in three steps.
            <br />
            Steps:
            <br />
            <li>
              Initial Assessment: The tool will evaluate your current network
              conditions.
            </li>
            <li>
              Testing Phase: Various uplink options will be tested to identify
              the best performance metrics.
            </li>
            <li>
              Configuration: The optimal uplink will be configured for a period
              of 10 days.
            </li>
            <br />
            Thank you for your cooperation!
          </p>
          {counting && <h3 style={{ fontSize: "18px" }}>{countdown}</h3>}
          <h3>To continue please answer this questions:</h3>
          <div className="home">
            <p>Is the issue repeated?</p>
            {!answer && (
              <span
                className="yesNo"
                onClick={() => {
                  setAnswer("yes");
                }}
              >
                {" "}
                yes
              </span>
            )}
            {!answer && (
              <span
                className="yesNo"
                onClick={() => {
                  setAnswer("no");
                }}
              >
                {" "}
                no
              </span>
            )}
            {answer && <span style={{ marginLeft: "4px" }}>{answer}</span>}
          </div>
          <button
            onClick={sendToTelegram}
            disabled={!answer || counting}
            className="button"
          >
            Send Issue
          </button>
          {!answer && (
            <span className="caption">must answer question to send </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
