import { DataTypes } from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import { connection } from './connection.js';

export const Author = connection.define(
  'Author',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
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

export const Book = connection.define(
  'Book',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: true,
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

await connection.sync();
