/*
 The MIT License (MIT)

 Copyright (c) 2014 Kairat Rakhimov

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 script based on:
 Tigra Calendar v5.2 (11/20/2011)
 http://www.softcomplex.com/products/tigra_calendar/
 License: Public Domain... You're welcome.
 */

var s_activeDateInputID;

var TCAL_LNG_RU = {
    'months'     : ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    'weekdays'   : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    'longwdays'  : ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    'prevyear'   : 'Предыдущий год',
    'nextyear'   : 'Следующий год',
    'prevmonth'  : 'Предыдущий месяц',
    'nextmonth'  : 'Следующий месяц',
    'buttontoday': 'Сегодня'
};
var TCAL_LNG_KZ  = {
    'months'     : ['\u049A\u0430\u04A3\u0442\u0430\u0440', '\u0410\u049B\u043F\u0430\u043D', '\u041D\u0430\u0443\u0440\u044B\u0437', '\u0421\u04D9\u0443\u0456\u0440', '\u041C\u0430\u043C\u044B\u0440', '\u041C\u0430\u0443\u0441\u044B\u043C', '\u0428\u0456\u043B\u0434\u0435', '\u0422\u0430\u043C\u044B\u0437', '\u049A\u044B\u0440\u043A\u04AF\u0439\u0435\u043A', '\u049A\u0430\u0437\u0430\u043D', '\u049A\u0430\u0440\u0430\u0448\u0430', '\u0416\u0435\u043B\u0442\u043E\u049B\u0441\u0430\u043D'],
    'weekdays'   : ['\u0416\u043A', '\u0414\u0441', '\u0421\u0441', '\u0421\u0440', '\u0411\u0441', '\u0416\u043C', '\u0421\u043D'],
    'longwdays'  : ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    'prevyear'   : '\u0411\u04B1\u0440\u044B\u043D\u0493\u044B \u0436\u044B\u043B',
    'nextyear'   : '\u041A\u0435\u043B\u0435\u0441\u0456 \u0436\u044B\u043B',
    'prevmonth'  : '\u0411\u04B1\u0440\u044B\u043D\u0493\u044B \u0430\u0439',
    'nextmonth'  : '\u041A\u0435\u043B\u0435\u0441\u0456 \u0430\u0439',
    'buttontoday': '\u0431\u04AF\u0433\u0456\u043D'
};
var tCalLocale = "ru";
var TCAL_LNG = TCAL_LNG_RU;
var A_TCALTOKENS = [
    // A full numeric representation of a year, 4 digits
    {'t': 'Y', 'r': '19\\d{2}|20\\d{2}', 'p': function (d_date, n_value) { d_date.setFullYear(Number(n_value)); return d_date; }, 'g': function (d_date) { var n_year = d_date.getFullYear(); return n_year; }},
    // Numeric representation of a month, with leading zeros
    {'t': 'm', 'r': '0?[1-9]|1[0-2]', 'p': function (d_date, n_value) { d_date.setMonth(Number(n_value) - 1); return d_date; }, 'g': function (d_date) { var n_month = d_date.getMonth() + 1; return (n_month < 10 ? '0' : '') + n_month }},
    // A full textual representation of a month, such as January or March
    {'t': 'F', 'r': TCAL_LNG.months.join('|'), 'p': function (d_date, s_value) { for (var m = 0; m < 12; m++) if (TCAL_LNG.months[m] == s_value) { d_date.setMonth(m); return d_date; }}, 'g': function (d_date) { return TCAL_LNG.months[d_date.getMonth()]; }},
    // Day of the month, 2 digits with leading zeros
    {'t': 'd', 'r': '0?[1-9]|[12][0-9]|3[01]', 'p': function (d_date, n_value) { d_date.setDate(Number(n_value)); if (d_date.getDate() != n_value) d_date.setDate(0); return d_date }, 'g': function (d_date) { var n_date = d_date.getDate(); return (n_date < 10 ? '0' : '') + n_date; }},
    // Day of the month without leading zeros
    {'t': 'j', 'r': '0?[1-9]|[12][0-9]|3[01]', 'p': function (d_date, n_value) { d_date.setDate(Number(n_value)); if (d_date.getDate() != n_value) d_date.setDate(0); return d_date }, 'g': function (d_date) { var n_date = d_date.getDate(); return n_date; }},
    // A full textual representation of the day of the week
    {'t': 'l', 'r': TCAL_LNG.longwdays.join('|'), 'p': function (d_date, s_value) { return d_date }, 'g': function (d_date) { return TCAL_LNG.longwdays[d_date.getDay()]; }},
    // English ordinal suffix for the day of the month, 2 characters
    {'t': 'S', 'r': 'st|nd|rd|th', 'p': function (d_date, s_value) { return d_date }, 'g': function (d_date) { n_date = d_date.getDate(); if (n_date % 10 == 1 && n_date != 11) return 'st'; if (n_date % 10 == 2 && n_date != 12) return 'nd'; if (n_date % 10 == 3 && n_date != 13) return 'rd'; return 'th'; }}
];

