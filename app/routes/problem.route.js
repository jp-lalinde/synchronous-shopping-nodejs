var constants = require('../shared/constants.js');

module.exports = function(app) {
    const solution = require('../controller/problem.controller.js');
 
    // Solve the problem 
    app.post('/api/'+constants.API_VERSION+'/synchronous_shopping', solution.solve);
 
}