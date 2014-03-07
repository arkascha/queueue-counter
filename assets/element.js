ControlElements = function() {

	function Display( init ) {
		var Widget = new SegmentDisplay( init.name );
		Widget.pattern         = init.pattern         || '####',
		Widget.cornerType      = init.cornerType      || SegmentDisplay.RoundedCorner;
		Widget.displayId       = init.displayId       || 'display',
		Widget.displayAngle    = init.displayAngle    || 5;
		Widget.digitHeight     = init.digitHeight     || 100;
		Widget.digitWidth      = init.digitWidth      || 40;
		Widget.digitDistance   = init.digitDistance   || 10;
		Widget.segmentCount    = init.segmentCount    || SegmentDisplay.SevenSegment;
		Widget.segmentWidth    = init.segmentWidth    || 10;
		Widget.segmentDistance = init.segmentDistance || 5;
		Widget.colorOn         = init.colorOn         || 'rgba(40, 250, 0, 1.0)';
		Widget.colorOff        = init.colorOff        || 'rgba(20, 250, 0, 0.1)';

		function setBlank() {
			Widget.setValue('          ');
		}

		function setParam( parameter, value ) {
			switch (parameter) {
				case 'pattern'         : Widget.pattern         = value; break;
				case 'cornerType'      : Widget.cornerType      = value; break;
				case 'displayAngle'    : Widget.displayAngle    = value; break;
				case 'digitHeight'     : Widget.digitHeight     = value; break;
				case 'digitWidth'      : Widget.digitWidth      = value; break;
				case 'digitDistance'   : Widget.digitDistance   = value; break;
				case 'segmentCount'    : Widget.segmentCount    = value; break;
				case 'segmentWidth'    : Widget.segmentWidth    = value; break;
				case 'segmentDistance' : Widget.segmentDistance = value; break;
				case 'colorOn'         : Widget.colorOn         = value; break;
				case 'colorOff'        : Widget.colorOff        = value; break;
			} // switch
			// we simply re-set the value without specifying a new one, this applies all parameters and checks
			setValue();
		}

		function setValue( value ) {
			/* if called without value we just re-set the current value */
			value = value || Board.Controls.CounterValue.getValue();
			var output = ('          ' + value.toString()).slice( - Board.Controls.CounterArity.getValue() );
			// update value in corresponding control element
			if ( value!=Board.Controls.CounterValue.getValue() ) {
				Board.Controls.CounterValue.setValue( value );
			}
			// show new value
			Widget.setValue( output );
		}

		return {
			setParam: setParam,
			setValue: setValue,
			setBlank: setBlank,
		}

	} // Display





	function ColorActive( init ) {
		var options = {
			orientation: 'horizontal',
			range:       'max',
			max:         init.max   || 255,
			step:        init.step  ||   1,
			color:       init.value || 'rgba(255,255,255,1)',
			change:      changed
		};
		var Widget = new ControlWidgets.ColorChooser( '#wColorActive', options );

		function getChannels() {
			return Widget.getChannels();
		}

		function setChannels( channels ) {
			return Widget.setChannels( channels );
		}

		function getRGBA() {
			return Widget.getRGBA();
		}

		function setRGBA( rgba ) {
			return Widget.setRGBA( rgba );
		}

		function changed( rgba ) {
			Board.Display.setParam( 'colorOn', rgba );
		}

		Board.Display.setParam( 'colorOn', getRGBA() );

		return {
			getChannels: getChannels,
			setChannels: setChannels,
			getRGBA:     getRGBA,
			setRGBA:     setRGBA,
			changed:     changed
		}
	} // ColorActive




	function ColorPassive( init ) {
		var options = {
			orientation: 'horizontal',
			range:       'max',
			max:         init.max   || 255,
			step:        init.step  ||   1,
			color:       init.value || 'rgba(255,255,255,0.1)',
			change:      changed
		};
		var Widget = new ControlWidgets.ColorChooser( '#wColorPassive', options );

		function getChannels() {
			return Widget.getChannels();
		}

		function setChannels( channels ) {
			return Widget.getChannels( channels );
		}

		function getRGBA() {
			return Widget.getRGBA();
		}

		function setRGBA( rgba ) {
			return Widget.getRGBA( rgba );
		}

		function changed( rgba ) {
			Board.Display.setParam( 'colorOff', rgba );
		}

		Board.Display.setParam( 'colorOff', getRGBA() );

		return {
			getChannels: getChannels,
			setChannels: setChannels,
			getRGBA:     getRGBA,
			setRGBA:     setRGBA,
			changed:     changed
		}
	} // ColorPassive




	function CornerType( init ) {
		var collection = [
			SegmentDisplay.SymmetricCorner,
			SegmentDisplay.SquaredCorner,
			SegmentDisplay.RoundedCorner
		]
		var options = {
			value: init.value || SegmentDisplay.RoundedCorner,
			change: function(event) { Board.Display.setParam( 'cornerType', parseInt(event.target.value) ); },
		};
		var Widget = new ControlWidgets.ButtonSet( '#wCornerType', options );

		function getValue() {
				return collection[Widget.getValue()] || SegmentDisplay.RoundedCorner;
		}

		function setValue( value ) {
			value = value || options.value || SegmentDisplay.RoundedCorner;
			if (collection.indexOf(value))
				return Widget.setValue( value );
			else
				return Widget.setValue( SegmentDisplay.RoundedCorner );
		}

		Board.Display.setParam( 'cornerType', options.value );

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // CornerType




	function CounterHistory( init ) {
		var history = Array.apply(null, new Array(100)).map(Number.prototype.valueOf,0),
				current = 0,
				timer   = setTimeout( tick, 1000 );
		var options = {},
				widget = new ControlWidgets.Sparkline( '#wCounterHistory', options );

		function getValue() {
				return history;
		}

		function setValue( value ) {
			value = value || options.value || 0;
			current = (1==value) ? 1 : ( (-1==value) ? -1 : 0 );
			return getValue();
		}

		function tick() {
			timer   = setTimeout( tick, 1000 );
			history.push( current );
			current = Board.getState() ? 0 : -1;
			history.shift();
			widget.render( history );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // CounterHistory


	function CounterArity( init ) {
		var options = {
			min:          init.min || 1,
			max:          init.max || 7,
			tickInterval: 1,
			orientation:  'horizontal',
			range:        false,
      value:        init.value || 3,
			slide:        function( event, data ) { Board.Controls.CounterValue.setLength( data.value ); },
			change:       function( event, data ) { Board.Display.setParam ( 'pattern', Board.Controls.CounterArity.getPattern() ); }
		};
		var Widget = new ControlWidgets.SliderWithLabels( '#wCounterArity', options );

		function getPattern() {
			var value = Widget.getValue();
			return '##########'.substring( 0, value );
		}

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			return Widget.setValue( value );
		}

		return {
			getPattern: getPattern,
			getValue:   getValue,
			setValue:   setValue
		}
	} // CounterArity




	function CounterState( init ) {
		var options = {
			value:  init.value || 'off',
			change: function(e, state) { Board.setState( state ); }
		};
		var Widget = new ControlWidgets.Switch( '#wCounterState', options );

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			value = value || options.value || 0;
			return Widget.setValue( value );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // CounterState




	function CounterTrigger( init ) {
		var options = {
			click: clicked
		};
		var Widget = new ControlWidgets.ButtonWithLight( '#wCounterTrigger', options );

		function click() {
			Widget.click();
		}

		function clicked() {
			if ( 'on'==Board.State ) {
				clearTimeout( Board.Timer.Routine );
				Board.Timer.Routine = setTimeout( function(){ Board.Controls.CounterTrigger.click(); }, duration() );
			}
			Board.Controls.CounterValue.incValue();
			Board.Controls.CounterHistory.setValue( 1 );
	}

		function duration() {
			// factor 1000 to give milliseconds
			return 1000 * ( Board.Timer.Speed + Math.floor(Math.random()*Board.Timer.Range) );
		}

		return {
			click:   click,
			clicked: clicked
		}
	} // CounterTrigger




	function CounterValue( init ) {
		var options = {
			length: init.length ||    4,
			min:    init.min    ||    0,
			max:    init.max    || 9999,
			page:   init.page   ||   10,
			step:   init.step   ||    1,
      value:  init.value  ||    0,
 			change: function( event,ui ) { setValue( event.target.value ) },
// 			spin:   function( event,ui ) { setValue( event.target.value ) },
			stop:   function( event,ui ) { setValue( event.target.value ) }
		};
		var Widget = new ControlWidgets.Spinner( '#wCounterValue', options );

		function setLength( value ) {
			Widget.setLength( value );
			setMax( Math.pow( 10, value ) -1 );
		}

		function getMax() {
				return Widget.getMax();
		}

		function setMax( max ) {
			Widget.setMax( max );
		}

		function getValue() {
			return Widget.getValue() || 0;
		}

		function incValue() {
			setValue( getValue()+1 );
		}

		function setValue( value ) {
			value = parseInt( value ) || options.value || 0;
			// accept new value, but keep it in range
			value = value % (getMax()+1);
			// update internal widget value
			Widget.setValue( value );
			// visualize new value
			Board.Display.setValue( value );
			return getValue();
		}

		return {
			setLength: setLength,
			getMax:    getMax,
			setMax:    setMax,
			getValue:  getValue,
			incValue:  incValue,
			setValue:  setValue
		}
	} // ConterValue




	function DigitAngle( init ) {
		// we need to map the value range to positive values
		var min     = -30
				max     = +30,
				delta   = init.min||min;
		var options = {
			delta:  delta,
			min:    0,
			max:    (init.max||max) - delta,
			step:   init.step  || 1,
			value:  (init.value||0) - delta,
			change: function( value ) { Board.Display.setParam( 'displayAngle', value ); }
		};
		var Widget = new ControlWidgets.Knob( '#wDigitAngle', options );

		function getValue() {
			return Widget.getValue() + delta;
		}

		function setValue( value ) {
			return Widget.setValue( (value || options.value || 0) - delta );
		}
		return {
			getValue: getValue,
			setValue: setValue
		}
	} // DigitAngle




	function DigitDistance( init ) {
		var options = {
			min:          init.min   ||  0,
			max:          init.max   || 50,
			step:         init.step  ||  1,
			currentValue: init.value || 10,
			change:       function( value ) { Board.Display.setParam( 'digitDistance', value ); }
		};
		var Widget = new ControlWidgets.Knob( '#wDigitDistance', options );

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			return Widget.setValue( value || options.value || 0 );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // DigitDistance




	function DigitHeight( init ) {
		var options = {
			min:    init.min   ||  10,
			max:    init.max   || 200,
			value:  init.value || 100,
			change: function( value ) { Board.Display.setParam( 'digitHeight', value ); }
		};
		var Widget = new ControlWidgets.Knob( '#wDigitHeigth', options );

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			return Widget.setValue( value || options.value || 0 );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // DigitHeight




	function DigitWidth( init ) {
		var options = {
			min:    init.min   ||  10,
			max:    init.max   || 200,
			value:  init.value ||  20,
			change: function( value ) { Board.Display.setParam( 'digitWidth', value ); }
		};
		var Widget = new ControlWidgets.Knob( '#wDigitWidth', options );

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			return Widget.setValue( value || options.value || 0 );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // DigitWidth




	function ProfileExport( init ) {
		var options = {
			clicked:  clicked,
			payload:  payload
		};
		var Widget = new ControlWidgets.FileStorer( '#wProfileExport', options );

		function clicked() {
			// stop counter
			Board.Controls.CounterState.setValue( 'off' );
		}

		function payload() {
			var profile = {
			  Controls: {
					CounterArity    : Board.Controls.CounterArity.getValue(),
					CounterState    : Board.Controls.CounterState.getValue(),
					CounterValue    : Board.Controls.CounterValue.getValue(),
					CornerType      : Board.Controls.CornerType.getValue(),
					ColorActive     : Board.Controls.ColorActive.getChannels(),
					ColorPassive    : Board.Controls.ColorPassive.getChannels(),
					DigitHeight     : Board.Controls.DigitHeight.getValue(),
					DigitWidth      : Board.Controls.DigitWidth.getValue(),
					DigitAngle      : Board.Controls.DigitAngle.getValue(),
					DigitDistance   : Board.Controls.DigitDistance.getValue(),
					SegmentCount    : Board.Controls.SegmentCount.getValue(),
					SegmentWidth    : Board.Controls.SegmentWidth.getValue(),
					SegmentDistance : Board.Controls.SegmentDistance.getValue(),
					TimerSpeed      : Board.Controls.TimerSpeed.getValue(),
					TimerRange      : Board.Controls.TimerRange.getValue(),
					WallType        : Board.Controls.WallType.getValue()
				},
			};
			return JSON.stringify( profile );
		}

		return {}
	} // ProfileExport




	function ProfileImport( init ) {
		var options = {
			clicked: clicked,
			payload: payload
		};
		var Widget = new ControlWidgets.FileReader( '#wProfileImport', options );

		function clicked() {
		}

		function payload( payload ) {
			try {
				var profile = $.parseJSON( payload );
				// some basic sanity checks
				if ( undefined==profile.Controls )
					throw { message: 'No controls state stored inside that file.' };
			} catch (err) { alert('Sorry, that file is not a counter profile!'); }
			// set single values
			for ( var control in profile.Controls ) {
				var value = profile.Controls[control];
				switch( control ) {
					case 'WallType'        : Board.Controls.WallType.setValue( value );        break;
					case 'TimerSpeed'      : Board.Controls.TimerSpeed.setValue( value );      break;
					case 'TimerRange'      : Board.Controls.TimerRange.setValue( value );      break;
					case 'CounterArity'    : Board.Controls.CounterArity.setValue( value );    break;
					case 'CounterValue'    : Board.Controls.CounterValue.setValue( value );    break;
					case 'CornerType'      : Board.Controls.CornerType.setValue( value );      break;
					case 'ColorActive'     : Board.Controls.ColorActive.setChannels( value );  break;
					case 'ColorPassive'    : Board.Controls.ColorPassive.setChannels( value ); break;
					case 'DigitHeight'     : Board.Controls.DigitHeight.setValue( value );     break;
					case 'DigitWidth'      : Board.Controls.DigitWidth.setValue( value );      break;
					case 'DigitAngle'      : Board.Controls.DigitAngle.setValue( value );      break;
					case 'DigitDistance'   : Board.Controls.DigitDistance.setValue( value );   break;
					case 'SegmentCount'    : Board.Controls.SegmentCount.setValue( value );    break;
					case 'SegmentWidth'    : Board.Controls.SegmentWidth.setValue( value );    break;
					case 'SegmentDistance' : Board.Controls.SegmentDistance.setValue( value ); break;
					case 'CounterState'    : Board.Controls.CounterState.setValue( value );    break;
				}
			}
		}

		return {}
	} // ProfileImport




	function SegmentCount( init ) {
		var collection = [
			SegmentDisplay.SevenSegment,
			SegmentDisplay.FourteenSegment,
			SegmentDisplay.SixteenSegment
		]
		var options = {
			value: init.value || SegmentDisplay.SevenSegment,
			change: function(event) { Board.Display.setParam( 'segmentCount', parseInt(event.target.value) ); },
		};
		var Widget = new ControlWidgets.ButtonSet( '#wSegmentCount', options );

		function getValue() {
			return collection[Widget.getValue()] || SegmentDisplay.SevenSegment;
		}

		function setValue( value ) {
			value = value || options.value || 0;
			if ( collection.indexOf( value ) )
				Widget.setValue( value );
			else
				Widget.setValue( SegmentDisplay.SevenSegment );
			return getValue();
		}

		Board.Display.setParam( 'segmentCount', options.value );

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // SegmentCount




	function SegmentWidth( init ) {
		var options = {
			min:    init.min   ||   1,
			max:    init.max   ||  20,
			step:   init.step  || 0.1,
			value:  init.value ||  10,
			change: function( value ) { Board.Display.setParam( 'segmentWidth', value ); }
		};
		var Widget = new ControlWidgets.Knob( '#wSegmentWidth', options );

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			return Widget.setValue( value || options.value || 0 );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // SegmentWidth




	function SegmentDistance( init ) {
		var options = {
			min:    init.min   ||  0,
			max:    init.max   || 25,
			step:   init.step  ||  1,
			value:  init.value ||  5,
			change: function( value ) { Board.Display.setParam( 'segmentDistance', value ); }
		};
		var Widget = new ControlWidgets.Knob( '#wSegmentDistance', options );

		function getValue() {
			return Widget.getValue();
		}

		function setValue( value ) {
			return Widget.setValue( value || options.value || 0 );
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // SegmentDistance



	function TimerRange( init ) {
		var options = {
			length: init.length ||    3,
			min:    init.min    ||    0,
			max:    init.max    || 9999,
			page:   init.page   ||   10,
			step:   init.step   ||    1,
      value:  init.value  ||    0,
			change: function( event,ui ) { setValue( event.target.value ) },
// 			spin:   function( event,ui ) { setValue( event.target.value ) },
			stop:   function( event,ui ) { setValue( event.target.value ) }
		};
		var Widget = new ControlWidgets.Spinner( '#wTimerRange', options );

		function getValue() {
			return Widget.getValue() || 0;
		}

		function setValue( value ) {
			value = parseInt( value ) || options.value || 0;
			Widget.setValue( value );
			Board.Timer.Range = value;
			return getValue();
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // TimerRange




	function TimerSpeed( init ) {
		var options = {
			length: init.length ||    3,
			min:    init.min    ||    1,
			max:    init.max    || 9999,
			page:   init.page   ||   10,
			step:   init.step   ||    1,
      value:  init.value  ||    1,
			change: function( event,ui ) { setValue( event.target.value ) },
// 			spin:   function( event,ui ) { setValue( event.target.value ) },
			stop:   function( event,ui ) { setValue( event.target.value ) }
		};
		var Widget = new ControlWidgets.Spinner( '#wTimerSpeed', options );

		function getValue() {
			return Widget.getValue() || 0;
		}

		function setValue( value ) {
			value = parseInt( value ) || options.value || 0;
			Widget.setValue( value );
			Board.Timer.Speed = value;
			return getValue();
		}

		return {
			getValue: getValue,
			setValue: setValue
		}
	} // TimerSpeed




	function ToggleFullscreen( init ) {
		var Target = $( 'body' );
		var options = {
			toggled:      toggled
		};
		var Widget = new ControlWidgets.ButtonWithState( '#wToggleFullscreen', options );
		Target.on( 'fscreenopen',  function(){ Target.find('.hotspot img').attr('src','assets/img/fullscreen-off.png')} );
		Target.on( 'fscreenclose', function(){ Target.find('.hotspot img').attr('src','assets/img/fullscreen-on.png' )} );

		function switchOff() {
			toggle( false );
		}

		function switchOn() {
			toggle( true );
		}

		function toggle( value ) {
			Widget.toggle( value );
		}

		function toggled( value ) {
			var state = value || ! Board.Fullscreen;
			if ( state )
				Target.fullscreen();
			else
				$.fullscreen.exit()
			Board.Fullscreen = state;
		}

		return {
			switchOff: switchOff,
			switchOn:  switchOn,
			toggle:    toggle,
			toggled:   toggled
		}
	} // ToggleFullscreen



	function WallType( init ) {
		var options = {
			value:  init.value || 'assets/background/wall-02.jpg',
			change: function(event) { setValue( event.target.value || 'assets/background/wall-02.jpg' ); }
		};
		var Widget = new ControlWidgets.ButtonSet( '#wWallType', options );
		setValue( options.value );

		function getValue() {
			if ( Widget )
				return Widget.getValue();
			else
				return options.value;
		}

		function setValue( value ) {
			value = value || options.value || 0;
			$( 'body' ).css( 'background', 'url("' + value + '") repeat' );
			return getValue();
		}

		return {
			getValue: getValue,
			setValue: setValue,
			Widget:   Widget
		}
	} // WallType




	return {
		Display:          Display,
		ColorActive:      ColorActive,
		ColorPassive:     ColorPassive,
		CornerType:       CornerType,
		CounterHistory:   CounterHistory,
		CounterArity:     CounterArity,
		CounterState:     CounterState,
		CounterTrigger:   CounterTrigger,
		CounterValue:     CounterValue,
		DigitAngle:       DigitAngle,
		DigitDistance:    DigitDistance,
		DigitHeight:      DigitHeight,
		DigitWidth:       DigitWidth,
		ProfileExport:    ProfileExport,
		ProfileImport:    ProfileImport,
		SegmentCount:     SegmentCount,
		SegmentWidth:     SegmentWidth,
		SegmentDistance:  SegmentDistance,
		TimerSpeed:       TimerSpeed,
		TimerRange:       TimerRange,
		ToggleFullscreen: ToggleFullscreen,
		WallType:         WallType
	}

}(); // ControlElements
