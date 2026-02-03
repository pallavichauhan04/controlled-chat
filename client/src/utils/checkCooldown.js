export const checkCooldown = () => {
  const lastTime = localStorage.getItem("last_match_time");
  const now = Date.now();

  if (lastTime && now - lastTime < 10000) {
    // 10 seconds cooldown
    return false;
  }

  localStorage.setItem("last_match_time", now.toString());
  return true;
};
