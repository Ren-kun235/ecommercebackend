const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      
      include: [{ model: Product }],
    });
    
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then((tag) => {
    if (req.body.tagIds.length) {
      
      const tagIdArr = req.body.tagIds.map((tag_id) => {
        
        return {
          tag_id: tag.id,
        };
        
      });

      return tag.bulkCreate(tagIdArr);

    }

    res.status(200).json(tag);

  })

  .then((tagIds) => res.status(200).json(tagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {

    where: {
      id: req.params.id,
    },

  })

    .then((tag) => {

      return tag.findAll({ where: { tag_id: req.params.id } });

    })

    .then((tag) => {

      const tagIds = tag.map(({ tag_id }) => tag_id);

      const newTag = req.body.tagIds

        .filter((tag_id) => !tagIds.includes(tag_id))
        .map((tag_id) => {

          return {
            tag_id: req.params.id,
          };

        });

      const tagToRemove = tag
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([

        tag.destroy({ where: { id: tagToRemove } }),
        tag.bulkCreate(newTag),Tag

      ]);

    })

    .then((updatedTag) => res.json(updatedTag))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
