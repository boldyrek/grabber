
function setCookie(name, value, expires_hours, path, domain, secure) {
    var options = [];
    if (expires_hours) options['expires'] = expires_hours * 1000 * 60 * 60;
    options['path'] = path ? path : "/";
    if (domain) options['domain'] = domain;
    if (secure) options['secure'] = true;
    $.cookie(name, value, options);
}

function getCookie(name) {
    return $.cookie(name);
}

function themeChange(val) {
	setCookie('THEME', val, null);
	window.location.reload();
}

function languageChange(val) {
	setCookie('LANG', val, null);
	window.location.reload();
}

function h5PanelChange(id) {
    var cookie = parseInt(getCookie(id));
    if (cookie!=1) { // we hide
        setCookie(id, 1, null);
        sh(id + '_body', 2);
    } else { // we show
        setCookie(id, 0, null);
        sh(id + '_body', 1);
    }
}

function windowSize() {
	var w = 0;
	var h = 0;
	if(!window.innerWidth) { // IE
		if(!(document.documentElement.clientWidth == 0)) {
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		} else { //quirks mode
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
	} else { //w3c
		w = window.innerWidth;
		h = window.innerHeight;
	}
	return {width:w, height:h};
}

function windowCenter() {
	var hWnd = (arguments[0] != null) ? arguments[0] : {width:0, height:0};
	var _x = 0;
	var _y = 0;
	var offsetX = 0;
	var offsetY = 0;
	if(!window.pageYOffset) { //IE
		if(!(document.documentElement.scrollTop == 0)) {
			offsetY = document.documentElement.scrollTop;
			offsetX = document.documentElement.scrollLeft;
		} else { //quirks mode
			offsetY = document.body.scrollTop;
			offsetX = document.body.scrollLeft;
		}
	} else { //w3c
		offsetX = window.pageXOffset;
		offsetY = window.pageYOffset;
	}
	var wnd = windowSize();
	_x = ((wnd.width - hWnd.width)/2) + offsetX;
	_y = ((wnd.height - hWnd.height)/2) + offsetY;
	return{x:_x, y:_y};
}

function is_numeric(mixed_var) {
	if(mixed_var==="") return false;
	return !isNaN(mixed_var*1);
}

function in_array(needle, haystack, argStrict) {
	var key = '', strict = !!argStrict;
	if(strict) {for (key in haystack) if (haystack[key] === needle) return true;} else {for (key in haystack) if (haystack[key] == needle) return true;}
	return false;
}

function empty(mixed_var) {
    var key;
	if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
        return true;
    }
    if (typeof mixed_var == 'object') {
		for (key in mixed_var) {
            return false;
        }
        return true;
    }
    return false;
}

function isset() {
    var a = arguments,
        l = a.length,        i = 0,
        undef;
 
    if (l === 0) {
        throw new Error('Empty isset');    }
 
    while (i !== l) {
        if (a[i] === undef || a[i] === null) {
            return false;        }
        i++;
    }
    return true;
}

// returns element by ID
function e(id) {
	return document.getElementById(id);
}

String.prototype.count=function(s1) {
    return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}

function sortAssoc(aInput, desc) {
	var aTemp = [];
	for (var sKey in aInput) aTemp.push([sKey, aInput[sKey]]);
	if (!desc) {
		aTemp.sort(function(a, b) {return (a[1] - b[1]);});
	} else {
		aTemp.sort(function (a, b) {return (b[1] - a[1]);});
	}
	var aOutput = new Object();
	for (var nIndex = 0; nIndex <= aTemp.length-1; nIndex++)
	aOutput[aTemp[nIndex][0]] = aInput[aTemp[nIndex][0]];
	return aOutput;
}

function sortAssocStr(aInput, desc) {
	var aTemp = [];
	for (var sKey in aInput) aTemp.push([sKey, aInput[sKey]]);
	if (!desc) {
		aTemp.sort(function(a, b) {return ((b[1] < a[1]) - (a[1] < b[1]));});
	} else {
		aTemp.sort(function (a, b) {return ((b[1] > a[1]) - (a[1] > b[1]));});
	}
	var aOutput = new Object();
	for (var nIndex = 0; nIndex <= aTemp.length-1; nIndex++)
	aOutput[aTemp[nIndex][0]] = aInput[aTemp[nIndex][0]];
	return aOutput;
}

function addEvent(obj, evType, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evType, fn, false);
		return true;
	} else if (obj.attachEvent) {
		return obj.attachEvent('on' + evType, fn);
	} else {
		return false;
	}
}

