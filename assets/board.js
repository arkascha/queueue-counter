Board = function() {
	// the set of controls available on the board
	var Controls = {
		CounterArity    : {},
		CounterHistory  : {},
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
		ProfileExport   : {},
		ProfileImport   : {},
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
		this.Controls.DigitHeight      = new ControlElements.DigitHeight     ( { value:60 } );
		this.Controls.DigitWidth       = new ControlElements.DigitWidth      ( { value:10 } );
		this.Controls.DigitAngle       = new ControlElements.DigitAngle      ( { value:7 } );
		this.Controls.DigitDistance    = new ControlElements.DigitDistance   ( { value:10 } );
		this.Controls.ProfileExport    = new ControlElements.ProfileExport   ( { } );
		this.Controls.ProfileImport    = new ControlElements.ProfileImport   ( { } );
		this.Controls.SegmentCount     = new ControlElements.SegmentCount    ( { value:SegmentDisplay.SevenSegment  } );
		this.Controls.SegmentWidth     = new ControlElements.SegmentWidth    ( { value:5 } );
		this.Controls.SegmentDistance  = new ControlElements.SegmentDistance ( { value:1 } );
		this.Controls.TimerSpeed       = new ControlElements.TimerSpeed      ( { value:1 } );
		this.Controls.TimerRange       = new ControlElements.TimerRange      ( { value:0 } );
		this.Controls.ToggleFullscreen = new ControlElements.ToggleFullscreen( { });
		this.Controls.WallType         = new ControlElements.WallType        ( { value:'assets/background/wall-02.jpg' } );
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

	function setZoomLevel() {
		// compute zoom factor to fit board into the available space
		var xFactor = Math.floor ( $( window ).width() ) / 1920;
		var yFactor = Math.floor ( $( window ).height()) / 1200;
		var factor  = Math.min ( xFactor, yFactor );
		$( 'body' ).css( 'zoom', factor );
	}

	return {
		Controls:     Controls,
		Display:      Display,
		State:        State,
		Timer:        Timer,
		init:         init,
		getState:     getState,
		setState:     setState,
		getValue:     getValue,
		setValue:     setValue,
		setZoomLevel: setZoomLevel
	}

}(); // Board

$( document ).ready( function() {
	Board.setZoomLevel();
	// register handler to adapt to window resizing events
	$( window ).resize( Board.setZoomLevel );
} );

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
