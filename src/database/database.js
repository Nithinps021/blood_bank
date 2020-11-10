const Sequelize = require("sequelize");

const seq = new Sequelize(process.env.URI,
  {
    dialect: "postgres",
    port:'5432',
    dialectOptions: {
      ssl:{
          require:true,
          rejectUnauthorized:false
      }
    },
  }
);
module.exports = seq;
