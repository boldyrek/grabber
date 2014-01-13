var whitespace = " \t\n\r\f\v";

var defaultEmptyOK = false;
var maxPort = 65535;
var minPort = 0;
var YMKMD=0;
var m_sURL = new String();
 var YearID ="";
 var RegionsID = "";
 var SelectedYear1="";
var timer = "";
var timerModel = "";
var timerTrim = "";

/************************
DATA VALIDATION ROUTINES
*************************/
function isIPPort(s){
    if (isInteger(s)){
        var iPort = parseInt(s);
        if (iPort >= minPort && iPort <= maxPort){
            return true;
        }
    }
    return false;
}

function isInteger (s)
{   var i;
    if (isEmpty(s)) 
       if (isInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isInteger.arguments[1] == true);
    for (i = 0; i < s.length; i++)
    {   
        var c = s.charAt(i);
        if (!isDigit(c)) return false;
    }
    return true;
}

function isEmpty(s)
{   return ((s == null) || (s.length == 0));
}

function isDigit (c)
{   return ((c >= "0") && (c <= "9"));
}

function isNotJustWhitespace(s){
    return stripWhitespace(s).length != 0;
}
function stripWhitespace (s)
{   
    return stripCharsInBag (s, whitespace);
}
function stripCharsInBag (s, bag)

{   var i;
    var returnString = "";

    for (i = 0; i < s.length; i++)
    {   
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }

    return returnString;
}

function isNonnegativeInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isNonnegativeInteger.arguments.length > 1)
        secondArg = isNonnegativeInteger.arguments[1];

    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s) >= 0) ) );
}

function isInteger (s)

{   var i;

    if (isEmpty(s)) 
       if (isInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isInteger.arguments[1] == true);

    for (i = 0; i < s.length; i++)
    {   
        var c = s.charAt(i);

        if (!isDigit(c)) return false;
    }

    return true;
}

function isSignedInteger (s)

{   if (isEmpty(s)) 
       if (isSignedInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isSignedInteger.arguments[1] == true);

    else {
        var startPos = 0;
        var secondArg = defaultEmptyOK;

        if (isSignedInteger.arguments.length > 1)
            secondArg = isSignedInteger.arguments[1];

        // skip leading + or -
        if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") )
           startPos = 1;    
        return (isInteger(s.substring(startPos, s.length), secondArg))
    }
}

function isPositiveInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isPositiveInteger.arguments.length > 1)
        secondArg = isPositiveInteger.arguments[1];

    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s) > 0) ) );
}

function isDateMDY (dateEntry) {

  
  var datevalues=dateEntry.split("/");
  //if there is a leading 0 before day or month, strip it.
  if(datevalues.length != 3)return false;
  
  if(datevalues[0].charAt(0)=="0")datevalues[0]=datevalues[0].charAt(1);
  if(datevalues[1].charAt(0)=="0")datevalues[1]=datevalues[1].charAt(1);
  
  if(   !isPositiveInteger(datevalues[0]) ||
        !isPositiveInteger(datevalues[1]) ||
        !isPositiveInteger(datevalues[2])){return false;}
  
  if ( !isDate(datevalues[2],datevalues[0],datevalues[1]) ){
    return false;
  }
  return true;

}


var daysInMonth = new Array();
daysInMonth[1] = 31;
daysInMonth[2] = 29;   // must programmatically check this
daysInMonth[3] = 31;
daysInMonth[4] = 30;
daysInMonth[5] = 31;
daysInMonth[6] = 30;
daysInMonth[7] = 31;
daysInMonth[8] = 31;
daysInMonth[9] = 30;
daysInMonth[10] = 31;
daysInMonth[11] = 30;
daysInMonth[12] = 31;

function isDate (year, month, day)
{   // catch invalid years (not 2- or 4-digit) and invalid months and days.

//alert("isMonth: " + isMonth(month, false));

    if (! (isYear(year, false) && isMonth(month, false) && isDay(day, false))) return false;

    var intYear = parseInt(year);
    var intMonth = parseInt(month);
    var intDay = parseInt(day);

    if (intDay > daysInMonth[intMonth]) return false; 

    if ((intMonth == 2) && (intDay > daysInFebruary(intYear))) return false;

    return true;
}

