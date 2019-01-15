const extend = require('js-base/core/extend');
const PgMainDesign = require('ui/ui_pgMain');
const Image = require("sf-core/ui/image");
const Color = require("sf-core/ui/color");
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const Application = require("sf-core/application");

const PgMain = extend(PgMainDesign)(
    // Constructor
    function(_super, routeData, router) {
        // Initalizes super class for this page scope
        _super(this);
        this._router = router;
        this._routeData = routeData;
        // Overrides super.onShow method
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        // Overrides super.onLoad method
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    }
);

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
    superOnShow();
    const page = this;
    //page.indicator.visible = false;
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    
    const page = this;
    page.headerBar.itemColor = Color.create("#ffffff");
    page.headerBar.visible = true;
    page.headerBar.leftItemEnabled = true;

    var myItem = new HeaderBarItem({
        title: "Smartface",
        //if any image is not put here onPress will not be activated
        image: Image.createFromFile("images://leftarrow.png"),
        onPress: () => {
            Application.exit();
        }
    });

    page.headerBar.setLeftItem(myItem); // .setLeftItem(myItem);

    page.btnNews.onPress = function() {
        page._router.push("/news");
    };
    page.btnGallery.onPress = function() {
        page._router.push("/gallery");
    };
}

module.exports = PgMain;
