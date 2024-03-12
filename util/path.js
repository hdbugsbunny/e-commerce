const path = require("path");

//! deprecated but still available
// module.exports = path.dirname(process.mainModule.filename);

module.exports = path.dirname(require.main.filename);
