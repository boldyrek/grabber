( function() {
    if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; }

    try {
        ch_url_parts = document.location.pathname.split("/");
        var query = ch_url_parts[2].replace(/\-|\+/g, " ");

    } catch(e) {
    }

    var unit = {
        'client' : 'oodle',
        'disable_rtb': true,
        'width' : 730,
        'height' : 150,
        'cid' : 'listings',
        'sid' : 'Oodle Listings MPU',
        'query' : query
    }

    var placement_id = window.CHITIKA.units.length;
    window.CHITIKA.units.push(unit);

    document.write('<div id="chitikaAdBlock-' + placement_id.toString() + '"></div>');
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'http://scripts.chitika.net/eminimalls/amm-rtb.js';

    try {
        document.getElementsByTagName('head')[0].appendChild(s);
    } catch(e) {
        document.write(s.outerHTML);
    }
}());
