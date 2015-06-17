jQuery( function( $ ) {

	function timepckeri18n( i18ntar, resourceobject ) {
		for ( var item in resourceobject ) {
			key = i18ntar + '.' + item;
			val = geti18n( key );
			if ( key != val ) {
				switch ( typeof( resourceobject[ item ] ) ) {
					case 'string':
						resourceobject[ item ] = val;
						break;
					case 'object':
						resourceobject[ item ] = val.split( "," )
						break;
				}
			}
		}
		return resourceobject;
	}

	var datepicker = $.datepicker.regional[ '' ];
	datepicker = timepckeri18n( 'common.Datepicker', datepicker );

	var timepicker = $.timepicker.regional[ '' ];
	timepicker = timepckeri18n( 'common.Timepicker', timepicker );


	$.datepicker.setDefaults( datepicker );
	$.timepicker.setDefaults( timepicker );

	/*$.datepicker.regional[ 'lang' ] = {
		closeText: 'Egina',
		prevText: '&#x3C;Aur',
		nextText: 'Hur&#x3E;',
		currentText: 'Gaur',
		monthNames: [ 'urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina',
			'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'
		],
		monthNamesShort: [ 'urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.',
			'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'
		],
		dayNames: [ 'igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata' ],
		dayNamesShort: [ 'ig.', 'al.', 'ar.', 'az.', 'og.', 'ol.', 'lr.' ],
		dayNamesMin: [ 'ig', 'al', 'ar', 'az', 'og', 'ol', 'lr' ],
		weekHeader: 'As',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};

	$.timepicker.regional[ 'lang' ] = {
		currentText: 'Now',
		closeText: 'Done',
		ampm: false,
		amNames: ['AM', 'A'],
		pmNames: ['PM', 'P'],
		timeFormat: 'hh:mm tt',
		timeSuffix: '',
		timeOnlyTitle: 'Choose Time',
		timeText: 'Time2',
		hourText: 'Hour3',
		minuteText: 'Minute',
		secondText: 'Second',
		millisecText: 'Millisecond',
		timezoneText: 'Time Zone'
	};*/

} );