var TCAL_CONFIG = {
    'cssprefix'  : 'jsCalendar',
    'yearscroll' : true, // show year scroller
    'weekstart'  : 1, // first day of week: 0-Su or 1-Mo
    'format'     : 'd.m.Y' // 'd-m-Y', Y-m-d', 'l, F jS Y'
};

function f_getCalendarHTML (d_date, e_input) {
    var s_pfx = TCAL_CONFIG.cssprefix;
    var s_format = TCAL_CONFIG.format;
    var d_today = f_tcalResetTime(new Date());
    var d_selected = f_tcalParseDate(e_input.value, s_format);
    if (!d_selected) d_selected = new Date(d_today);

    // show calendar for passed(d_date) or input value date
    d_date = d_date ? f_tcalResetTime(d_date) : new Date(d_selected);

    var d_firstDay = new Date(d_date);
    d_firstDay.setDate(1);
    d_firstDay.setDate(1 - (7 + d_firstDay.getDay() - TCAL_CONFIG.weekstart) % 7);

    var a_class, s_html = '<table id="' + s_pfx + 'Controls"><tbody><tr>'
        + (TCAL_CONFIG.yearscroll ? '<td id="' + s_pfx + 'PrevYear" ' + f_tcalRelDate(d_date, -1, 'y') + ' title="' + TCAL_LNG.prevyear + '"></td>' : '')
        + '<td id="' + s_pfx + 'PrevMonth"' + f_tcalRelDate(d_date, -1) + ' title="' + TCAL_LNG.prevmonth + '"></td><th>'
        + TCAL_LNG.months[d_date.getMonth()] + ' ' + d_date.getFullYear()
        + '</th><td id="' + s_pfx + 'NextMonth"' + f_tcalRelDate(d_date, 1) + ' title="' + TCAL_LNG.nextmonth + '"></td>'
        + (TCAL_CONFIG.yearscroll ? '<td id="' + s_pfx + 'NextYear"' + f_tcalRelDate(d_date, 1, 'y') + ' title="' + TCAL_LNG.nextyear + '"></td>' : '')
        + '</tr></tbody></table><table id="' + s_pfx + 'Grid"><tbody><tr>';

    // print weekdays titles
    for (var i = 0; i < 7; i++)
        s_html += '<th>' + TCAL_LNG.weekdays[(TCAL_CONFIG.weekstart + i) % 7] + '</th>';
    s_html += '</tr>' ;

    // print calendar table
    var n_date, n_month, d_current = new Date(d_firstDay);
    while (d_current.getMonth() == d_date.getMonth() ||
        d_current.getMonth() == d_firstDay.getMonth()) {

        s_html +='<tr>';
        for (var n_weekDay = 0; n_weekDay < 7; n_weekDay++) {

            a_class = [];
            n_date  = d_current.getDate();
            n_month = d_current.getMonth();

            if (d_current.getMonth() != d_date.getMonth())
                a_class[a_class.length] = s_pfx + 'OtherMonth';
            if (d_current.getDay() == 0 || d_current.getDay() == 6)
                a_class[a_class.length] = s_pfx + 'Weekend';
            if (d_current.valueOf() == d_today.valueOf())
                a_class[a_class.length] = s_pfx + 'Today';
            if (d_current.valueOf() == d_selected.valueOf())
                a_class[a_class.length] = s_pfx + 'Selected';

            s_html += '<td' + f_tcalRelDate(d_current) + (a_class.length ? ' class="' + a_class.join(' ') + '">' : '>') + n_date + '</td>';
            d_current.setDate(++n_date);
        }
        s_html +='</tr>';
    }
    s_html +='</tbody></table>';
    s_html +='<div class="calendar_footer"><div class="buttonR" style="width: 100%;margin:0"><div><div> <input type="button" class="footer_button" value="'+TCAL_LNG.buttontoday+'" onclick="f_tcalUpdate(new Date().getTime())"></div></div></div></div>';

    return s_html;
}

