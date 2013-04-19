var init = function() {
    $.get('persons', function(a, e, i){
        a.forEach(function(item, index, allTheItems){
            models.push(new Contact(item));
            document.body.appendChild(new ContactView({model: models[index]}).render().el);
        });
        var a_person = new Contact({name: "Pepiro", email: "p.gomez@hotmail.com"});
        var a_person_v = new ContactView({model: a_person});
        //a_person.fetch();
        //a_person.set({name: "Fredo", email: "fredo@gmail.com"});
        a_person.save(a_person.attributes, {
            success: function(a, b, c) {
                console.log(a.toJSON());
                //a.destroy();
            }
        });
        //console.log(a_person.get("id"));
        
        //document.body.appendChild(a_person_v.render().el);
    });
},
models = [];

$(init);