import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => navigate("/verify")}>
        Start Chat
      </button>
    </div>
  );
}

export default Home;