/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};

require("sf-extension-utils");
require("./theme");
const Router = require("sf-core/ui/router");
const initService = require("./service/index").init;

//initService();

// Define routes and go to initial page of application
Router.add("pgMain", require("./pages/pgMain"));
Router.add("pgGallery", require("./pages/pgGallery"));
Router.add("pgNews", require("./pages/pgNews"));
Router.add("pgGalleryDetail", require("./pages/pgGalleryDetail"));
Router.go("pgMain");