function isYear (s)
{   if (isEmpty(s)) 
       if (isYear.arguments.length == 1) return defaultEmptyOK;
       else return (isYear.arguments[1] == true);
    if (!isNonnegativeInteger(s)) return false;
    return (s.length == 4);
}

function addSeparatorsNF(nStr, inD, outD, sep) {
    nStr += '';
    var dpos = nStr.indexOf(inD);
    var nStrEnd = '';
    if (dpos != -1) {
        nStrEnd = outD + nStr.substring(dpos + 1, nStr.length);
        nStr = nStr.substring(0, dpos);
    }
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(nStr)) {
        nStr = nStr.replace(rgx, '$1' + sep + '$2');
    }
    return nStr + nStrEnd;
}     


function isIntegerInRange (s, a, b){

	if (isEmpty(s)){
		if (isIntegerInRange.arguments.length == 1) return defaultEmptyOK;
	} else { 
		return (isIntegerInRange.arguments[1] == true);
	}

   if (!isInteger(s, false)){ 
	 	return false;
	}

   var num = parseInt (s);

   return ((num >= a) && (num <= b));
	
}

function isMonth (s){   
	if (isEmpty(s)) {
	      if (isMonth.arguments.length == 1){
			 	return defaultEmptyOK;
	      } else {
				return (isMonth.arguments[1] == true);
			}
	}
   return isIntegerInRange (s, 1, 12);
}


function isDay (s)
{   if (isEmpty(s)) 
       if (isDay.arguments.length == 1) return defaultEmptyOK;
       else return (isDay.arguments[1] == true);
    return isIntegerInRange (s, 1, 31);
}


function daysInFebruary (year)
{   // February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (  ((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0) ) ) ? 29 : 28 );
}

function isTime(sVal){
    s = stripWhitespace(sVal);
    switch (s.substring(s.length - 2, s.length).toLowerCase()){
        case "am": case "pm":
            break;
        default:
            return false;
    }
    var colPos = s.indexOf(":");
    if (colPos == -1) return false;
    var sPart = s.substring(0, colPos);
    if (! isPositiveInteger(sPart)) return false;
    var nPart = parseInt(sPart);
    if (nPart > 12 || nPart < 1) return false;
    sPart = s.substring(colPos + 1, colPos + 3);
    if (! isNonnegativeInteger(sPart)) return false;
    nPart = parseInt(sPart);
    if (nPart > 59) return false;
    if (s.length == colPos + 6 && s.substring(colPos + 4, colPos + 4) != " ") return false;
    return true;
}

function formatCurrency(intVal){
    if (intVal < 0) return "(negative value)";
    var sVal = intVal.toString();
    var sLength = sVal.length;
    var sReturn = "";
    for (i = 1; (i*3) < sLength; i++){
        sReturn = sReturn + "," + sVal.substr(sLength - (3 * i), 3);
    }
    var iPart = sLength % 3;
    if (iPart == 0) iPart = 3;
    sReturn = sVal.substr(0, iPart) + sReturn;
    return "$" + sReturn;
}




















function MonitorText(event, cmd){
    if (event.keyCode == 13) {
        document.getElementById(cmd).click();
        event.keyCode = 0;
    }
}



function CheckSendKey(e){
    if (e.keyCode == 13) {
        document.forms[1].submit();
        e.keyCode = 0;
    }
}


function sendUser(frm, varname){
    oUser = document.getElementById(varname);
    oHidden = document.getElementById( 'ctUser' );
    oUser.value = oHidden.value;
    document.forms[frm].submit();
}



/*CALENDAR*/
var vAuctions = new Array();
function ac(ord, a, b, c, d, e, f, g, h, i){
    var vAuction = new Array();
    vAuction[0] = a;    //EventID
    vAuction[1] = b;    //Date
    vAuction[2] = c;    //City
    vAuction[3] = d;    //Auction
    vAuction[4] = e;    //Opento
    vAuction[5] = f;    //OnlineLanes
    vAuction[6] = g;    //CarsConsigned
    vAuction[7] = h;    //EventName
    vAuction[8] = i;    //Consignors
    vAuctions[ord] = vAuction;
}

