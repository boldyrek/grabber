/***************************************************************************
 phpTrafficA @soft.ZoneO.net
 Copyright (C) 2004-2008 ZoneO-soft, Butchu (email: "butchu" with the domain "zoneo.net")

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 More Info About The Licence At http://www.gnu.org/copyleft/gpl.html
****************************************************************************/

function writePhpTACookie() {
	date=new Date;
	date.setMonth(date.getMonth()+1);
	var name = "phpTA_resolution";
	var value = screen.width +"x"+ screen.height;
	var domain = "webautosalon.com";
	var path= "/";
	document.cookie=name+"="+escape(value)+"; expires="+date.toGMTString()+"; path="+path+"; domain="+domain;
}
window.onload=writePhpTACookie;