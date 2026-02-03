import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleSaveProfile = () => {
    if (!nickname) {
      alert("Please enter a nickname");
      return;
    }

    // pseudonymous profile save
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("bio", bio);

    navigate("/match");

  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create Pseudonymous Profile</h2>

      <input
        placeholder="Enter nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Short bio (optional)"
        maxLength={100}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSaveProfile}>
        Continue to Chat
      </button>
    </div>
  );
}

export default Profile;
