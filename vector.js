/**
 * Vector-specific scripts
 */
jQuery( function ( $ ) {

	/**
	 * Collapsible tabs
	 */
	var $cactions = $( '#p-cactions' ),
		$tabContainer = $( '#p-views ul' ),
		rAF = window.requestAnimationFrame || setTimeout,
		// Avoid forced style calculation during page load
		initialCactionsWidth = function () {
			var width = $cactions.width();
			initialCactionsWidth = function () {
				return width;
			};
			return width;
		};

	rAF( initialCactionsWidth );

	/**
	 * Focus search input at the very end
	 */
	$( '#searchInput' ).attr( 'tabindex', $( document ).lastTabIndex() + 1 );

	/**
	 * Dropdown menu accessibility
	 */
	$( 'div.vectorMenu' ).each( function () {
		var $el = $( this );
		$el.find( '> h3 > a' ).parent()
			.attr( 'tabindex', '0' )
			// For accessibility, show the menu when the h3 is clicked (bug 24298/46486)
			.on( 'click keypress', function ( e ) {
				if ( e.type === 'click' || e.which === 13 ) {
					$el.toggleClass( 'menuForceShow' );
					e.preventDefault();
				}
			} )
			// When the heading has focus, also set a class that will change the arrow icon
			.focus( function () {
				$el.find( '> a' ).addClass( 'vectorMenuFocus' );
			} )
			.blur( function () {
				$el.find( '> a' ).removeClass( 'vectorMenuFocus' );
			} )
			.find( '> a:first' )
			// As the h3 can already be focused there's no need for the link to be focusable
			.attr( 'tabindex', '-1' );
	} );

	// Bind callback functions to animate our drop down menu in and out
	// and then call the collapsibleTabs function on the menu
	$tabContainer
		.bind( 'beforeTabCollapse', function () {
			// If the dropdown was hidden, show it
			if ( $cactions.hasClass( 'emptyPortlet' ) ) {
				$cactions
					.removeClass( 'emptyPortlet' )
					.find( 'h3' )
						.css( 'width', '1px' ).animate( { width: initialCactionsWidth() }, 'normal' );
			}
		} )
		.bind( 'beforeTabExpand', function () {
			// If we're removing the last child node right now, hide the dropdown
			if ( $cactions.find( 'li' ).length === 1 ) {
				$cactions.find( 'h3' ).animate( { width: '1px' }, 'normal', function () {
					$( this ).attr( 'style', '' )
						.parent().addClass( 'emptyPortlet' );
				} );
			}
		} )
		.collapsibleTabs( {
			expandCondition: function ( eleWidth ) {
				// (This looks a bit awkward because we're doing expensive queries as late as possible.)

				var distance = $.collapsibleTabs.calculateTabDistance();
				// If there are at least eleWidth + 1 pixels of free space, expand.
				// We add 1 because .width() will truncate fractional values but .offset() will not.
				if ( distance >= eleWidth + 1 ) {
					return true;
				} else {
					// Maybe we can still expand? Account for the width of the "Actions" dropdown if the
					// expansion would hide it.
					if ( $cactions.find( 'li' ).length === 1 ) {
						return distance >= eleWidth + 1 - initialCactionsWidth();
					} else {
						return false;
					}
				}
			},
			collapseCondition: function () {
				// (This looks a bit awkward because we're doing expensive queries as late as possible.)
				// TODO The dropdown itself should probably "fold" to just the down-arrow (hiding the text)
				// if it can't fit on the line?

				// If there's an overlap, collapse.
				if ( $.collapsibleTabs.calculateTabDistance() < 0 ) {
					// But only if the width of the tab to collapse is smaller than the width of the dropdown
					// we would have to insert. An example language where this happens is Lithuanian (lt).
					if ( $cactions.hasClass( 'emptyPortlet' ) ) {
						return $tabContainer.children( 'li.collapsible:last' ).width() > initialCactionsWidth();
					} else {
						return true;
					}
				} else {
					return false;
				}
			}
		} );
} );

var userMenu = $('.user-menu');
var userButton = $('#user-profile');

function hideOnClickOutside(selector) {
	const outsideClickListener = (event) => {
		if (!$(event.target).closest(selector).length && !$(event.target).closest(userButton).length) {
			if ($(selector).is(':visible')) {
				$(selector).hide()
				removeClickListener()
			}
		}
	}
	const removeClickListener = () => {
		document.removeEventListener('click', outsideClickListener)
	}
	document.addEventListener('click', outsideClickListener)
}
$(document).click(function () {

	hideOnClickOutside(userMenu);
});

userButton.on('click', function () {
	userMenu.toggle();
});



// var userMenu = $('.user-menu');
// var userButton = $('#user-profile');

// //my toggle
// userButton.on('click', function () {
// 	userMenu.toggle();
// });

// $(document.body).mouseup(function (e) {
// 	if (!userMenu.is(e.target) && !userButton.is(e.target) && userButton.has(e.target).length === 0 && userMenu.has(e.target).length === 0) {
// 		userMenu.hide();
// 		userMenu.off('click', userMenu);
// 	}
// });


/*
Bug: 
If there is image inside button div, or if dismiss code is active, the menu cannot be toggled off.

What is happening is when a click happens, it thinks the button isnt the target so it removes the event handler.

Also I should merge the click events into one. Actuallly no, but could test performance of a thing that clicks
document then if target is button... that might be hard to performance test.

Also, something other than document should be target, because when u scroll the page it registers as a click.
*/

