export async function checkAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Return the authenticated user's details
  res.status(200).json(req.user);
}
