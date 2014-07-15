/* jshint -W030 */
var proxyquire = require('proxyquire'),
	modelsStub = {},
	prices = proxyquire('../../controllers/prices', {
		'../app/models' : modelsStub
	});

var res = {},
	req = {};

describe('Prices Controller', function() {
	beforeEach(function() {
		res = {
			json: sinon.spy()
		};
		req = {
			params: {
				id : 1
			}
		};
		modelsStub.Price = {
			find: function(query, callback) {
				callback(null, {});
			},
			save: function(err, callback) {
				callback(null, req.body);
			}
		};
	});

	it('should exist', function() {
		expect(prices).to.exist;
	});

	describe('index', function() {
		it('should be defined', function() {
			expect(prices.index).to.be.a('function');
		});

		it('should send json', function() {
			prices.index(req, res);
			expect(res.json).calledOnce;
		});
	});

	describe('getById', function() {
		it('should be defined', function() {
			expect(prices.getById).to.be.a('function');
		});

		it('should send json on successful retrieve', function() {
			prices.getById(req, res);
			expect(res.json).calledOnce;
		});

		it('should send json error on error', function() {
			modelsStub.Price = {
				find: function(query, callback) {
					callback(null, {error: 'Price not found.'});
				}
			};
			prices.getById(req, res);
			expect(res.json).calledWith({error: 'Price not found.'});
		});
	});

});
