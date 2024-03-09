const hbs = require("hbs");
const { options } = require("./routes.config");

hbs.registerPartials(`${__dirname}/../views/partials`);

hbs.registerHelper("navActive", (path, match, option) => {
  return path === match ? "active" : "";
});
