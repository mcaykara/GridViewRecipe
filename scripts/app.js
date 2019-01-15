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
        Route.of({
            path: "/main",
            headerBarParams: () => { visible: true },
            build: (router, route) => {
                const { routeData, view } = route.getState();
                let PgMain = require("./pages/pgMain");
                return new PgMain(routeData, router);
            }
        }),
        Route.of({
            path: "/gallery",
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
            path: "/news",
            headerBarParams: () => { visible: true },
            build: (router, route) => {
                const { routeData, view } = route.getState();
                let PgNews = require("./pages/pgNews");
                return new PgNews(routeData, router);
            }
        }),
        Route.of({
            path: "/detailgallery",
            headerBarParams: () => { visible: true },
            build: (router, route) => {
                const { routeData, view } = route.getState();
                let PgNews = require("./pages/pgGalleryDetail");
                return new PgNews(routeData, router);
            }
        }),
        /*StackRouter.of({
            path: "/dgallery",
            homeRoot: 0,
            modal: true,
            routes: [
                Route.of({
                    path: "/dgallery/detail",
                    routeDidEnter: (router, route) => {
                        console.log('State:' + route.isModal());
                    },
                    build: (router, route) => {
                        const { routeData, view } = route.getState();
                        let PgGalleryDetail = require("./pages/pgGalleryDetail");
                        return new PgGalleryDetail(routeData, router, () => router.push('./pages/pgGalleryDetail'));
                    },

                }),
                StackRouter.of({
                    path: '/dgallery',
                    modal: true,
                    routes: [
                        Route.of({
                            path: "/dgallery/detail",
                            build: (router, route) => {
                                const { routeData, view } = route.getState();
                                let PgGalleryDetail = require("./pages/pgGalleryDetail");
                                return new PgGalleryDetail(routeData, router, () => router.dismiss());
                            }
                        })
                    ]
                })

            ]
        })*/
    ]
});

//initService();

router.push("/main");