function print_r(x, max, sep, l) {
    l = l || 0; 
    max = max || 99; 
    sep = sep || ' '; 
    if (l > max) {
        return "[WARNING: Too much recursion]\n"; 
    } 
    var i, r = '', t = typeof x, tab = ''; 
    if (x === null) { 
        r += "(null)\n"; 
    } else if (t == 'object') { 
        l++; 
        for (i = 0; i < l; i++) { 
            tab += sep; 
        } 
        if (x && x.length) { 
            t = 'array'; 
        } 
        r += '(' + t + ") :\n"; 
        for (i in x) { 
            try { 
                r += tab + '[' + i + '] : ' + print_r(x[i], max, sep, (l + 1)); 
            } catch(e) { 
                return "[ERROR: " + e + "]\n"; 
            } 
        } 
    } else { 
        if (t == 'string') { 
            if (x == '') { 
                x = '(empty)'; 
            } 
        } 
        r += '(' + t + ') ' + x + "\n"; 
    } 
    return r; 
};

// function for filtering data
var fltro = {};
fltro.alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
fltro.number = '0123456789';
fltro.intval = '-' + fltro.number;
fltro.floatval = '-.' + fltro.number;
fltro.phpval = '\'[]_' + fltro.number + fltro.alpha;
fltro.vin = fltro.number + fltro.alpha;
fltro.zip = '- ' + fltro.number + fltro.alpha;
fltro.phone = '+-() ' + fltro.number;
fltro.email = '-+_@.' + fltro.number + fltro.alpha;
fltro.date = '/.-' + fltro.number;
fltro.full = '\'\"-+_@.,&~!#$%^/\\\=()?<> ' + fltro.number + fltro.alpha;
fltro.sfull = '\'\"-+_@.,&~!#$%^*/\\\=()?<>:\;|{}[] \n' + fltro.number + fltro.alpha;

function fltr(t, v) {
	var curpos = 0;
	if (typeof(t.selectionStart)=='number') {
		curpos = t.selectionStart;
	} else if (document.selection) {
		var sel = document.selection.createRange();
		var clone = sel.duplicate(); 
		sel.collapse(true);
		try {
			clone.moveToElementText(t);
		} catch(e) {
			clone.moveStart('character', -10000);
		}
		clone.setEndPoint('EndToEnd', sel);
		var endCorrection = t.value.substr(clone.text.length,t.value.length).match(/\r/g);   
		endCorrection = endCorrection ? endCorrection.length : 0;   
		curpos = clone.text.length + endCorrection;
		if ((clone.text.length + endCorrection + 1) == t.value.length) {
			if (t.value.substr(t.value.length-1,t.value.length) == "\n") curpos++;
		}
	}
	var w = '';
	for (i=0; i < t.value.length; i++) {
		xetet = t.value.charAt(i);
		if (v.indexOf(xetet,0) != -1) w += xetet;
		else curpos--;
	}
	/*
	if (v == fltro.phone) {
		if (w) {
			w = '+' + w;
			curpos++;
		}
	}
	*/
	t.value = w;
	if (curpos < 0) curpos = 0;
	if (typeof(t.selectionStart)=='number') {
		t.setSelectionRange(curpos,curpos);
	} else if (document.selection) {
		//var rng = t.createTextRange();
		//rng.collapse(true);
		//rng.moveEnd('character', curpos);
		//rng.moveStart('character', curpos);
		//rng.select();
		clone.collapse(true);
		clone.moveEnd('character', curpos);
		clone.moveStart('character', curpos);
		clone.select();
	}
}

// show/hide element
function sh(id, status, display) {
    var elem = e(id);
    if (elem) {
	var d = display ? display : 'block';
	if (status) { // if we manually change status
	    if (status==1) {
		sh_addon(elem, d);
	    } else {
		elem.style.display = 'none';
	    }
	} else { // if we have to do oposite
	    if (elem.style.display == 'none') {
		sh_addon(elem, d);
	    } else {
		elem.style.display = 'none';
	    }
	}
    }
}

function sh_addon(elem, display) {
	if (elem.tagName.toLowerCase()=='tr') {
		try {elem.style.display = 'table-row';} catch(e) {elem.style.display = 'block';}
	} else {
		elem.style.display = display;
	}
}

// confirmation box
function confirmbox(text) {
    if (text == '' || typeof(window.opera) != 'undefined') {
        return true;
    }
    return confirm(text);
}

// tabs
function monolit_tabs_changed(index, k, total) {
	for (var i=0; i<total; i++) {
		var tab = e('monolit_tabs_' + index + '_' + i);
		var tab2 = e('monolit_tabs_' + index + '_' + i + '_span');
		if (i!=k) {
			tab.setAttribute('class', tab.getAttribute('class').replace('monolit_tabs_active', ''));
			tab2.setAttribute('class', tab2.getAttribute('class').replace('monolit_tabs_active', ''));
			sh('monolit_tabs_' + index + '_' + i + '_div', 2);
		} else {
			tab.setAttribute('class', tab.getAttribute('class') + ' monolit_tabs_active');
			tab2.setAttribute('class', tab2.getAttribute('class') + ' monolit_tabs_active');
			sh('monolit_tabs_' + index + '_' + i + '_div', 1);
		}
	}
}

