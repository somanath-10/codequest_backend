const timeWindowGuard = (req, res, next) => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hour = istTime.getHours();

  if (hour >= 4 && hour < 21) {
    next();
  } else {
    return res.status(403).json({ message: "Subscription allowed only between 10–11 AM IST" });
  }
};

export default timeWindowGuard;

