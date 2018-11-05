const extend = require('js-base/core/extend');
const GvNewItemDesign = require('library/GvNewItem');
const Image = require('sf-core/ui/image');

const GvNewItem = extend(GvNewItemDesign)(
    // Constructor
    function(_super, props, pageName) {
        // Initalizes super class for this scope
        _super(this, props || {});
        this.pageName = pageName;

        var newHeader = "";
        Object.defineProperty(this, "newHeader", {
            configurable: false,
            enumerable: true,
            get: function() {
                return newHeader;
            },
            set: function(value) {
                this.lblNewHeader.text = newHeader = value;
            }
        });

        var newDetail = "";
        Object.defineProperty(this, "newDetail", {
            configurable: false,
            enumerable: true,
            get: function() {
                return newDetail;
            },
            set: function(value) {
                this.lblNewDetail.text = newDetail = value;
            }
        });

        var newImage = "";
        var placeholderImage = Image.createFromFile("images://placeholder.png");
        Object.defineProperty(this, "newImage", {
            configurable: false,
            enumerable: true,
            get: function() {
                return newImage;
            },
            set: function(value) {
                this.imgMain.loadFromUrl(newImage = value, placeholderImage);
            }
        });

        var favorite = false;
        Object.defineProperty(this, "favorite", {
            configurable: false,
            enumerable: true,
            get: function() {
                return favorite;
            },
            set: function(value) {
                favorite = value;
                if (favorite) {
                    this.imgBookmark.dispatch({
                        type: "pushClassNames",
                        classNames: ".img-bookmark.active"
                    });
                }
                else {
                    this.imgBookmark.dispatch({
                        type: "removeClassName",
                        className: ".img-bookmark.active"
                    });
                }
            }
        });
    }
);

module.exports = GvNewItem;
