import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkFilterLimit } from "../utils/checkFilterLimit";


function Match() {
  const [filter, setFilter] = useState("any");
  const navigate = useNavigate();

  const startMatching = () => {
    localStorage.setItem("match_filter", filter);
    navigate("/chat");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Find a Match</h2>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="any">Any</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <br /><br />

      <button onClick={startMatching}>
        Start Matching
      </button>
    </div>
  );
}

export default Match;