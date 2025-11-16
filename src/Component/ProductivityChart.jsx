import React, { useState, useEffect, useRef } from "react";
import { showIndigoToast } from "../Component/IndigoToast";

const ProductivityChart = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Start / Stop logic
  const toggleStartStop = () => {
    if (running) {
      clearInterval(intervalRef.current);
      showIndigoToast("Timer Stopped", "error");
    } else {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      showIndigoToast("Timer Started", "success");
    }
    setRunning(!running);
  };

  // Reset stopwatch
  const reset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
    showIndigoToast("Timer Reset", "info");
  };

  // Format time to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl font-dispaly shadow-sm text-center">
      <h2 className="text-lg font-semibold text-indigo-600 mb-4">
        Stopwatch
      </h2>

      <div className="text-4xl font-mono font-bold mb-6 text-gray-900">
        {formatTime(time)}
      </div>

      <div className="flex justify-center gap-4">
        {/* Start / Stop Button */}
        <button
          onClick={toggleStartStop}
          className={`px-6 py-2 rounded-lg text-white font-semibold transition
          ${running ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          {running ? "Stop" : "Start"}
        </button>

        {/* Reset Button */}
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductivityChart;
