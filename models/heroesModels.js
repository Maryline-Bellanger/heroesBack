const connection = require('../db-config');
const db = connection.promise();

const findMany = ({filter, sort, range}) => {
  let query ='SELECT * FROM heroesDetail';
  const params = [];

  if (filter && 'name' in JSON.parse(filter) && 'gender' in JSON.parse(filter)){
    query += ` WHERE name LIKE '${JSON.parse(filter).name}%' AND gender LIKE '${JSON.parse(filter).gender}%'`;
    params.push(filter, params);
  } else if (filter && 'name' in JSON.parse(filter) && JSON.parse(filter) !== 'gender'){
    query += ` WHERE name LIKE '${JSON.parse(filter).name}%'`;
    params.push(filter, params);
  } else if (filter && 'gender' in JSON.parse(filter) && JSON.parse(filter) !== 'name'){
    query += ` WHERE gender LIKE '${JSON.parse(filter).gender}%'`;
    params.push(filter, params);
  }

  if (sort) {
    query += ` ORDER BY ${JSON.parse(sort).toString().replace(',', ' ')}`;
  }

  if (range) {
    const newRange = range.replace('[', '').replace(']', '');
    const newRangeArray = newRange.split(',');
    const limit = (newRangeArray[1] - newRangeArray[0]) + 1;
    const offset = newRangeArray[0];
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  return db.query(query, params);
};
const findOneById = (id) => db.query(`SELECT * FROM heroesDetail WHERE id = ?`, [id]);

const createOne = ({
  name, image, speed, power, stamina, gender, race, height, weight,
}) => db.query(`INSERT INTO heroesDetail (name, image, speed, power, stamina, gender, race, height, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [name, image, speed, power, stamina, gender, race, height, weight]);

const updateOne = ({
  name, image, speed, power, stamina, gender, race, height, weight, id,
}) => db.query("UPDATE heroesDetail SET name = ?, image = ?, speed = ?, power = ?, stamina = ?, gender = ?, race = ?, height = ?, weight=? WHERE id = ?", [name, image, speed, power, stamina, gender, race, height, weight, id]);

const deleteOne = (id) => db.query(`DELETE FROM heroesDetail WHERE id = ?`, [id]);

const totalCount = () => db.query(`SELECT COUNT(*) as total FROM heroesDetail`);

module.exports = {
  findMany,
  findOneById,
  createOne,
  updateOne,
  deleteOne,
  totalCount,
};