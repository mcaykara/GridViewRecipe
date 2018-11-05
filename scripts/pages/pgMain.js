const Router = require("sf-core/ui/router");
const extend = require('js-base/core/extend');
const PgMainDesign = require('ui/ui_pgMain');

const PgMain = extend(PgMainDesign)(
    // Constructor
    function(_super) {
        // Initalizes super class for this page scope
        _super(this);
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();

    const page = this;
    page.indicator.visible = false;
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();

    const page = this;
    page.headerBar.leftItemEnabled = false;

    page.btnNews.onPress = function() {
        page.indicator.visible = true;
        setTimeout(_ => { Router.go("pgNews"); }, 500);

    };
    page.btnGallery.onPress = function() {
        page.indicator.visible = true;
        setTimeout(_ => { Router.go("pgGallery"); }, 500);
    };
}

module.exports = PgMain;