// dropdown handler for IE
function dropdown_handler(id) {
	var elem = e(id).getElementsByTagName("li");
	for (var i=0; i<elem.length; i++) {
		elem[i].onmouseover = function() {this.className+=" ddhover";}
		elem[i].onmouseout = function() {this.className=this.className.replace(new RegExp(" ddhover\\b"), "");}
	}
}

// auto height iframes
function iframe_all_auto_height() {
    var o = document.getElementsByTagName('iframe'), height;
    for (i=0; i<o.length; i++) {
        if (/\iframe_auto_height\b/.test(o[i].className)) {
            //alert(o[i].contentWindow.document.body.scrollHeight);
            height = o[i].contentDocument ? (o[i].contentDocument.body.offsetHeight + 35) : o[i].contentWindow.document.body.scrollHeight;
            o[i].height = height;
            o[i].style.height = height + 'px';
            o[i].setAttribute('height', height);
        }
    }
}

// view ticket body
function tickets_view_body(ticket_id, header) {
	sh(ticket_id + '_body', 0);
	//sh(ticket_id + '_footer', 0);
	iframe_all_auto_height();
}

// format date simular to date() function in php
//alert(date_format('12/31/2005 23:59:38', 'm/Y/d g:i:s a'));
function date_format(value, format) {
	
	//var datetime = (typeof(value)=='object' ? value : new Date(value)), 
	//alert(format);
	var result = format;
	var datetime = new Date(value); /* (value instanceof Date ? value : new Date(value)),*/
	result = result.replace('Y', datetime.getFullYear());
	result = result.replace('d', datetime.getDate()<10 ? ('0'+ datetime.getDate()) : datetime.getDate()); 
	result = result.replace('m', (datetime.getMonth() + 1<10) ? ('0'+ (datetime.getMonth() + 1)) : (datetime.getMonth() + 1));
	result = result.replace('H', (datetime.getHours()<10) ? ('0'+ datetime.getHours()) : datetime.getHours()); 
	result = result.replace('i', (datetime.getMinutes()<10) ? ('0'+ datetime.getMinutes()) : datetime.getMinutes());
	result = result.replace('s', (datetime.getSeconds()<10) ? ('0'+ datetime.getSeconds()) : datetime.getSeconds());
	var hours = datetime.getHours();
	result = result.replace('a', (hours >= 12) ? 'pm' : 'am');
	var ghours = hours > 12 ? (hours - 12) : hours;
	result = result.replace('g', (ghours<10) ? ('0'+ ghours) : ghours);
	return result;
}

function popup_new_window(url, mwidth, mheight) {
	if (document.all&&window.print) { //if ie5
		window.showModelessDialog(url,"","help:0;resizable:1;dialogWidth:"+mwidth+"px;dialogHeight:"+mheight+"px");
	} else {
		window.open(url,"","width="+mwidth + "px,height="+mheight+"px,resizable=1,scrollbars=1");
	}
}

function get_entity_ajax(search_term, type) {
    
    $.ajax({
        url: '/co/entities/getentityfromgoto',
        data: {input: search_term, type: type},
        type: 'post',
        success: function( strData ) {
            if (strData == '') {
                alert('No entities match that search term!');
            } else {
                if (strData.substring(0,6) == 'entity') {
                    var entity = strData.split('_');
                    location.href = '/co/entities/edit?co_ent_id=' + entity[1];
                } else {
                    $('#output_div').html(strData);
                }
            }
        }
    });
}

function get_stock_ajax(search_term, type) {
    
    var search_object;   
    
    if (type == 'stock' || type == 'vin') {
        search_object = 'input';
    } else if (type == 'booking') {
        search_object = 'container';
    }
    
    $.ajax({
        url: '/so/deal/getstockfromsearchterm',
        data: {input: search_term, search_type: type},
        type: 'post',
        success: function(strData) {
            if (strData == '') {
                alert('No stocks match that ' + search_object + ' #!');
            } else {
                if (strData.substring(0,5) == 'stock') {
                    var output = strData.split('_');
                    location.href = '/co/tempinvoice/createinvoice?arr_det_stock_num=' + output[1];
                } else {
                    $('#output_div').html(strData);
                }
            }
        }
    });
}

