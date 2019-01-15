const View = require("sf-core/ui/view");
const System = require("sf-core/device/system");
const active = require("./active");
const extendEvent = require("sf-extension-utils/lib/extendEvent");
const StackRouter = require("@smartface/router/src/native/NativeStackRouter");

const buildExtender = ({
    pageName,
    singleton = false,
    onHide,
    onShow,
    onLoad,
    headerBarStyle = {},
    preProcessor,
    postProcessor,
    pageProps = {}
}) => {
    let builder = (router, route) => {
        let { routeData, match, view } = route.getState();
        if (routeData && routeData.routeData)
            routeData = routeData.routeData;
        routeData = routeData || {};

        preProcessor && preProcessor(match, routeData, router, view, pageProps, route);
        buildExtender.preProcessors.forEach(pp => pp(match, routeData, router, view, pageProps, route));
        let pageInstance;

        if (view && singleton) {
            pageInstance = view;
        }
        else {
            let PageClass = require(`pages/${pageName}`);
            pageInstance = new PageClass(pageProps, match, routeData, router, route);
        }
        if (!pageInstance.extendEvent) {
            pageInstance.extendEvent = extendEvent.bind(null, pageInstance);

            if (System.OS === "iOS") {
                let pageHeaderbarStyle = {};
                ["leftItemEnabled", "largeTitleDisplayMode"]
                .forEach(key => {
                    if (headerBarStyle.hasOwnProperty(key))
                        pageHeaderbarStyle[key] = headerBarStyle[key];
                });
                if (Object.keys(pageHeaderbarStyle).length) {
                    pageInstance.extendEvent("onLoad", () => {
                        pageInstance.headerBar.dispatch({
                            type: "updateUserStyle",
                            userStyle: pageHeaderbarStyle
                        });
                    });
                }

                let controllerHeaderbarStyle = {};
                ["visible"]
                .forEach(key => {
                    if (headerBarStyle.hasOwnProperty(key))
                        controllerHeaderbarStyle[key] = headerBarStyle[key];
                });
                if (Object.keys(controllerHeaderbarStyle).length && router.headerBar) {
                    pageInstance.extendEvent("onShow", () => {
                        Object.assign(router.headerBar, controllerHeaderbarStyle);
                    });
                }

            }

            onHide && pageInstance.extendEvent("onHide", onHide);
            onShow && pageInstance.extendEvent("onShow", onShow);
            onLoad && pageInstance.extendEvent("onLoad", onLoad);

            pageInstance.extendEvent("onShow", () => {
                active.page = pageInstance;
            });
            pageInstance.extendEvent("onLoad", () => {
                if (System.OS == "iOS") {
                    if (pageInstance.parentController && pageInstance.parentController.childControllers[0] === pageInstance) {
                        var view = pageInstance.parentController.nativeObject.valueForKey("view");
                        view && view.setValueForKey(View.ios.viewAppearanceSemanticContentAttribute, "semanticContentAttribute");
                    }
                }
            });
        }

        router instanceof StackRouter &&
            (pageInstance.setBackItem = (item) => {

            });

        Object.assign(pageInstance, { match, routeData, router, pageName });

        buildExtender.postProcessors.forEach(pp => pp(match, routeData, router, pageInstance, pageProps, route));
        postProcessor && postProcessor(match, routeData, router, pageInstance, pageProps, route);

        return pageInstance;
    };
    return builder;
};

module.exports = exports = buildExtender;

buildExtender.preProcessors = [];
buildExtender.postProcessors = [];