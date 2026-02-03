export const checkFilterLimit = (filter) => {
  // Any filter pe limit nahi
  if (filter === "any") return true;

  const today = new Date().toDateString();
  const keyDate = `filter_date_${filter}`;
  const keyCount = `filter_count_${filter}`;

  const savedDate = localStorage.getItem(keyDate);
  let count = parseInt(localStorage.getItem(keyCount)) || 0;

  // New day → reset
  if (savedDate !== today) {
    localStorage.setItem(keyDate, today);
    localStorage.setItem(keyCount, "0");
    count = 0;
  }

  // Limit = 5 per day
  if (count >= 5) {
    return false;
  }

  localStorage.setItem(keyCount, (count + 1).toString());
  return true;
};