function quick_navigation(button_type) {

    var search_term = $('#goto_input_number').val().trim();

    if (search_term != '') {
        
        var patt = /[a-zA-Z]/;
        if (patt.test(search_term) && (button_type != 'vin' && button_type != 'bid' && button_type != 'entity' && button_type != 'booking'))
        {
            alert('Alphanumeric search terms are only for Partial VIN, Bid, Book/Cont & Entity buttons!');
            return false;  
        }
    
        switch (button_type) {
            case 'entity':
                var p = /^\d+$/;
                
                if (p.test(search_term)) {
                    location.href = '/co/entities/edit?co_ent_id=' + search_term;
                } else {
                    get_entity_ajax(search_term, 'entity');
                }

                break;
            case 'aa':
                get_entity_ajax(search_term, 'aa');
                
                break;
            case 'rep':
                get_entity_ajax(search_term, 'rep');
                
                break;
            case 'deal':
                location.href = '/co/tempinvoice/createinvoice?arr_det_stock_num=' + search_term;
                break;
            case 'stock':
                get_stock_ajax(search_term, 'stock');

                break;
            case 'title':
                location.href = '/co/tempinvoice/createinvoice?arr_det_stock_num=' + search_term + '&active_div=stocktitles';
                break;
            case 'trans':
                location.href = '/co/tempinvoice/createinvoice?arr_det_stock_num=' + search_term + '&active_div=transport';
                break;
            case 'bid':
                location.href = '/co/bids?full_text_search_string=' + search_term;
                break;
            case 'booking':
                get_stock_ajax(search_term, 'booking');

                break;
            case 'vin':
                get_stock_ajax(search_term, 'vin');

                break;
            case 'inv':
                var inv_num = $('#goto_input_number').val();

                $("#h5_hoverbox_id_inv_alloc_dialog_goto_dialog").html('Loading...');
                $("#h5_hoverbox_id_inv_alloc_dialog_goto_dialog").dialog('option', 'title', 'Invoice Details - #' + inv_num);
                
                $.post('/rp/invoicesandallocations', { ajax_popup: 'goto', invoice_no: inv_num, submit_yes: 'Submit', receipt_type: 'RA' }, function(data) {
                    if (data.success) {
                        $('#h5_hoverbox_id_inv_alloc_dialog_goto_dialog').html(data.table);
                    }
                }, "json");

                break;
        }
    }
    
    return false;
}

function getCurrentDate(yesterday) {
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();

    // if yesterday parameter is set and true, dial back the day by 1
    if (yesterday) {
        day = currentTime.getDate() - 1;
    }

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    var today_date = month + "/" + day + "/" + year;
    
    return today_date;
}

function toggleReportCriteriaDetails(id) {
    var btn_selector;

    if (id == null) {
        id = '';
        btn_selector = '.report_criteria_button'
    } else {
        btn_selector = '#report_criteria_button' + id;
    }

    if ($('.report_criteria_form' + id).is(':visible')) {
        $('.report_criteria_form' + id).hide();
        $(btn_selector).text('Criteria [ + ]');
    } else if ($('.report_criteria_form' + id).is(':hidden')) {
        $('.report_criteria_form' + id).show();
        $(btn_selector).text('Criteria [ - ]');
    }
}

function doReportAjax(event, dialog_id) {
    
    event.preventDefault();
    
    var options = $('form[name="form_inquiry_' + dialog_id + '"]').serialize();
    options += '&ajax_popup=' + dialog_id + '&submit_yes=Submit';
    
    $('#h5_hoverbox_id_receipt_dialog_' + dialog_id + '_dialog').html('Loading...');
    
    $.post('/co/receiptsandallocations', options, function(data) {
        if (data.success) {
            $('#h5_hoverbox_id_receipt_dialog_' + dialog_id + '_dialog').html(data.table);
        }
    }, 'json');
}

function doReportAjaxInvAlloc(event, dialog_id) {
    
    event.preventDefault();
    
    var options = $('form[name="form_inquiry_' + dialog_id + '"]').serialize();
    options += '&ajax_popup=' + dialog_id + '&submit_yes=Submit';

    $('#h5_hoverbox_id_inv_alloc_dialog_' + dialog_id + '_dialog').html('Loading...');
    
    $.post('/rp/invoicesandallocations', options, function(data) {
        if (data.success) {
            $('#h5_hoverbox_id_inv_alloc_dialog_' + dialog_id + '_dialog').html(data.table);
        }
    }, 'json');
}

function showHelpButtons() {
    if ($('#et_help_switch').text() == 'Help - Off') {
        $('#et_help_switch').text('Help - On');
    } else if ($('#et_help_switch').text() == 'Help - On') {
        $('#et_help_switch').text('Help - Off');
    }
}