module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('problem', {
	  parameters: {
		type: Sequelize.STRING
	  },
	  shopping_centers: {
		type: Sequelize.STRING
      },
      roads: {
		type: Sequelize.STRING
	  },
	});
	
	return User;
}