var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CZ;
(function (CZ) {
    (function (UI) {
        var FormEditCollection = (function (_super) {
            __extends(FormEditCollection, _super);
            function FormEditCollection(container, formInfo) {
                var _this = this;
                _super.call(this, container, formInfo);
                this.contentItem = {};

                this.saveButton = container.find(formInfo.saveButton);
                this.backgroundInput = container.find(formInfo.backgroundInput);
                this.collectionTheme = formInfo.collectionTheme;
                this.activeCollectionTheme = jQuery.extend(true, {}, formInfo.collectionTheme);
                this.mediaListContainer = container.find(formInfo.mediaListContainer);
                this.kioskmodeInput = formInfo.kioskmodeInput;

                this.timelineBackgroundColorInput = formInfo.timelineBackgroundColorInput;
                this.timelineBackgroundOpacityInput = formInfo.timelineBackgroundOpacityInput;
                this.timelineBorderColorInput = formInfo.timelineBorderColorInput;
                this.exhibitBackgroundColorInput = formInfo.exhibitBackgroundColorInput;
                this.exhibitBackgroundOpacityInput = formInfo.exhibitBackgroundOpacityInput;
                this.exhibitBorderColorInput = formInfo.exhibitBorderColorInput;

                this.backgroundInput.on('input', function () {
                    _this.updateCollectionTheme(true);
                });

                this.kioskmodeInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBackgroundColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBackgroundOpacityInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.timelineBorderColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBackgroundOpacityInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.exhibitBorderColorInput.change(function () {
                    _this.updateCollectionTheme(true);
                });

                this.saveButton.off();

                this.backgroundInput.focus(function () {
                    _this.backgroundInput.hideError();
                });

                try  {
                    this.initialize();
                } catch (e) {
                    console.log("Error initializing collection form attributes");
                }

                this.saveButton.click(function (event) {
                    _this.updateCollectionTheme(true);
                    _this.activeCollectionTheme = _this.collectionTheme;

                    var themeData = {
                        theme: JSON.stringify(_this.collectionTheme)
                    };

                    CZ.Service.putCollection(CZ.Service.superCollectionName, CZ.Service.collectionName, themeData).always(function () {
                        _this.saveButton.prop('disabled', false);
                        _this.close();
                    });
                });
            }
            FormEditCollection.prototype.initialize = function () {
                this.saveButton.prop('disabled', false);

                this.backgroundInput.val(this.collectionTheme.backgroundUrl);
                this.mediaList = new CZ.UI.MediaList(this.mediaListContainer, CZ.Media.mediaPickers, this.contentItem, this);
                this.kioskmodeInput.attr("checked", this.collectionTheme.kioskMode);

                this.timelineBackgroundColorInput.val(this.getColorFromRGBA(this.collectionTheme.timelineColor));
                this.timelineBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.timelineColor));
                this.timelineBorderColorInput.val(this.collectionTheme.timelineStrokeStyle);

                this.exhibitBackgroundColorInput.val(this.getColorFromRGBA(this.collectionTheme.infoDotFillColor));
                this.exhibitBackgroundOpacityInput.val(this.getOpacityFromRGBA(this.collectionTheme.infoDotFillColor));
                this.exhibitBorderColorInput.val(this.collectionTheme.infoDotBorderColor);
            };

            FormEditCollection.prototype.colorIsRgba = function (color) {
                return color.substr(0, 5) === "rgba(";
            };

            FormEditCollection.prototype.rgbaFromColor = function (color, alpha) {
                if (this.colorIsRgba(color)) {
                    var parts = color.substr(5, color.length - 5 - 1).split(",");
                    if (parts.length > 3)
                        parts[parts.length - 1] = alpha.toString();
                    else
                        parts.push(alpha.toString());
                    return "rgba(" + parts.join(",") + ")";
                }

                var red = parseInt("0x" + color.substr(1, 2));
                var green = parseInt("0x" + color.substr(3, 2));
                var blue = parseInt("0x" + color.substr(5, 2));

                return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
            };

            FormEditCollection.prototype.getOpacityFromRGBA = function (rgba) {
                if (!rgba)
                    return null;

                var parts = rgba.split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return parseFloat(lastPart);
            };

            FormEditCollection.prototype.getColorFromRGBA = function (rgba) {
                if (!this.colorIsRgba(rgba))
                    return null;

                var parts = rgba.substr(5, rgba.length - 5 - 1).split(",");
                var lastPart = parts[parts.length - 1].split(")")[0];
                return "#" + this.colorHexFromInt(parts[0]) + this.colorHexFromInt(parts[1]) + this.colorHexFromInt(parts[2]);
            };

            FormEditCollection.prototype.colorHexFromInt = function (colorpart) {
                var hex = Number(colorpart).toString(16);
                if (hex.length === 1)
                    return "0" + hex;

                return hex;
            };

            FormEditCollection.prototype.updateCollectionTheme = function (clearError) {
                this.collectionTheme = {
                    backgroundUrl: this.backgroundInput.val(),
                    backgroundColor: "#232323",
                    timelineColor: this.rgbaFromColor(this.timelineBackgroundColorInput.val(), this.timelineBackgroundOpacityInput.val()),
                    timelineStrokeStyle: this.timelineBorderColorInput.val(),
                    infoDotFillColor: this.rgbaFromColor(this.exhibitBackgroundColorInput.val(), this.exhibitBackgroundOpacityInput.val()),
                    infoDotBorderColor: this.exhibitBorderColorInput.val(),
                    kioskMode: this.kioskmodeInput.prop("checked")
                };

                if (this.colorIsRgba(this.timelineBackgroundColorInput.val())) {
                    this.timelineBackgroundColorInput.val(this.collectionTheme.timelineColor);
                    this.exhibitBackgroundColorInput.val(this.collectionTheme.infoDotFillColor);
                }

                if (clearError)
                    this.backgroundInput.hideError();

                this.updateCollectionThemeFromTheme(this.collectionTheme);
            };

            FormEditCollection.prototype.updateCollectionThemeFromTheme = function (theme) {
                CZ.Settings.applyTheme(theme, false);

                CZ.Common.vc.virtualCanvas("forEachElement", function (element) {
                    if (element.type === "timeline") {
                        element.settings.fillStyle = theme.timelineColor;
                        element.settings.strokeStyle = theme.timelineStrokeStyle;
                        element.settings.gradientFillStyle = theme.timelineStrokeStyle;
                    } else if (element.type === "infodot") {
                        element.settings.fillStyle = theme.infoDotFillColor;
                        element.settings.strokeStyle = theme.infoDotBorderColor;
                    }
                });

                CZ.Common.vc.virtualCanvas("requestInvalidate");
            };

            FormEditCollection.prototype.updateMediaInfo = function () {
                var clearError = true;

                if (this.contentItem.mediaType == "skydrive-image") {
                    this.backgroundInput.val(this.contentItem.tempSource || "");
                    clearError = false;
                    this.backgroundInput.showError("SkyDrive static links are not permanent. Consider hosting it as a public image instead.");
                } else {
                    this.backgroundInput.val(this.contentItem.uri || "");
                }

                this.updateCollectionTheme(clearError);
            };

            FormEditCollection.prototype.show = function () {
                _super.prototype.show.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500
                });

                this.activationSource.addClass("active");
            };

            FormEditCollection.prototype.close = function () {
                var _this = this;
                _super.prototype.close.call(this, {
                    effect: "slide",
                    direction: "left",
                    duration: 500,
                    complete: function () {
                        _this.backgroundInput.hideError();
                        _this.mediaList.remove();
                    }
                });

                this.backgroundInput.hideError();
                this.updateCollectionThemeFromTheme(this.activeCollectionTheme);
            };
            return FormEditCollection;
        })(CZ.UI.FormUpdateEntity);
        UI.FormEditCollection = FormEditCollection;
    })(CZ.UI || (CZ.UI = {}));
    var UI = CZ.UI;
})(CZ || (CZ = {}));
