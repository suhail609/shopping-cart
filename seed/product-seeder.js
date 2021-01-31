var Product = require('../models/product');

var mongoose = require('mongoose');
// const product = require('../models/product');
// const { exists } = require('../models/product');

// mongoose.connect('localhost:27017/shopping');
mongoose.connect("mongodb://localhost:27017/shopping",{useNewUrlParser: true, useUnifiedTopology: true});


var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game',
        description: 'Awesome Game!!',
        price: 10
    }),
    new Product({
        imagePath: 'https://previews.123rf.com/images/jemastock/jemastock1709/jemastock170912461/86038561-empty-glass-bottle-icon-vector-illustration-graphic-design.jpg',
        title: 'Milk Bottle',
        description: 'Plain Bottle',
        price: 3
    }),
    new Product({
        imagePath: 'https://images.pexels.com/photos/12211/pexels-photo-12211.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        title: 'Smiling Tedd',
        description: 'Stuffed Toy',
        price: 4
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Baso_pajita.webp',
        title: 'Juice',
        description: 'Yellow Coloured Juice with straw in glass!',
        price: 1
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Asmi-9mm_machine_pistol.jpg',
        title: '9mm Machine Gun',
        description: 'Asmi 9mm Machine Pistol Developed by DRDO!',
        price: 20
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/0/01/-53_Enlarger.jpg',
        title: 'Enlarger',
        description: 'This stuff enalge stuffs but virtually',
        price: 30
    })

];

var done = 0;
for (var i = 0; i < products.length; i++){
    products[i].save(function(err, result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}