var ContactBook = (function() {
    var TheContactBook,
        Contact,
        ContactView,
        ContactCollection,
        ContactCollectionView,
        ContactForm;

    Contact = Backbone.Model.extend({
        urlRoot: "/persons",
        initialize: function() {
            this.on('sync', this.onSync);
        },
        defaults: {
            active: true
        },
        onSync: function(a, b, c) {
            console.log(this.toJSON());
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

    ContactView = Backbone.View.extend({
        tagName: "div",
        className: "contact",
        initialize: function(options) {
            this.listenTo(this.model, 'destroy', this.destroy);
            this.listenTo(this.model, 'change', this.render);
        },
        template: _.template('<input type="checkbox" value="1" name="active" <% if(parseInt(active, 10)) print("checked"); %> /><%= name %><img src="<%= avatar %>"/><span><%= email %></span><div class="delete">x</div>'),
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
            this.$el.animate({top: '100px', opacity: 0}, function(){
                $(this).remove();
            });
        },
        render: function() {
            this.$el.attr("id", this.model.get("id"));
            if(!parseInt(this.model.get("active"), 10)) {
                this.$el.addClass("inactive");
            }
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });

    ContactForm = Backbone.View.extend({
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
            var that = this, name = this.$('[name=name]').val(),
                email = this.$('[name=email]').val()
                newContact = new Contact({
                    name: name,
                    email: email
                });

            newContact.save({},{success: function(model, response, options) {
                that.collection.add(model);
            }});
        }
    });

    ContactCollection = Backbone.Collection.extend();

    ContactCollectionView = Backbone.View.extend({
        tagName: 'ul',
        initialize: function() {
            this.collection.on('add', this.add, this);
        },
        render: function() {
            this.collection.forEach(this.add, this);
            return this;
        },
        add: function(contact) {
            var contact_view = new ContactView({model: contact})
                li = document.createElement("li")
                el = contact_view.render().el;

            li.appendChild(el);
            el.style.top = "100px";
            el.style.opacity = 0;
            this.el.appendChild(li);
            $(el).animate({
                opacity: 1,
                top: 0
            });
        }
    });

    //the Class

    TheContactBook = function(element, options) {
        this.html = null;
        this.collection = null;
        this.collection_view = null;
        this.form = null;

        TheContactBook.prototype.init.call(this, element, options || {});
    };

    TheContactBook.prototype.init = function (element, options) {
        var collection;
        if(element) {
            this.html = $(element).get(0);
        } else {
            this.html = document.body;
        }
        $(this.html).html("");

        if(!options.url) {
            throw new Error('A object "url" property must be specified');
        }

        collection = new ContactCollection([], {model: Contact, url: options.url});
        this.collection = collection;
        this.collection_view =  new ContactCollectionView({collection: collection});
        this.form = new ContactForm({collection: collection});

        this.html.appendChild(this.form.render().el);
        this.html.appendChild(this.collection_view.el);

        this.collection.fetch();

        return this;
    };

    return TheContactBook;
})();