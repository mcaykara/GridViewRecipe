const extend = require('js-base/core/extend');
const LvNewItemDesign = require('library/LvNewItem');
const LvNewItemDoubleDesign = require('library/LvNewItemDouble');

const capitalizeFirstLetter = require("../utils/index").capitalizeFirstLetter;
const findImageUrlByIndex = require("../utils/index").findImageUrlByIndex;
const categories = require("../categories").all;
const combinedMap = require("../categories").combinedMap;
const NEW_ITEM_ROW_TYPE = require("../constants").NEW_ITEM_ROW_TYPE;
const NEW_COUNT_INITIAL = 30;
const NEW_COUNT_TO_LOAD_EACH_TIME = 10;

// Indexes of news of each category
var favoriteNewsByCategory = {};
categories.forEach(c => favoriteNewsByCategory[c] = {});

module.exports = function(type) {
    var isSingleDesign = type === NEW_ITEM_ROW_TYPE.SINGLE;
    var Design = isSingleDesign ?
        LvNewItemDesign :
        LvNewItemDoubleDesign;

    return extend(Design)(
        // Constructor
        function(_super, props, pageName) {
            // Initalizes super class for this scope
            _super(this, props || {});
            this.pageName = pageName;

            var category = "";
            Object.defineProperty(this, "category", {
                configurable: false,
                enumerable: true,
                get: function() {
                    return category;
                },
                set: function(value) {
                    category = value;
                    this.lblCategory.text = isSingleDesign ?
                        capitalizeFirstLetter(category) :
                        (combinedMap[category] || capitalizeFirstLetter(category));
                }
            });

            var news = [];
            Object.defineProperty(this, "news", {
                configurable: false,
                enumerable: true,
                get: function() {
                    return news;
                },
                set: function(value) {
                    if (!value)
                        return;
                    news = value;
                    this.gvCategoryNews.itemCount = news.length;
                    this.gvCategoryNews.refreshData();
                }
            });

            var news2 = [];
            Object.defineProperty(this, "news2", {
                configurable: false,
                enumerable: true,
                get: function() {
                    return news2;
                },
                set: function(value) {
                    if (isSingleDesign || !value)
                        return;
                    news2 = value;
                    this.gvCategoryNews2.itemCount = news2.length;
                    this.gvCategoryNews2.refreshData();
                }
            });

            this.resetPosition = function() {
                this.gvCategoryNews.scrollTo(0, false);
                !isSingleDesign && this.gvCategoryNews2.scrollTo(0, false);
            };

            initGridViewByLength(this.gvCategoryNews, 1);
            !isSingleDesign && initGridViewByLength(this.gvCategoryNews2, 2);

            function initGridViewByLength(gridView, length) {
                gridView.onItemBind = function(item, index) {
                    var newsObject = length === 1 ? news : news2;
                    var imageUrl = findImageUrlByIndex(newsObject, index);
                    var currentNew = newsObject[index];
                    var favoriteNews = favoriteNewsByCategory[category];
                    item.newHeader = currentNew.title;
                    item.newDetail = currentNew.abstract;
                    imageUrl && (item.newImage = imageUrl);

                    var shouldEnableFavorite = favoriteNews[index];
                    item.favorite = shouldEnableFavorite;

                    item.imgBookmark.onTouchEnded = function() {
                        item.favorite = !item.favorite;
                        favoriteNews[index] = item.favorite;
                    }.bind(item, index);
                };

                gridView.onPullRefresh = function() {
                    gridView.stopRefresh();
                };

                gridView.layoutManager.onItemLength = function() {
                    return 300; // Default width
                };

                gridView.itemCount = 0;
            }
        }
    );
};
