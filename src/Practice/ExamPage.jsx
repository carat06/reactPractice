import { useEffect, useRef, useState } from "react";

function ExamPage() {
  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);

  // Auto focus when page loads
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Timer runs every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    clearInterval(intervalRef.current);
    alert("Exam Submitted!");
  };

  return (
    <div>
      <h2>Online Exam</h2>
      <p>Time: {time} seconds</p>

      <input
        ref={inputRef}
        type="text"
        placeholder="Type your answer..."
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={submitted}>
        Submit
      </button>
    </div>
  );
}

export default ExamPage;