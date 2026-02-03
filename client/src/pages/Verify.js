import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Verify() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // 👈 camera stream
  const [genderResult, setGenderResult] = useState("");
  const navigate = useNavigate();

  // Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;
  };

  // Stop camera (IMPORTANT)
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture & verify
  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    // 🔴 CAMERA OFF IMMEDIATELY
    stopCamera();

    try {
      const res = await fetch("http://127.0.0.1:8000/classify-gender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();

      // Show result briefly
      setGenderResult(data.gender);

      // Store ONLY result
      localStorage.setItem("gender", data.gender);

      // ⏳ move to next page
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      alert("Gender verification failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Gender Verification</h2>

      <video
        ref={videoRef}
        autoPlay
        style={{ width: "300px", border: "1px solid black" }}
      />

      <br /><br />

      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {genderResult && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Gender detected: <span style={{ color: "green" }}>{genderResult}</span>
        </p>
      )}
    </div>
  );
}

export default Verify;
