exports.getLogin = (req, res, next) => {
  const isAuthenticated =
    req.get("Cookie")?.split(";")[1]?.trim()?.split("=")[1] === "true" || false;
  console.log("🚀 ~ session:", req.session);
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isAuthenticated = true;
  res.redirect("/");
};
