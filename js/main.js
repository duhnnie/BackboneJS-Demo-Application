var init = function() {
    var contact = new Contact();

    contact.on('change', function() {
        console.log(arguments);
    });

    contact.set({
        name: "Pepiro",
        email: "pesaspiro.gomez@gmail.com",
        active: 1
    });

    contact.set({
        name: "Pedfgdo",
        email: "pesadfgdfro.gomez@gmail.com",
        active: 1
    });

    /*contact.save({}, {
        success: function(model) {
            console.log(model.get("id"));
            model.destroy({
                success: function (model) {
                    console.log(model.toJSON());
                }        
            });
        }
    });*/

    /*var contactView = new ContactView({model: contact});

    contact.set({name: "My Real Name"});
    contactView.render();
    document.body.appendChild(contactView.el);*/
    /*contact.fetch({
        success: function(model, response, options) {
            console.log(contact.toJSON());
        }
    });*/
};

$(init);