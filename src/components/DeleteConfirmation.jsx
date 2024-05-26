import { useState, useEffect } from "react";
const TIMER = 3000
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  const [progress, setProgress] = useState(TIMER);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevState) => {
        return prevState - 10;
      });
    }, 10);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={progress} max={3000} />
    </div>
  );
}
