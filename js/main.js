var init = function() {
    document.body.appendChild(new ContactForm().render().el);
    $.get('persons', function(a, e, i){
        a.forEach(function(item, index, allTheItems){
            models.push(new Contact(item));
            document.body.appendChild(new ContactView({model: models[index]}).render().el);
        });
    });
},
models = [];

$(init);