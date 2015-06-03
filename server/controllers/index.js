var indexController = {
	index: function(req, res) {
        console.log('hi');
		res.sendfile('./client/public/index.html');
	}
};

module.exports = indexController;