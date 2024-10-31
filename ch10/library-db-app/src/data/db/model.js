import { DataTypes } from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import { sequelize } from './connection.js';

export const Author = sequelize.define(
  'Author',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
);

export const Book = sequelize.define(
  'Book',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    }, 
  },
);

SequelizeSlugify.slugifyModel(Author, {
  source: ['name']
});

SequelizeSlugify.slugifyModel(Book, {
  source: ['title'],
  suffixSource: ['year'],

});

Author.belongsToMany(Book, { through: 'AuthorBooks' });
Book.belongsToMany(Author, { through: 'AuthorBooks' });

await sequelize.sync();
