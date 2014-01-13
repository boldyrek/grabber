// Begin primedia autos script 
// modDate: 11Jul2007 14:10EST | mak
// modDate: 09Jan2008 04:32EST | rw
// get script
var vm_es = document.getElementsByTagName('script');
var vm_url = '';
for (i = 0; i < vm_es.length; i ++) {
    var vm_src;
    if (vm_es[i].src.indexOf('automotive_itxt.js') >= 0) {
        vm_url = vm_es[i].src;
    }
}
vm_url = vm_url.toLowerCase();

// get the parameters
vm_url.match(/\?(.+)$/);
var vm_params = RegExp.$1;

// split up the query string and store in an array
var vm_params = vm_params.split("&");
var vm_qsl = {};
for(var i=0;i<vm_params.length;i++)
{
    var tmp = vm_params[i].split("=");
    vm_qsl[tmp[0]] = unescape(tmp[1]);
}

// get "make" and "subid"
var vm_make  = vm_qsl['make'];
var vm_subid = vm_qsl['subid'];

// tidy "make" and "subid"
if (("1" != vm_subid) && ("2" != vm_subid) && ("3" != vm_subid))
    vm_subid = "1";

// decide IPID
var ipid    = "0";
var url     = this.location + "";

// Section for Primedia's In-Market Sites
if (url.indexOf("automotive.com") != -1) {
    switch (vm_make) {
        case "buick":
            switch (vm_subid){
                case "2":   ipid = 8677;   break;
                case "3":   ipid = 8678;   break;
                default:    ipid = 8676;   break;
            }
        break;
 
        case "cadillac":
            switch (vm_subid){
                case "2":   ipid = 8680;   break;
                case "3":   ipid = 8681;   break;
                default:    ipid = 8679;   break;
            }
        break;
 
        case "chevrolet":
            switch (vm_subid){
                case "2":   ipid = 8683;   break;
                case "3":   ipid = 8684;   break;
                default:    ipid = 8682;   break;
            }
        break;
 
        case "chrysler":
            switch (vm_subid){
                case "2":   ipid = 8686;   break;
                case "3":   ipid = 8687;   break;
                default:    ipid = 8685;   break;
            }
        break;
 
        case "dodge":
            switch (vm_subid){
                case "2":   ipid = 8689;   break;
                case "3":   ipid = 8690;   break;
                default:    ipid = 8688;   break;
            }
        break;
 
        case "elper and critics":
            switch (vm_subid){
                case "2":   ipid = 8689;   break;
                case "3":   ipid = 8690;   break;
                default:    ipid = 8688;   break;
            }
        break;
 
        case "ford":
            switch (vm_subid){
                case "2":   ipid = 8692;   break;
                case "3":   ipid = 8693;   break;
                default:    ipid = 8691;   break;
            }
        break;
 
        case "gmc":
            switch (vm_subid){
                case "2":   ipid = 8695;   break;
                case "3":   ipid = 8696;   break;
                default:    ipid = 8694;   break;
            }
        break;
 
        case "honda":
            switch (vm_subid){
                case "2":   ipid = 8698;   break;
                case "3":   ipid = 8699;   break;
                default:    ipid = 8697;   break;
            }
        break;
 
        case "hummer":
            switch (vm_subid){
                case "2":   ipid = 8701;   break;
                case "3":   ipid = 8702;   break;
                default:    ipid = 8700;   break;
            }
        break;
 
        case "hyundai":
            switch (vm_subid){
                case "2":   ipid = 8704;   break;
                case "3":   ipid = 8705;   break;
                default:    ipid = 8703;   break;
            }
        break;
 
        case "infiniti":
            switch (vm_subid){
                case "2":   ipid = 8707;   break;
                case "3":   ipid = 8708;   break;
                default:    ipid = 8706;   break;
            }
        break;
 
        case "isuzu":
            switch (vm_subid){
                case "2":   ipid = 8710;   break;
                case "3":   ipid = 8711;   break;
                default:    ipid = 8709;   break;
            }
        break;
 
        case "jeep":
            switch (vm_subid){
                case "2":   ipid = 8713;   break;
                case "3":   ipid = 8714;   break;
                default:    ipid = 8712;   break;
            }
        break;
 
        case "kia":
            switch (vm_subid){
                case "2":   ipid = 8716;   break;
                case "3":   ipid = 8717;   break;
                default:    ipid = 8715;   break;
            }
        break;
 
        case "land rover":
            switch (vm_subid){
                case "2":   ipid = 8719;   break;
                case "3":   ipid = 8720;   break;
                default:    ipid = 8718;   break;
            }
        break;
 
        case "lexus":
            switch (vm_subid){
                case "2":   ipid = 8722;   break;
                case "3":   ipid = 8723;   break;
                default:    ipid = 8721;   break;
            }
        break;
 
        case "lincoln":
            switch (vm_subid){
                case "2":   ipid = 8725;   break;
                case "3":   ipid = 8726;   break;
                default:    ipid = 8724;   break;
            }
        break;
 
        case "mazda":
            switch (vm_subid){
                case "2":   ipid = 8728;   break;
                case "3":   ipid = 8729;   break;
                default:    ipid = 8727;   break;
            }
        break;
 
        case "mercury":
            switch (vm_subid){
                case "2":   ipid = 8731;   break;
                case "3":   ipid = 8732;   break;
                default:    ipid = 8730;   break;
            }
        break;
 
        case "mini":
            switch (vm_subid){
                case "2":   ipid = 8734;   break;
                case "3":   ipid = 8735;   break;
                default:    ipid = 8733;   break;
            }
        break;
 
        case "mitsubishi":
            switch (vm_subid){
                case "2":   ipid = 8737;   break;
                case "3":   ipid = 8738;   break;
                default:    ipid = 8736;   break;
            }
        break;
 
        case "nissan":
            switch (vm_subid){
                case "2":   ipid = 8740;   break;
                case "3":   ipid = 8741;   break;
                default:    ipid = 8739;   break;
            }
        break;
 
        case "orums section":
            switch (vm_subid){
                case "2":   ipid = 8740;   break;
                case "3":   ipid = 8741;   break;
                default:    ipid = 8739;   break;
            }
        break;
 
        case "pontiac":
            switch (vm_subid){
                case "2":   ipid = 8743;   break;
                case "3":   ipid = 8744;   break;
                default:    ipid = 8742;   break;
            }
        break;
 
        case "rticles, reviews and previews":
            switch (vm_subid){
                case "2":   ipid = 8743;   break;
                case "3":   ipid = 8744;   break;
                default:    ipid = 8742;   break;
            }
        break;
 
        case "saab":
            switch (vm_subid){
                case "2":   ipid = 8746;   break;
                case "3":   ipid = 8747;   break;
                default:    ipid = 8745;   break;
            }
        break;
 
        case "saturn":
            switch (vm_subid){
                case "2":   ipid = 8749;   break;
                case "3":   ipid = 8750;   break;
                default:    ipid = 8748;   break;
            }
        break;
 
        case "suzuki":
            switch (vm_subid){
                case "2":   ipid = 8752;   break;
                case "3":   ipid = 8753;   break;
                default:    ipid = 8751;   break;
            }
        break;
 
        case "toyota":
            switch (vm_subid){
                case "2":   ipid = 8755;   break;
                case "3":   ipid = 8756;   break;
                default:    ipid = 8754;   break;
            }
        break;
 
        case "volkswagen":
            switch (vm_subid){
                case "2":   ipid = 8758;   break;
                case "3":   ipid = 8759;   break;
                default:    ipid = 8757;   break;
            }
        break;
 
        case "volvo":
            switch (vm_subid){
                case "2":   ipid = 8761;   break;
                case "3":   ipid = 8762;   break;
                default:    ipid = 8760;   break;
            }
	    break;
 
        case "acura":
            switch (vm_subid){
                case "2":   ipid = 12254;   break;
                case "3":   ipid = 12255;   break;
                default:    ipid = 12253;   break;
            }
	    break;
 
        case "audi":
            switch (vm_subid){
                case "2":   ipid = 12257;   break;
                case "3":   ipid = 12258;   break;
                default:    ipid = 12256;   break;
            }
	    break;
 
        case "BMW":
            switch (vm_subid){
                case "2":   ipid = 12260;   break;
                case "3":   ipid = 12261;   break;
                default:    ipid = 12259;   break;
            }
	    break;
 
        case "jaguar":
            switch (vm_subid){
                case "2":   ipid = 12263;   break;
                case "3":   ipid = 12264;   break;
                default:    ipid = 12262;   break;
            }
	    break;
 
        case "mercedes-benz":
            switch (vm_subid){
                case "2":   ipid = 12266;   break;
                case "3":   ipid = 12267;   break;
                default:    ipid = 12265;   break;
            }
	    break;
 
        case "porsche":
            switch (vm_subid){
                case "2":   ipid = 12269;   break;
                case "3":   ipid = 12270;   break;
                default:    ipid = 12268;   break;
            }
	    break;
 
        case "scion":
            switch (vm_subid){
                case "2":   ipid = 12272;   break;
                case "3":   ipid = 12273;   break;
                default:    ipid = 12271;   break;
            }
	    break;
 
        case "subaru":
            switch (vm_subid){
                case "2":   ipid = 12275;   break;
                case "3":   ipid = 12276;   break;
                default:    ipid = 12274;   break;
            }
        break;
 
        default:
            // no make
            switch (vm_subid){
                case "2":   ipid = 8674;   break;
                case "3":   ipid = 8675;   break;
                default:    ipid = 8673;   break;
            }
        break;
    }
} else {
    // don't serve IntelliTXT
    ipid="0";
}

//alert ('decided: ipid=' + ipid + ' (vm_make=' + vm_make + ' and vm_subid=' + vm_subid + ')');

if (0 != ipid) document.write(
	'<SCR'+'IPT language="javascript" type="text/javascript" ' +
	'src="http://primedia.us.intellitxt.com/intellitxt/front.asp?ipid=' + ipid + '">' +
	'</SCR'+'IPT>'
);

// End Custom IntelliTXT Script for Primedia properties



