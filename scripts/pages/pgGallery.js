const Image = require("sf-core/ui/image");
const Color = require("sf-core/ui/color");
const Screen = require("sf-core/device/screen");
const extend = require('js-base/core/extend');
const PgGalleryDesign = require('ui/ui_pgGallery');
const getNewsByCategory = require("../service/index").getNewsByCategory;
const findImageUrlByIndex = require("../utils/index").findImageUrlByIndex;
const showDeleteMenu = require("../utils/index").showDeleteMenu;
const categories = require("../categories").all;
const constants = require("../constants");
const GALLERY_ITEM_ACTION = constants.GALLERY_ITEM_ACTION;
const HeaderBarItem = require('sf-core/ui/headerbaritem');

const PgGallery = extend(PgGalleryDesign)(
    // Constructor
    function(_super,routeData, router) {
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
function onShow(superOnShow) {
    superOnShow();
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
        image:Image.createFromFile("images://leftarrow.png"),
        onPress: ()=> {
            this._router.goBack()
        }
    });
   
    page.headerBar.setLeftItem(myItem);// .setLeftItem(myItem);
    
    page.onOrientationChange = function() {
        page.gvMain.layoutManager.spanCount = getSpanCountByScreenWidth();
    };

    page.flindicator.visible = true;
    getNewsByCategory(categories[0])
        .then(news => {
            initGridView.call(page, page.gvMain, news);
            page.flindicator.visible = false;
        })    
        .catch(e => alert(e));
}

function initGridView(gridView, news) {
    const page = this;
    var newsToShow = news;

    // IS USED TO TEST PERFORMANCE, MAY BE REMOVED
    //newsToShow = [];
    //for (let i = 0; i < 10; ++i) {
    //    newsToShow = newsToShow.concat(news);
    //}
    // IS USED TO TEST PERFORMANCE, MAY BE REMOVED

    gridView.onItemBind = function(item, index) {
        var imageUrl = findImageUrlByIndex(newsToShow, index);
        imageUrl && (item.src = imageUrl);
    };

    gridView.onItemSelected = function(item, index) {
        showDeleteMenu(page)
            .then(action => {
                
                switch (action) {
                    case GALLERY_ITEM_ACTION.SHOW:
                        let imageUrl = findImageUrlByIndex(newsToShow, index);
                        page._router.push("/detailgallery", { imageUrl });
                        break;
                    case GALLERY_ITEM_ACTION.DELETE:
                        newsToShow.splice(index, 1);
                        gridView.itemCount = newsToShow.length;
                        gridView.refreshData();
                        break;
                }
            });
    };

    // Make gallery items square sized
    gridView.layoutManager.onItemLength = function(length) {
        return length;
    };

    gridView.layoutManager.spanCount = getSpanCountByScreenWidth();
    gridView.itemCount = newsToShow.length;
   
    gridView.refreshData();
}

// iPod 320
// iPhone 375
// iPhone Plus 414
function getSpanCountByScreenWidth() {
    var screenWidth = Screen.width;
    var spanCount = 2; // Default

    if (screenWidth >= 375)
        spanCount = 3;
    if (screenWidth >= 414)
        spanCount = 4;

    //console.log(`Screen.width ${screenWidth}`);

    return spanCount;
}

module.exports = PgGallery;