function ShowAuction(AuctionEvent){			
	var sEvent, sLocation, sDate, sOpenTo, sOnline, sConsigned, sConsignors, dvAuction;
	
	sEvent = vAuctions[AuctionEvent][7];
	sLocation = vAuctions[AuctionEvent][3];
	sDate = vAuctions[AuctionEvent][1];
	sOpenTo = vAuctions[AuctionEvent][4];
	sOnline = vAuctions[AuctionEvent][5];
	sConsigned = vAuctions[AuctionEvent][6];
	sConsignors = vAuctions[AuctionEvent][8];
	
	dvAuction = document.getElementById( 'DetailsPreview' );
	
	var sHTML = "";
	sHTML = sHTML + "<b>" + sLocation + "</b><br />";
	sHTML = sHTML + sDate + "<br /><br />";
	sHTML = sHTML + sEvent + "<br /><br />";
	if (sConsignors.length > 0){
	sHTML = sHTML + "<b>Featured Consignors:</b><br />";
	sHTML = sHTML + sConsignors + "<br /><br />";}
	switch (sOpenTo.toLowerCase()){
	    case "factory":
	        sHTML = sHTML + "<font color=red><b>Closed Factory</b></font><br />";
	        break;
	    case "public":
	        sHTML = sHTML + "<font color=darkgreen><b>Public Sale</b></font><br />";
	        break;
	    default:
	        sHTML = sHTML + "<font color=blue><b>Dealer Sale</b></font><br />";       
	}
	if (sOnline > 0) sHTML = sHTML + "<b>" + sOnline + " Lane(s) Online</b><br />";
	if (sConsigned > 0) sHTML = sHTML + sConsigned + " cars already consigned<br />";
	sHTML = sHTML + "</body></html>";
	
	dvAuction.innerHTML = sHTML;
}

function NavEvent(){
    window.alert('Not implemented. Will open inventory listing for online event.');
    return false;
}









/*CAR DETAILS*/
function NextImage(){
    var vIndex;
    vIndex = vImageIndex + 1;
    if (vIndex == vImages.length) {vIndex = 0;}
    SetImage(vIndex);
}
function PrevImage(){
    var vIndex;
    vIndex = vImageIndex - 1;
    if (vIndex == -1) {vIndex = vImages.length - 1;}
    SetImage(vIndex);
}
function SetImage(vIndex){
    vImageIndex = vIndex;
    var vSlide = document.getElementById("imgSlide");
    var vSlideLarge = $('#vehImageZoom');
   // var vSlideLargePath = vImages[vImageIndex].substring(vImages[vImageIndex].lastIndexOf('/') + 1);
    var vSlideLargePath = vImagesBig[vImageIndex];
    if (vSlide.tagName == 'SPAN'){
        vSlide.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'" + vImages[vImageIndex] + "\', sizingMethod=\'scale\')"
        //window.alert(vSlide.onclick);
    }else{
        //vSlide.src = 'http://www.auctionpipeline.com/' + vImages[vImageIndex];
        vSlide.src = vImages[vImageIndex];
        vSlideLarge.attr('image', vSlideLargePath);
        $(vSlide).attr('imageIndex',vImageIndex);
    }
    if(tgImageZoomOn) {
        $('#vehImageZoom').unbind().jqzoom(zoomOptions);
    }
}
function BigPic(vIndex){
    var imgBigPic = document.getElementById("imgBigPicture");
    var divBack = document.getElementById("dvBackToReport");
    var tblReport = document.getElementById("tblReport");
    var dvCert = document.getElementById("divCert");
    var imCert = document.getElementById("imgCert");
    
    tblReport.style.display = "none";
    divBack.style.display = "block";
    imgBigPic.style.display = "block";
    imgBigPic.src = vImagesBig[vIndex];
    //imgBigPic.src = 'http://www.auctionpipeline.com/' + vImagesBig[vIndex];
    
    if (vIndex == vCertIndex){
        imCert.src = vCertImage;
        dvCert.style.display = "block";
        correctPNG();
    }else{
        dvCert.style.display = "none";
    }
}
function BackToVehicleReport(){
    var imgBigPic = document.getElementById("imgBigPicture");
    var divBack = document.getElementById("dvBackToReport");
    var tblReport = document.getElementById("tblReport");
    var dvCert = document.getElementById("divCert");
    
    tblReport.style.display = "block";
    divBack.style.display = "none";
    imgBigPic.style.display = "none";
    dvCert.style.display = "none";
}

