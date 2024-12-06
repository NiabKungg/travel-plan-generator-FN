import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [formValues, setFormValues] = useState({
    days_to_travel: "",
    budget: "",
    want_to_go: "",
    types_of_tourism: "",
    traveling_participants: "",
    time_of_travel: "",
    type_of_accommodation: "",
    how_to_travel: "",
    special_need: "",
  });
  const [result, setResult] = useState("");
  const [typingEffect, setTypingEffect] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (result) {
      let currentText = "";
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < result.length) {
          currentText += result[currentIndex];
          setTypingEffect(currentText);
          currentIndex++;
        } else {
          clearInterval(interval);
          setTypingComplete(true);
        }
      }, 10);
    } else {
      setTypingEffect("");
      setTypingComplete(false);
    }
  }, [result]);

  const handleSaveToFile = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "travel_plan.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      const response = await fetch("http://localhost:5000/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received data:", data); // Debugging line
      setResult(data.result);
      console.log("Result state updated:", data.result); // Debugging line
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  };

  return (
    <div>
      <h1>Create Travel Plan✈️</h1>
      <div className="container">
        {isLoading ? ( // Display loading screen if isLoading is true
          <div className="loading">
            <p>กำลังสร้างแพลนท่องเที่ยว...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="days_to_travel">จำนวนวันที่จะไปเที่ยว:</label>
            <input
              type="number"
              id="days_to_travel"
              name="days_to_travel"
              value={formValues.days_to_travel}
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="budget">งบประมาณ:</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formValues.budget}
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="want_to_go">สถานที่ท่องเที่ยวที่ต้องการไป:</label>
            <input
              type="text"
              id="want_to_go"
              name="want_to_go"
              value={formValues.want_to_go}
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="types_of_tourism">ประเภทการท่องเที่ยวที่สนใจ:</label>
            <select
              id="types_of_tourism"
              name="types_of_tourism"
              value={formValues.types_of_tourism}
              onChange={handleInputChange}
            >
              <option value="เชิงผจญภัย">เชิงผจญภัย</option>
              <option value="เชิงประวัติศาสตร์">เชิงประวัติศาสตร์</option>
              <option value="เชิงธรรมชาติ">เชิงธรรมชาติ</option>
              <option value="เชิงวัฒนธรรม">เชิงวัฒนธรรม</option>
            </select>
            <br />

            <label htmlFor="traveling_participants">จำนวนผู้ร่วมเดินทาง:</label>
            <input
              type="number"
              id="traveling_participants"
              name="traveling_participants"
              value={formValues.traveling_participants}
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="time_of_travel">วันที่และเวลาเดินทาง:</label>
            <input
              type="datetime-local"
              id="time_of_travel"
              name="time_of_travel"
              value={formValues.time_of_travel}
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="type_of_accommodation">ประเภทที่พักที่ต้องการ:</label>
            <select
              id="type_of_accommodation"
              name="type_of_accommodation"
              value={formValues.type_of_accommodation}
              onChange={handleInputChange}
            >
              <option value="โรงแรม">โรงแรม</option>
              <option value="รีสอร์ท">รีสอร์ท</option>
              <option value="โฮสเทล">โฮสเทล</option>
              <option value="บ้านพัก">บ้านพัก</option>
            </select>
            <br />

            <label htmlFor="how_to_travel">วิธีการเดินทาง:</label>
            <select
              id="how_to_travel"
              name="how_to_travel"
              value={formValues.how_to_travel}
              onChange={handleInputChange}
            >
              <option value="รถยนต์ส่วนตัว">รถยนต์ส่วนตัว</option>
              <option value="รถบัส">รถบัส</option>
              <option value="รถไฟ">รถไฟ</option>
              <option value="เครื่องบิน">เครื่องบิน</option>
            </select>
            <br />

            <label htmlFor="special_need">ความต้องการพิเศษ:</label>
            <input
              type="text"
              id="special_need"
              name="special_need"
              value={formValues.special_need}
              onChange={handleInputChange}
            />
            <br />

            <input type="submit" value="สร้างแพลนท่องเที่ยว" />
          </form>
        )}
      </div>
      <div id="result">{typingEffect}</div>
      {typingComplete && result && (
        <div className="button-save-speak">
          <button onClick={handleSaveToFile}>โหลดแพลน</button>
        </div>
      )}
    </div>
  );
}

export default App;
