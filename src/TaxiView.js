taxi.TaxiView = Backbone.View.extend({
  className : 'taxi',
  view : null,
  render : function () {
    var
      $el = this.$el;
    $el.html(taxi.templates.taxi());
    this.$content = $el.find('.taxi-view');
    return this;
  },
  setView : function (view) {
    if (this.view && this.view.destroy) {
      this.view.destroy();
    }
    if (view) {
      this.view = view;
      this.$content.html(view.render().$el);
    }
  }
});
