var SEQ;
SEQ = SEQ || {};
SEQ.page_controls = SEQ.page_controls || {};
SEQ.page_controls.Menu = function ($menu, $menu_control) {
  var t = this;
  t.$menu = $menu;
  t.$menu_control = $menu_control;

  t.$menu.
      on("mouseleave click", function() {
        t.$menu.removeClass("site-menu-active");
      });
  t.$menu_control.
      on("mouseenter", function(ev) {
        t.$menu.addClass("site-menu-active");
      }).
      on("click", function(ev) {
        ev.stopPropagation();
        t.$menu.toggleClass("site-menu-active");
      });
}