function f_closeAllCalendars () {
    $('#'+TCAL_CONFIG.cssprefix).css('visibility', 'hidden');
    $('.jsCalendar').removeClass('openCalendar');
}

/* Calendar day or control OnClick action.
 n_date: selected date as number
 b_keepOpen: if true will update calendar HTML, called by controls.*/
function f_tcalUpdate (n_selectedDate, b_keepOpen) {
    var e_activeInput = document.getElementById(s_activeDateInputID);
    if (!e_activeInput) return;
    d_date = new Date(n_selectedDate);
    if (b_keepOpen) {
        var e_calendar = document.getElementById(TCAL_CONFIG.cssprefix);
        if (!e_calendar || e_calendar.style.visibility != 'visible') return;
        e_calendar.innerHTML = f_getCalendarHTML(d_date, e_activeInput);
    }
    else {
        e_activeInput.value = f_tcalDateToString(d_date, TCAL_CONFIG.format);
        f_closeAllCalendars();
        $(e_activeInput).blur();
        $(e_activeInput).change();
    }
}

function f_tcalOnClick (e_calendarIcon) {
    var b_closeCalendar = $(e_calendarIcon).hasClass('openCalendar');
    f_closeAllCalendars();

    var e_input = $(e_calendarIcon).prev('input')[0];
    if (e_input.disabled) return;
    s_activeDateInputID = e_input.id;
    if (b_closeCalendar) return;

    // Click to open Calendar.
    $(e_calendarIcon).addClass('openCalendar');
    var n_left = f_getPosition (e_calendarIcon, 'Left'),
        n_top  = f_getPosition (e_calendarIcon, 'Top') + e_calendarIcon.offsetHeight;

    var e_calendar = document.getElementById(TCAL_CONFIG.cssprefix);
    if (!e_calendar) {
        e_calendar = document.createElement('div');
        e_calendar.onselectstart = function () { return false };
        e_calendar.id = TCAL_CONFIG.cssprefix;
        document.getElementsByTagName("body").item(0).appendChild(e_calendar);
    }
    e_calendar.innerHTML = f_getCalendarHTML(null, e_input);
    e_calendar.style.top = n_top + 'px';
    e_calendar.style.left = (n_left + e_calendarIcon.offsetWidth - e_calendar.offsetWidth) + 'px';
    $(e_calendar).css('visibility', 'visible');
}

function f_tcalInit () {
    if (!document.getElementsByTagName) return;
    initLocaleFromCookie();

    window.A_TCALTOKENS_IDX = {};
    for (i = 0; i < A_TCALTOKENS.length; i++)
        A_TCALTOKENS_IDX[A_TCALTOKENS[i]['t']] = A_TCALTOKENS[i];

    $(document).mouseup(function (e) {
        var b_clickOnCalendar = $("#" + TCAL_CONFIG.cssprefix).has(e.target).length !== 0;
        var b_clickOnCalendarIcon = $(e.target).hasClass(TCAL_CONFIG.cssprefix);
        if (!b_clickOnCalendar && !b_clickOnCalendarIcon) f_closeAllCalendars();
    });
}

