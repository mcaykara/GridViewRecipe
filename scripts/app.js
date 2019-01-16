/* globals lang */
require("i18n/i18n.js"); // Generates global lang object
// const buildExtender = require("buildExtender");

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

const initService = require("./service/index").init;

const {
    NativeRouter: Router,
    Router: RouterBase,
    NativeStackRouter: StackRouter,
    BottomTabBarRouter,
    Route
} = require("@smartface/router");

const router = Router.of({
    path: "/",
    isRoot: true,
    routes: [
        StackRouter.of({
            path: "/pages",
            headerBarParams: () => { ios: { translucent: false } },
            routes: [
                Route.of({
                    path: "/pages/main",
                    headerBarParams: () => { visible: true },
                    build: (router, route) => {
                        const { routeData, view } = route.getState();
                        let PgMain = require("./pages/pgMain");
                        return new PgMain(routeData, router);
                    }
                }),
                Route.of({
                    path: "/pages/gallery",
                    headerBarParams: () => { visible: true },
                    build: (router, route) => {
                        const { routeData, view } = route.getState();
                        let PgGallery = require("./pages/pgGallery");
                        return new PgGallery(routeData, router);
                    },
                    routeDidEnter: (router, route) => {
                        console.log(router.getState());
                    },
                }),
                Route.of({
                    path: "/pages/news",
                    headerBarParams: () => { visible: true },
                    build: (router, route) => {
                        const { routeData, view } = route.getState();
                        let PgNews = require("./pages/pgNews");
                        return new PgNews(routeData, router);
                    }
                }),
                StackRouter.of({
                    path: "/pages",
                    modal: true,
                    headerBarParams: () => { ios: { translucent: false } },
                    routes: [
                        Route.of({
                            path: "/pages/detailgallery",
                            headerBarParams: () => { visible: true },
                            build: (router, route) => {
                                const { routeData, view } = route.getState();
                                let PgMain = require("./pages/pgGalleryDetail");
                                return new PgMain(routeData, router);
                            }
                        })
                    ]
                })    
            ]
        })
    ]
});



router.push("/pages/main");
