exports.get404 = (req, res, next) => {
  res.status(404).render("404", { docTitle: "Page Not Found", path: "" });
};

exports.get500 = (error, req, res, next) => {
  res.status(500).render("500", { docTitle: "Some Error Occurred", path: "" });
};
