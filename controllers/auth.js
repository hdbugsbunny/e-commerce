exports.getLogin = (req, res, next) => {
  const isAuthenticated =
    req.get("Cookie").split(";")[1].trim().split("=")[1] === "true";
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "isAuthenticated=true");
  res.redirect("/");
};
