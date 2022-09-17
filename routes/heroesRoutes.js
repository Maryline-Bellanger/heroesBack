const { 
  findMany, 
  findOneById,
  createOne,
  updateOne,
  deleteOne,
  totalCount,
} = require('../models/heroesModels');
const heroesRouter = require('express').Router();
const Joi = require('joi');

const heroeSchema = (creation = false) => {
  const isRequired = creation ? 'required' : 'optional';
  return Joi.object({
    name: Joi.string().presence(isRequired),
    image: Joi.string().presence(isRequired),
    speed: Joi.string().presence(isRequired),
    power: Joi.string().presence(isRequired),
    stamina: Joi.string().presence(isRequired),
    gender: Joi.string().presence(isRequired),
    race: Joi.string().presence(isRequired),
    height: Joi.string().presence(isRequired),
    weight: Joi.string().presence(isRequired),
  });
};

  heroesRouter.get('/', async (req, res) => {
    const [total] = await totalCount();
    const count = total[0].total;
    const [heroes] = await findMany(req.query);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.set('X-Total-Count', count);
    res.json(heroes);
  });

  heroesRouter.get('/:id', async (req, res) => {
    const [[heroes]] = await findOneById(req.params.id);
    if (!heroes) res.status(404).json();
    res.json(heroes);
  });

  heroesRouter.post('/', async (req, res) => {
    const { value, error } = heroeSchema(true).validate(req.body);

    if (value.status === false) {
      value.status = 0;
    } value.status = 1;

    if (error) {
      return res.status(400).json(error);
    }

    const [{ insertId: id }] = await createOne(req.body);
    return res.status(201).json({...value, id,});
  });

  heroesRouter.put('/:id', async (req, res) => {
    const heroeId = req.params.id;
  
    const [[existingHeroe]] = await findOneById(heroeId);
  
    if (!existingHeroe) {
      return res.status(403).json({
        message: 'bad heroe use',
      });
    }
    await updateOne(req.body, heroeId);
  
    return res.status(204).json();
  });

  heroesRouter.delete('/:id', async (req,res)=> {
    const heroeId = req.params.id;
    const [[existingHeroe]] = await findOneById(heroeId);
  
    if (!existingHeroe) {
      return res.status(403).json({
        message: 'bad heroe use',
      });
    }
    await deleteOne(heroeId);
    return res.status(204).json();
  });

  module.exports = heroesRouter;