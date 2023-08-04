const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  };

});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findByPk(req.params.id, {
      
      include: [{ model: Product }],
    });
    
    if (!category) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
  .then((category) => {
    if (req.body.categoryIds.length) {
      
      const categoryIdArr = req.body.categoryIds.map((category_id) => {
        
        return {
          category_id: category.id,
        };
        
      });

      return category.bulkCreate(categoryIdArr);

    }

    res.status(200).json(category);

  })

  .then((categoryIds) => res.status(200).json(categoryIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });

});

router.put('/:id', (req, res) => {

  Category.update(req.body, {

    where: {
      id: req.params.id,
    },

  })

    .then((category) => {

      return category.findAll({ where: { category_id: req.params.id } });

    })

    .then((category) => {

      const categoryIds = category.map(({ tag_id }) => tag_id); //MIGHT CHANGE

      const newCategory = req.body.categoryIds

        .filter((category_id) => !categoryIds.includes(category_id))
        .map((category_id) => {

          return {
            category_id: req.params.id,
          };

        });

      const categoryToRemove = category
        .filter(({ category_id }) => !req.body.categoryIds.includes(category_id))
        .map(({ id }) => id);

      return Promise.all([

        category.destroy({ where: { id: categoryToRemove } }),
        category.bulkCreate(newCategory),

      ]);

    })

    .then((updatedCategory) => res.json(updatedCategory))
    .catch((err) => {
      res.status(400).json(err);
    });

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!category) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