function f_tcalRelDate (d_date, d_diff, s_units) {
    s_units = (s_units == 'y' ? 'FullYear' : 'Month');
    var d_result = new Date(d_date);
    if (d_diff) {
        d_result['set' + s_units](d_date['get' + s_units]() + d_diff);
        if (d_result.getDate() != d_date.getDate()) d_result.setDate(0);
    }
    return ' onclick="f_tcalUpdate(' + d_result.valueOf() + (d_diff ? ',1' : '') + ')"';
}

function f_tcalResetTime (d_date) {
    d_date.setMilliseconds(0);
    d_date.setSeconds(0);
    d_date.setMinutes(0);
    d_date.setHours(12);
    return d_date;
}

function f_tcalAddOnload (f_func) {
    if (document.addEventListener) {
        window.addEventListener('load', f_func, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onload', f_func);
    }
    else {
        var f_onLoad = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = f_func;
        }
        else {
            window.onload = function() {
                f_onLoad();
                f_func();
            }
        }
    }
}

function f_getPosition (e_elemRef, s_coord) {
    var n_position = 0, n_offset,
        e_element = e_elemRef;
    while (e_element) {
        n_offset = e_element["offset" + s_coord];
        n_position += n_offset;
        e_element = e_element.offsetParent;
    }
    e_element = e_elemRef;
    while (e_element != document.body) {
        n_offset = e_element["scroll" + s_coord];
        if (n_offset && e_element.style.overflow == 'scroll')
            n_position -= n_offset;
        e_element = e_element.parentNode;
    }
    return n_position;
}

function f_tcalParseDate (s_date, s_format) {
    if (!s_date) return undefined;
    var s_char, s_regexp = '^', a_tokens = {}, n_token = 0;
    for (var i = 0; i < s_format.length; i++) {
        s_char = s_format.charAt(i);
        if (A_TCALTOKENS_IDX[s_char]) {
            a_tokens[s_char] = ++n_token;
            s_regexp += '(' + A_TCALTOKENS_IDX[s_char]['r'] + ')';
        }
        else if (s_char == ' ') s_regexp += '\\s';
        else s_regexp += (s_char.match(/[\w\d]/) ? '' : '\\') + s_char;
    }
    var r_date = new RegExp(s_regexp + '$');
    if (!s_date.match(r_date)) return undefined;
    var s_val, d_date = f_tcalResetTime(new Date());
    d_date.setDate(1);
    for (i = 0; i < A_TCALTOKENS.length; i++) {
        s_char = A_TCALTOKENS[i]['t'];
        if (!a_tokens[s_char]) continue;
        s_val = RegExp['$' + a_tokens[s_char]];
        d_date = A_TCALTOKENS[i]['p'](d_date, s_val);
    }
    return d_date;
}

function f_tcalDateToString (d_date, s_format) {
    var s_char, s_date = '';
    for (var i = 0; i < s_format.length; i++) {
        s_char = s_format.charAt(i);
        s_date += A_TCALTOKENS_IDX[s_char] ? A_TCALTOKENS_IDX[s_char]['g'](d_date) : s_char;
    }
    return s_date;
}

function getLocaleFromCookie() {
    var nameEQ = 'lang=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var content = ca[i];
        while (content.charAt(0) == ' ') {
            content = content.substring(1, content.length);
        }
        if (content.indexOf(nameEQ) === 0) {
            return content.substring(nameEQ.length, content.length);
        }
    }
    return null;
}

function initLocaleFromCookie() {
    var currentLang = getLocaleFromCookie();
    if (currentLang != tCalLocale) {
        tCalLocale = currentLang;
        if (tCalLocale == 'kk') {
            TCAL_LNG = TCAL_LNG_KZ;
        } else {
            TCAL_LNG = TCAL_LNG_RU;
        }
    }
}

f_tcalAddOnload (f_tcalInit);

function callDivCalendar(div) {
    f_tcalOnClick(div);
}


