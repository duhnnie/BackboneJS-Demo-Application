var Contact = Backbone.Model.extend({
    urlRoot: "/persons",
    defaults: {
        active: true
    },
    toggleStatus: function() {
        var s = this.get("active");
        this.set({
            active: !s 
        });

        this.save();
        
        return this;
    }
});
var ContactView = Backbone.View.extend({
    tagName: "li",
    initialize: function(options) {
        this.listenTo(this.model, 'destroy', this.clean);
        this.listenTo(this.model, 'change :active', this.changeActive);
    },
    template: _.template('<div id="<%= id %>" class="contact"><input type="checkbox" value="1" name="active" <% if(parseInt(active, 10)) print("checked"); %> /><%= name %><img src="<%= avatar %>"/><span><%= email %></span><div class="delete">x</div></div>'),
    events: {
        "click": "click",
        "click .delete": "delete",
        "click input": "clickInput",
        "change input[type=checkbox]": 'toggleActive'
    },
    toggleActive: function (e) {
        this.model.toggleStatus();
    },
    changeActive: function() {
        if(parseInt(this.model.get("active"))) {
            this.$el.fadeIn().find('.delete').show();
        } else {
            this.$el.fadeTo('fast', 0.3).find('.delete').hide();
        }
    },
    clickInput: function(e) {
        e.stopPropagation();
    },
    click: function() {
        alert("edit");
    },
    delete: function(e) {
        e.stopPropagation();
        this.model.destroy();
    },
    clean: function() {
        this.$el.fadeOut(function() {
            $(this).remove();
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        if(!parseInt(this.model.get("active"), 10)) {
            this.model.trigger('change input[type=checkbox]');
        }
        return this;
    }
})