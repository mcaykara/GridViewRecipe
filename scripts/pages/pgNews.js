const NewItem = require("components/NewItem");
const addChild = require("@smartface/contx/lib/smartface/action/addChild");
const Color = require("sf-core/ui/color");
const extend = require('js-base/core/extend');
const PgNewsDesign = require('ui/ui_pgNews');
const fetchNews = require("../utils/index").fetchNews;
const categories = require("../categories").all;
const combinedCategories = require("../categories").combined;
const constants = require("../constants");
const CATEGORIES_TO_FETCH = constants.CATEGORIES_TO_FETCH;
const NEW_ITEM_ROW_TYPE = require("../constants").NEW_ITEM_ROW_TYPE;

const PgNews = extend(PgNewsDesign)(
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
    fetchNews()
        .then(fetchedNews => initListView(page.lvMain, fetchedNews))
        .catch(e => alert(e));
}

function initListView(listView, fetchedNews) {
    if (!fetchNews)
        return;
    var news = fetchedNews;

    listView.onRowBind = (function() {
        var categoriesShown = CATEGORIES_TO_FETCH;

        return function(item, index) {
            var category = categories[index];
            var currentNews = news[category];
            item.category = category;
            item.news = currentNews;
            item.news2 = news.home;
            item.resetPosition();

            // Lazy loading
            if (index === categoriesShown - 1 && categoriesShown < categories.length) {
                fetchNews()
                    .then(e => {
                        if (!e)
                            return;

                        news = e;
                        categoriesShown += CATEGORIES_TO_FETCH;
                        if (categoriesShown > categories.length)
                            categoriesShown = categories.length;
                        listView.itemCount = categoriesShown;
                        listView.refreshData();
                    })
                    .catch(e => alert(e));
            }
        };
    })();

    listView.onPullRefresh = function() {
        listView.stopRefresh();
    };

    listView.onRowType = function(index) {
        var category = categories[index];
        var isCategoryCombined = combinedCategories.includes(category);
        return isCategoryCombined ? NEW_ITEM_ROW_TYPE.DOUBLE : NEW_ITEM_ROW_TYPE.SINGLE;
    };

    listView.onRowHeight = function(index) {
        var category = categories[index];
        var isCategoryCombined = combinedCategories.includes(category);
        return isCategoryCombined ? 500 : 200;
    };

    listView.onRowCreate = (function() {
        var itemIndex = 0;

        return function(type) {
            var Item = NewItem(type);
            var myListViewItem = new Item();
            this.dispatch(addChild("item" + (++itemIndex), myListViewItem));
            myListViewItem.dispatch({
                type: "updateUserStyle",
                userStyle: {
                    paddingLeft: 10
                }
            });
            return myListViewItem;
        };
    })();

    listView.itemCount = CATEGORIES_TO_FETCH;
    listView.refreshData();
}

module.exports = PgNews;
