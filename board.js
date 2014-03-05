Board = function() {
	var Controls = {
		CounterArity    : {},
		CounterHistory : {},
		CounterState    : {},
		CounterTrigger  : {},
		CounterValue    : {},
		CornerType      : {},
		ColorActive     : {},
		ColorPassive    : {},
		DigitHeight     : {},
		DigitWidth      : {},
		DigitAngle      : {},
		DigitDistance   : {},
		SegmentCount    : {},
		SegmentWidth    : {},
		SegmentDistance : {},
		TimerSpeed      : {},
		TimerRange      : {},
		WallType        : {}
	};
	var Display = {};
	var State   = 'off';
	var Timer   = {
		Speed:    1,
		Range:    1,
		Routine:  undefined
	};

	function init() {
		// setup the display itself
		this.Display = new ControlElements.Display( { displayId:'display' } );
		// setup the controls on the board
		this.Controls.CounterArity     = new ControlElements.CounterArity    ( { value:4 } );
		this.Controls.CounterHistory   = new ControlElements.CounterHistory  ( { value:{} } );
		this.Controls.CounterState     = new ControlElements.CounterState    ( { value:'off' } );
		this.Controls.CounterTrigger   = new ControlElements.CounterTrigger  ( { } );
		this.Controls.CounterValue     = new ControlElements.CounterValue    ( { value:0 } );
		this.Controls.CornerType       = new ControlElements.CornerType      ( { value:SegmentDisplay.RoundedCorner } );
		this.Controls.ColorActive      = new ControlElements.ColorActive     ( { value:'rgba(255,255,255,1)' } );
		this.Controls.ColorPassive     = new ControlElements.ColorPassive    ( { value:'rgba(0,0,0,0)' } );
		this.Controls.DigitHeight      = new ControlElements.DigitHeight     ( { value:50 } );
		this.Controls.DigitWidth       = new ControlElements.DigitWidth      ( { value:10 } );
		this.Controls.DigitAngle       = new ControlElements.DigitAngle      ( { value:7 } );
		this.Controls.DigitDistance    = new ControlElements.DigitDistance   ( { value:10 } );
		this.Controls.SegmentCount     = new ControlElements.SegmentCount    ( { value:SegmentDisplay.SevenSegment  } );
		this.Controls.SegmentWidth     = new ControlElements.SegmentWidth    ( { value:5 } );
		this.Controls.SegmentDistance  = new ControlElements.SegmentDistance ( { value:1 } );
		this.Controls.TimerSpeed       = new ControlElements.TimerSpeed      ( { value:1 } );
		this.Controls.TimerRange       = new ControlElements.TimerRange      ( { value:0 } );
		this.Controls.ToggleFullscreen = new ControlElements.ToggleFullscreen( { });
		this.Controls.WallType         = new ControlElements.WallType        ( { value:3 } );
		// blank the display initially
		this.Display.setBlank();
	}

	function getState() {
		return ('on'==this.State);
	}

	function setState( state ) {
		this.State = state;
    if (this.Controls.CounterState.setValue)
			this.Controls.CounterState.setValue( state );
		if ( 'on' == state ) {
			clearTimeout( this.Timer.Routine );
			Board.Controls.CounterTrigger.click();
		} else {
			clearTimeout( this.Timer.Routine );
		}
	}

	function getValue() {
		return this.Controls.CounterValue.getValue();
	}

	function setValue( value ) {
		// update control only if required (to prevent logical loops)
		if (   this.Controls.CounterValue.getValue
				&& (value!=this.Controls.CounterValue.getValue()) )
			this.Controls.CounterValue.setValue( value );
	}

	return {
		Controls: Controls,
		Display:  Display,
		State:    State,
		Timer:    Timer,
		init:     init,
		getState: getState,
		setState: setState,
		getValue: getValue,
		setValue: setValue
	}

}(); // Board

$( window ).load( function() {
	// initialize board elements (display and controls)
	Board.init();
	// register keyboard shortcut for manual trigger
	$( document ).keypress( function( event ) {
		if ( 32==event.keyCode ) {
			event.preventDefault();
			Board.Controls.CounterTrigger.click();
		}
	} );
	// fade in board when all is done (and css is loaded and applied)
	$( 'body' ).fadeTo( 1500, 1 );
} );
