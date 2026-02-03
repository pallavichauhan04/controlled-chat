import { v4 as uuidv4 } from "uuid";

export const getAnonymousId = () => {
  let anonId = localStorage.getItem("anon_id");

  if (!anonId) {
    anonId = "anon_" + uuidv4();
    localStorage.setItem("anon_id", anonId);
  }

  return anonId;
};
