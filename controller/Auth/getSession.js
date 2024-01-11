const getSession = (req, res) => {
  // check session
  if (!req.session.user) {
    res.status(401).send("tidak ada session login");
  }
  res.status(200).send(req.session.user);
};

module.exports = getSession;
