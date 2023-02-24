import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://scotchtour-v2-ricechrisdtreat.vercel.app";

const API_URL = baseURL + "/api/whiskies";
// const API_URL = "/api/whisky_db";

// Get all whiskies from db
const getWhisky_db = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const whiskyDbService = {
  getWhisky_db,
};

export default whiskyDbService;
