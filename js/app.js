var ContactBook = function(el) {
    this.collection = null;
    this.collectionView = null;

    ContactBook.prototype.init.call(this, el);
};

ContactBook.prototype.init = function () {
    //this
};

var Contact = Backbone.Model.extend({
    urlRoot: "/persons",
    defaults: {
        active: true
    },
    toggleStatus: function() {
        var s = this.get("active");
        this.set({
            active: !parseInt(s,10)
        });

        this.save();
        
        return this;
    }
});
var ContactView = Backbone.View.extend({
    tagName: "li",
    initialize: function(options) {
        this.listenTo(this.model, 'destroy', this.destroy);
        this.listenTo(this.model, 'change', this.render);
        //this.listenTo(this.model, 'change :active', this.changeActive);
    },
    template: _.template('<div id="<%= id %>" class="contact <% if(active == 0) print("inactive") %>"><input type="checkbox" value="1" name="active" <% if(parseInt(active, 10)) print("checked"); %> /><%= name %><img src="<%= avatar %>"/><span><%= email %></span><div class="delete">x</div></div>'),
    events: {
        "click .delete": "delete",
        "change input[type=checkbox]": 'toggleActive'
    },
    toggleActive: function (e) {
        this.model.toggleStatus();
    },
    delete: function(e) {
        e.stopPropagation();
        this.model.destroy();
    },
    destroy: function() {
        this.$el.fadeOut(function() {
            $(this).remove();
        });
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
})
var ContactForm = Backbone.View.extend({
    className: 'contact-form',
    template: _.template('<form>'
            + '<h2>Add new contact</h2>'
            + '<img/>'
            + '<input name="name" type="text" value="" placeholder="name"/>'
            + '<input name="email" type="text" value="" placeholder="email"/>'
            + '<div class="info"></div>'
            + '<button>Add</button>'
        +'</form>'),
    render: function() {
        this.$el.html(this.template());
        return this;
    },
    events: {
        submit: 'save'
    },
    save: function(e) {
        e.preventDefault();
        var name = this.$('[name=name]').val(),
            email = this.$('[name=email]').val();
            console.log(name);
        (new Contact({
            name: name,
            email: email
        })).save({}, {
            success: function(model, response, options) {
                document.body.appendChild(new ContactView({model: model}).render().el);
            }, error: function(){
                alert("error");
            }
        });
    }
});

var ContactCollection = Backbone.Collection.extend({model: Contact, 
        url: '/persons'
    });