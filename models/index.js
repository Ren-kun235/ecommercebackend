// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {

  through: {
    model: Product,
    unique: false,
  },

  as: 'products'
});

// Categories have many Products
Category.hasMany(Product, {

  through:{
    model: Product,
    unique: false,
  },

});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(ProductTag, {

  through: {
    model: ProductTag,
    unique: false,
  },

  as: 'product tags'
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {

  through: {
    model: ProductTag,
    unique: false,
  },

  as: 'tags for product'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
