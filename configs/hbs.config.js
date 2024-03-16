const hbs = require("hbs");
const { options } = require("./routes.config");

hbs.registerPartials(`${__dirname}/../views/partials`);

hbs.registerHelper("navActive", (path, match, option) => {
  return path === match ? "active" : "";
});

hbs.registerHelper('isOwnedBy', function (resource, currentUser, options) {
  if (resource.owner == currentUser.id || resource.owner?.id == currentUser.id) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
