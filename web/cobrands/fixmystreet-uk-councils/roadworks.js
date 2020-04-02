/* Using this file, you also need to include the JavaScript file
 * OpenLayers.Projection.OrdnanceSurvey.js for the 27700 conversion, and an
 * OpenLayers build that includes OpenLayers.Layer.SphericalMercator and
 * OpenLayers.Format.GeoJSON.
 */

(function(){

var rw_stylemap = new OpenLayers.StyleMap({
    'default': new OpenLayers.Style({
        fillOpacity: 1,
        fillColor: "#FFFF00",
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWidth: 2,
        pointRadius: 6,
        graphicWidth: 39,
        graphicHeight: 25,
        graphicOpacity: 1,
        externalGraphic: '/cobrands/tfl/warning@2x.png'
    }),
    'hover': new OpenLayers.Style({
        fillColor: "#55BB00",
        externalGraphic: '/cobrands/tfl/warning-green@2x.png'
    }),
    'select': new OpenLayers.Style({
        fillColor: "#55BB00",
        externalGraphic: '/cobrands/tfl/warning-green@2x.png'
    })
});

var roadworks_defaults = {
    http_options: {
        url: "https://tilma.staging.mysociety.org/streetmanager.php"
    },
    srsName: "EPSG:27700",
    format_class: OpenLayers.Format.GeoJSON,
    strategy_class: OpenLayers.Strategy.FixMyStreet,
    stylemap: rw_stylemap,
    non_interactive: true,
    always_visible: true,
    nearest_radius: 100,
    road: true,
    all_categories: true,
    actions: {
        found: function(layer, feature) {
            $(".js-roadworks-message-" + layer.id).remove();
            if (!fixmystreet.roadworks.filter || fixmystreet.roadworks.filter(feature)) {
                fixmystreet.roadworks.display_message(feature);
                return true;
            }
        },
        not_found: function(layer) {
            $(".js-roadworks-message-" + layer.id).remove();
        }
    }
};

fixmystreet.roadworks = {};

// fixmystreet.map.layers[5].getNearestFeature(new OpenLayers.Geometry.Point(-0.835614, 51.816562).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857")), 10)

fixmystreet.roadworks.config = {};

fixmystreet.roadworks.display_message = function(feature) {
    var attr = feature.attributes,
        start = new Date(attr.start_date).toDateString(),
        end = new Date(attr.end_date).toDateString(),
        summary = attr.summary,
        desc = attr.description;

    var config = this.config,
        summary_heading_text = config.summary_heading_text || 'Summary',
        tag_top = config.tag_top || 'p',
        colon = config.colon ? ':' : '';

    var $msg = $('<div class="js-roadworks-message js-roadworks-message-' + feature.layer.id + ' box-warning"><' + tag_top + '>Roadworks are scheduled near this location, so you may not need to report your issue.</' + tag_top + '></div>');
    var $dl = $("<dl></dl>").appendTo($msg);
    $dl.append("<dt>Dates" + colon + "</dt>");
    var $dates = $("<dd></dd>").appendTo($dl);
    $dates.text(start + " until " + end);
    if (config.extra_dates_text) {
        $dates.append('<br>' + config.extra_dates_text);
    }
    $dl.append("<dt>" + summary_heading_text + colon + "</dt>");
    $dl.append($("<dd></dd>").text(summary));
    if (desc) {
        $dl.append("<dt>Description" + colon + "</dt>");
        $dl.append($("<dd></dd>").text(desc));
    }
    if (attr.promoter) {
        $dl.append("<dt>Responsibility</dt>");
        $dl.append($("<dd></dd>").text(attr.promoter));
    }

    if (config.text_after) {
        $dl.append(config.text_after);
    }

    $msg.prependTo('#js-post-category-messages');
};

fixmystreet.assets.add(roadworks_defaults);

})();