function CheckReport(){
    var iRpt = parseInt(document.getElementById("selReport").value);
    var dvDates = document.getElementById("divDates");
    if (iRpt <= 1){
        dvDates.style.display = 'block';
    }else{
        dvDates.style.display = 'none';
    }
}

function FetchReport(){
    var frm = document.forms[1];
    var iRpt = parseInt(document.getElementById("selReport").value);
    var iAuc = parseInt(document.getElementById("selAuction").value);  
    var sBeginDate = document.getElementById("BeginDate").value;
    var sEndDate = document.getElementById("EndDate").value;
    
    if (iRpt == 1){
        if (!isDateMDY(sBeginDate)){
            window.alert('Begin Date is not a valid date.');
            return;
        }
        if (!isDateMDY(sEndDate)){
            window.alert('End Date is not a valid date.');
            return;
        }
    }
    
    frm.action = vAuc[iAuc][iRpt];
    frm.submit();
}

vDlr = new Array();


var vAuc = new Array();
function inAuc(ord, URL1, URL2, URL3, URL4, URL5){
    var vA = new Array();
    vA[0] = URL1;
    vA[1] = URL2;
    vA[2] = URL3;
    vA[3] = URL4;
    vA[4] = URL5;
    vAuc[ord] = vA;
}

function equip(ord, key, desc){
    var vItem = new Array();
    vItem[0] = key;
    vItem[1] = desc;
    vEquip[ord] = vItem;
}


var vEquip = new Array();
equip(1, '4W', '4 Wheel Drive');
equip(2, 'AW', 'All Wheel Drive');
equip(3, 'A3', '3 Speed Automatic Transmission');
equip(4, '3S', '3 Speed Manual Transmission');
equip(5, 'A4', '4 Speed Automatic');
equip(6, '4S', '4 Speed Manual Transmission');
equip(7, 'A5', '5 Speed Automatic');
equip(8, '5S', '5 Speed Manual Transmission');
equip(9, 'A6', '6 Speed Automatic Transmission');
equip(10, '6S', '6 Speed Manual Transmission');
equip(11, 'AT', 'Automatic Transmission');
equip(12, '0D', '10 Cylinder Diesel');
equip(13, '0F', '10 Cylinder Flex Fuel');
equip(14, '0G', '10 Cylinder Gas');
equip(15, '2G', '2-Cylinder Gas');
equip(16, '3D', '3 Cylinder Diesel');
equip(17, '3F', '3 Cylinder Flex Fuel');
equip(18, '3G', '3-Cylinder Gas');
equip(19, '4D', '4-Cylinder Diesel');
equip(20, '4F', '4-Cylinder Flex Fuel');
equip(21, '4G', '4-Cylinder Gas');
equip(22, '5D', '5-Cylinder Diesel');
equip(23, '5F', '5-Cylinder Flex Fuel');
equip(24, '5G', '5-Cylinder Gas');
equip(25, '6D', '6-Cylinder Diesel');
equip(26, '6F', '6-Cylinder Flex Fuel');
equip(27, '6G', '6-Cylinder Gas');
equip(28, '8D', '8-Cylinder Diesel');
equip(29, '8F', '8-Cylinder Flex Fuel');
equip(30, '8G', '8-Cylinder Gas');
equip(31, 'AC', 'Air Conditioning');
equip(32, 'RA', 'Rear AC');
equip(33, 'RW', 'Rear Wiper');
equip(34, 'AL', 'ABS Brakes');
equip(35, 'WA', 'Alloy Wheels');
equip(36, 'CD', 'CD Player');
equip(37, 'SR', 'Sun Roof');
equip(38, 'FI', 'Fuel Injection');
equip(39, 'LU', 'Leather Upholstry');
equip(40, 'TB', 'Turbo Charged');

