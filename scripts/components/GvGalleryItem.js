const Image = require("sf-core/ui/image");
const extend = require('js-base/core/extend');
const GvGalleryItemDesign = require('library/GvGalleryItem');

const GvGalleryItem = extend(GvGalleryItemDesign)(
    // Constructor
    function(_super, props, pageName) {
        // Initalizes super class for this scope
        _super(this, props || {});
        this.pageName = pageName;

        var src = "";
        var placeholderImage = Image.createFromFile("images://placeholder.png");
        Object.defineProperty(this, "src", {
            configurable: false,
            enumerable: true,
            get: function() {
                return src;
            },
            set: function(value) {
                this.img.loadFromUrl(src = value, placeholderImage);
            }
        });
    }
);

module.exports = GvGalleryItem;
