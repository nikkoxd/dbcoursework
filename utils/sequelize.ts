import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL as string;

export const sequelize = new Sequelize(databaseUrl);
