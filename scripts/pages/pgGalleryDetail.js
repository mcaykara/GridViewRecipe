const Image = require("sf-core/ui/image");
const Color = require("sf-core/ui/color");
const extend = require('js-base/core/extend');
const PgGalleryDetailDesign = require('ui/ui_pgGalleryDetail');
const NEW_ITEM_ROW_TYPE = require("../constants").NEW_ITEM_ROW_TYPE;
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const placeholderImage = Image.createFromFile("images://placeholder.png");
const PgGalleryDetail = extend(PgGalleryDetailDesign)(
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
    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow, e = {}) {
    superOnShow();
    const page = this;
    page.img.loadFromUrl(page._routeData.imageUrl, placeholderImage);
    page.flindicator.visible = false;
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    page.flindicator.visible = true; // TODO: Change name to indicator
    
    page.headerBar.itemColor = Color.create("#ffffff");
    page.headerBar.visible = true;
    page.headerBar.leftItemEnabled = true;
    
    var myItem = new HeaderBarItem({
        title: "Smartface",
        image:Image.createFromFile("images://leftarrow.png"),
        onPress: ()=> {
            page._router.dismiss();
        }    
    });
    page.headerBar.setLeftItem(myItem);
}

module.exports = PgGalleryDetail;
