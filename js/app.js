var Contact = Backbone.Model.extend({urlRoot: '/persons'});

var ContactView = Backbone.View.extend({
    tagName: "div",
    className: "contact",
    template: _.template('<input type="checkbox" value="1" name="active" <% if(parseInt(active, 10)) print("checked"); %> /><%= name %><img src="<%= avatar %>"/><span><%= email %></span><div class="delete">x</div>'),
    render: function() {
        this.$el.attr("id", this.model.get("id"));
        if(!parseInt(this.model.get("active"), 10)) {
            this.$el.addClass("inactive");
        }
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
