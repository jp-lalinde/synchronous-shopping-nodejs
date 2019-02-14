var constants = require('../shared/constants.js');

module.exports = function(app) {
    const users = require('../controller/user.controller.js');
 
    // Create a new User
    app.post('/api/'+constants.API_VERSION+'/users', users.create);
 
    // Retrieve all Users
    app.get('/api/'+constants.API_VERSION+'/users', users.findAll);
 
    // Retrieve a single User by Id
    app.get('/api/'+constants.API_VERSION+'/users/:id', users.findById);
 
    // Update a User with Id
    app.put('/api/'+constants.API_VERSION+'/users', users.update);
 
    // Delete a User with Id
    app.delete('/api/'+constants.API_VERSION+'/users/:id', users.delete);
}