const Color = require("sf-core/ui/color");
const Image = require("sf-core/ui/image");
const extend = require('js-base/core/extend');
const PgGalleryDetailDesign = require('ui/ui_pgGalleryDetail');
const placeholderImage = Image.createFromFile("images://placeholder.png");

const PgGalleryDetail = extend(PgGalleryDetailDesign)(
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
function onShow(superOnShow, e = {}) {
    superOnShow();

    const page = this;
    page.img.loadFromUrl(e.imageUrl, placeholderImage);
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();

    const page = this;
    page.headerBar.itemColor = Color.create("#000000");

}

module.exports = PgGalleryDetail;