function equip(ord, key, desc){
    var vItem = new Array();
    vItem[0] = key;
    vItem[1] = desc;
    vEquip[ord] = vItem;
}

function ShowEquip(event){
    var aText;
    if (event.srcElement){aText = event.srcElement.innerHTML;}else{aText = event.target.innerHTML;}
    var sHTML = "<b>FEATURES</b><br><table border=0 cellspacing=0 cellpadding=0>";
    for(i=1;i<=40;i++){
        var sKey = vEquip[i][0];
        if (aText.indexOf(sKey, 0) > -1){
            sHTML = sHTML + "<tr><td><b>" + sKey + "</b></td><td nowrap>&nbsp;" + vEquip[i][1] + "</td></tr>";
        }
    }
    sHTML = sHTML + "</table>"
    ShowTip(event, sHTML);
}

var sSty = '<b>Body Style</b><br>';
sty(1, '2D', '2 Door');
sty(2, '4D', '4 Door');
sty(3, 'ATV', 'ATV');
sty(4, 'Boat', 'Boat');
sty(5, 'BUS', 'Bus');
sty(6, 'CV', 'Convertible');
sty(7, 'EQ', 'Equipment');
sty(8, 'JET', 'Jet Ski');
sty(9, 'MC', 'Motorcycle');
sty(10, 'PU', 'Pickup');
sty(11, 'RV', 'RV');
sty(12, 'SNOW', 'Snowmobile');
sty(13, 'SUV', 'SUV');
sty(14, 'TR', 'Truck');
sty(15, 'VAN', 'Van');
sty(16, 'WAG', 'Wagon');

function sty(ord, key, desc){
    sSty = sSty + '<b>' + key + '</b> - ' + desc + '<br>';
}

var sInt = '<b>Interior</b><br>';
sin(1, 'C', 'Cloth');
sin(1, 'L', 'Leather');
sin(1, 'V', 'Vinyl');
sin(1, 'O', 'Other');
function sin(ord, key, desc){
    sInt = sInt + '<b>' + key + '</b> - ' + desc + '<br>';
}

function ShowOdo(event){ShowTip(event, "<b>Odometer Status</b><br><b>E</b> - Exempt<br><b>A</b> - Actual<br><b>O</b> - Odometer Descrepency");}
function ShowI(event){ShowTip(event, sInt);}
function ShowSty(event){ShowTip(event, sSty);}
function ShowOLR(event){ShowTip(event, "Offered via Pipeline Simulcast");}
function ShowManCA(event){ShowTip(event, "Offered on Manheim CyberAuction");}
function ShowManCL(event){ShowTip(event, "Offered on Manheim CyberLot");}
function Sticker(event){ShowTip(event, "<b>Print Window Sticker</b><br>Available for Ford, Lincoln, and Mercury vehicles 4 years old and newer");}
function WLEmail(event){ShowTip(event, "Email me when this<br>vehicle changes");}
function WLDel(event){ShowTip(event, "Delete this vehicle<br>from my watch list");}
function VIHPDel(event){ShowTip(event, "Delete this vehicle from<br>vehicles I have purchased");}
function VIDNPDel(event){ShowTip(event, "Delete this vehicle from<br>vehicles I did not purchased");}
function SSDel(event){ShowTip(event, "Delete");}
function ShowQuic(event){ShowTip(event, "Offered on Ford Quic");}
function ShowCR(event){ShowTip(event, "Condition Report Available");}
function ShowCRHead(event){ShowTip(event, "Condition Report Available");}
function ShowOLHead(event){ShowTip(event, "Offered via Online Sale");}
function ShowTip(event, content){
    
    var divEquip = document.getElementById('dvTip2');
    if(document.all){

        divEquip.style.left = (event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft + 20) + 'px';
        divEquip.style.top = (event.clientY + document.documentElement.scrollTop + document.body.scrollTop - 8) + 'px';
    }else{

        divEquip.style.left = (event.pageX -150) + 'px';
        divEquip.style.top = (event.pageY - 115) + 'px';
    }
    divEquip.innerHTML = content;
    divEquip.style.display = 'block';
    
    //----------------------------------

//     var divnewEquip = document.getElementById('dvnewTip');
//    if(document.all){
//        divnewEquip.style.left = (event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft + 20) + 'px';
//        divnewEquip.style.top = (event.clientY + document.documentElement.scrollTop + document.body.scrollTop - 8) + 'px';
//    }else{
//        divnewEquip.style.left = (event.pageX + 20) + 'px';
//        divnewEquip.style.top = (event.pageY - 8) + 'px';
//    }
//    divnewEquip.innerHTML = content;
//    divnewEquip.style.display = 'block';
    
    //--------------------------------
    
}
function HideTip(){
    var divEquip = document.getElementById('dvTip2');
    divEquip.style.display = 'none';
    
    //-----------------
//     var divnewEquip = document.getElementById('dvnewTip');
//      divnewEquip.style.display = 'none';
    //-------------------
}
function z(){var b;}


