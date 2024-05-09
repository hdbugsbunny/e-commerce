exports.get404 = (req, res, next) => {
  const { isAuthenticated } = req;
  res
    .status(404)
    .render("404", { docTitle: "Page Not Found", path: "", isAuthenticated });
};
