const app = require("./src/app");
require("./src/database");

app.listen(app.get("port"), () => {
  app.locals.host = 'localhost'
  app.locals.port = app.get("port")
  app.locals.protocol = 'http://'
  app.locals.serverURL = `${app.locals.protocol}${app.locals.host}:${app.locals.port}`
  console.log(`Server is running on port ${app.get("port")}`);
});