/*Search*/
function SwitchTabs(oTab){
    var tbCars = document.getElementById("tbCars");
    var tbVehicles = document.getElementById("tbVehicles");
    if (oTab.id == "tbCars"){
        tbCars.className = "ActTab";
        tbVehicles.className = "InactTab";
    } else {
        tbCars.className = "InactTab";
        tbVehicles.className = "ActTab";
    }
}

function SwitchEventTabs(Tab){
    var ctLanes = document.getElementById(dvLanes);
    var ctConsign = document.getElementById(dvConsign);
    var ctModels = document.getElementById(dvModels);
    var ctTabConsignor = document.getElementById(tbConsignor);
    var ctTabLane = document.getElementById(tbLane);
    var ctTabModel = document.getElementById(tbModels);
	switch (Tab){
		case "Lane":
				ctTabLane.className = "CalActiveTab";
				ctTabConsignor.className = "CalInactiveTab";
				ctTabModel.className = "CalInactiveTab";
				ctLanes.style.display = "block";
				ctConsign.style.display = "none";
				ctModels.style.display = "none";
			break;
		case "Consignor":
				ctTabConsignor.className = "CalActiveTab";
				ctTabLane.className = "CalInactiveTab";
				ctTabModel.className = "CalInactiveTab";
				ctLanes.style.display = "none";
				ctConsign.style.display = "block";
				ctModels.style.display = "none";
			break;
		case "Summary":
		        if (!bModels){
		            window.location.replace(hRef);
		            return;
		        }
				ctTabConsignor.className = "CalInactiveTab";
				ctTabLane.className = "CalInactiveTab";
				ctTabModel.className = "CalActiveTab";
				ctLanes.style.display = "none";
				ctConsign.style.display = "none";
				ctModels.style.display = "block";
			break;
	}						
}

function SwitchEventTabs2(Tab){
    var ctLanes = document.getElementById(dvLanes);
    var ctLaneHead = document.getElementById(tblLaneHead);
    var ctConsign = document.getElementById(dvConsign);
    var ctConsignHead = document.getElementById(tblConsignHead);
    var ctTabConsignor = document.getElementById(tbConsignor);
    var ctTabModel = document.getElementById(tbModels);
    var ctModels = document.getElementById(dvModels);
	switch (Tab){
		case "Information":
				ctTabConsignor.className = "CalActiveTab";
				ctTabModel.className = "CalInactiveTab";
				ctLanes.style.display = "block";
				if (ctLaneHead) ctLaneHead.style.display = "block";
				if (ctConsign) ctConsign.style.display = "block";
				if (ctConsignHead) ctConsignHead.style.display = "block";
				ctModels.style.display = "none";
			break;
		case "Summary":
		        if (!bModels){
		            window.location.replace(hRef);
		            return;
		        }
				ctTabConsignor.className = "CalInactiveTab";
				ctTabModel.className = "CalActiveTab";
				ctLanes.style.display = "none";
				if (ctLaneHead) ctLaneHead.style.display = "none";
				if (ctConsign) ctConsign.style.display = "none";
				if (ctConsignHead) ctConsignHea