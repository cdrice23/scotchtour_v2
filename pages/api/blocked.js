export default function handler(req, res) {
  res.status(429);
  return res.end();
}
