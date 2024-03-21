const hbs = require("hbs");
const { options } = require("./routes.config");
const dayjs = require("../configs/dayjs.config");

hbs.registerPartials(`${__dirname}/../views/partials`);

hbs.registerHelper("isOwnedBy", function (resource, currentUser, options) {
  if (
    resource.owner == currentUser.id ||
    resource.owner?.id == currentUser.id
  ) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper("dateFormat", (options) => {
  const { date, format } = options.hash;
  return dayjs(date).format(format || "YYYY-MM-DD HH:mm:ss");
});
