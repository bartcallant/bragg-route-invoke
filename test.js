import test from 'ava';
import sinon from 'sinon';
import 'sinon-as-promised';					// eslint-disable-line import/no-unassigned-import
import lambda from 'aws-lambda-invoke';
import m from '.';

test.before(() => {
	const stub = sinon.stub(lambda, 'invoke');
	const invokeAsync = sinon.stub(lambda, 'invokeAsync');

	// Bragg 2
	stub.withArgs('foo', {httpMethod: 'post', 'http-method': 'post', path: '/bragg2/bar', 'resource-path': '/bragg2/bar', body: {foo: 'bar'}, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).rejects('400 - Bad Request');
	stub.withArgs('foo', {httpMethod: 'post', 'http-method': 'post', path: '/bragg2/baz', 'resource-path': '/bragg2/baz', body: {foo: 'baz'}, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).rejects('Something went wrong');
	stub.withArgs('foo', {httpMethod: 'post', 'http-method': 'post', path: '/bragg2/foo', 'resource-path': '/bragg2/foo', body: sinon.match.any, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({
		headers: {
			'Content-Type': 'application/json'
		},
		statusCode: 200,
		body: '{"foo":"bar"}'
	});
	stub.withArgs('foo', {httpMethod: 'get', 'http-method': 'get', path: '/bragg2/foo', 'resource-path': '/bragg2/foo', queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({
		headers: {
			'Content-Type': 'application/json'
		},
		statusCode: 200,
		body: '{"foo":"bar"}'
	});
	stub.withArgs('foo', {httpMethod: 'get', 'http-method': 'get', path: '/bragg2/foostring', 'resource-path': '/bragg2/foostring', queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({
		headers: {},
		statusCode: 200,
		body: '{"foo":"bar"}'
	});
	invokeAsync.withArgs('hello', {httpMethod: 'post', 'http-method': 'post', path: '/bragg2/world', 'resource-path': '/bragg2/world', body: {foo: 'bar'}, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({
		headers: {
			'Content-Type': 'application/json'
		},
		statusCode: 200,
		body: '{"foo":"baz"}'
	});

	// Bragg 1
	stub.withArgs('foo', {httpMethod: 'post', 'http-method': 'post', path: '/bragg1/bar', 'resource-path': '/bragg1/bar', body: {foo: 'bar'}, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).rejects('400 - Bad Request');
	stub.withArgs('foo', {httpMethod: 'post', 'http-method': 'post', path: '/bragg1/baz', 'resource-path': '/bragg1/baz', body: {foo: 'baz'}, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).rejects('Something went wrong');
	stub.withArgs('foo', {httpMethod: 'get', 'http-method': 'get', path: '/bragg1/foo', 'resource-path': '/bragg1/foo', queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({
		foo: 'bar'
	});
	stub.withArgs('foo', {httpMethod: 'get', 'http-method': 'get', path: '/bragg1/foostring', 'resource-path': '/bragg1/foostring', queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({
		foo: 'bar'
	});
	invokeAsync.withArgs('hello', {httpMethod: 'post', 'http-method': 'post', path: '/bragg1/world', 'resource-path': '/bragg1/world', body: {foo: 'bar'}, queryStringParameters: sinon.match.any, requestContext: sinon.match.any}).resolves({foo: 'baz'});
});

test('methods', t => {
	t.truthy(m.get);
	t.falsy(m.getAsync);
	t.truthy(m.put);
	t.truthy(m.putAsync);
	t.truthy(m.patch);
	t.truthy(m.patchAsync);
	t.truthy(m.post);
	t.truthy(m.postAsync);
	t.truthy(m.delete);
	t.truthy(m.deleteAsync);
});

test('[Bragg 2] error', async t => {
	await t.throws(m.get(), 'Expected a function name');
	await t.throws(m.get('foo'), 'Expected a resource path');
});

test('[Bragg 2] result', async t => {
	t.deepEqual(await m.get('foo', '/bragg2/foo'), {
		headers: {
			'Content-Type': 'application/json'
		},
		statusCode: 200,
		body: {
			foo: 'bar'
		}
	});
});

test('[Bragg 1] result', async t => {
	t.deepEqual(await m.get('foo', '/bragg1/foo'), {
		foo: 'bar'
	});
});

test('[Bragg 2] result without content type', async t => {
	t.deepEqual(await m.get('foo', '/bragg2/foostring'), {
		headers: {},
		statusCode: 200,
		body: '{"foo":"bar"}'
	});
});

test.serial('[Bragg 2] invoke no params', async t => {
	await m.get('foo', '/bragg2/foo');

	t.is(lambda.invoke.lastCall.args[0], 'foo');
	t.deepEqual(lambda.invoke.lastCall.args[1], {
		path: '/bragg2/foo',
		'resource-path': '/bragg2/foo',
		httpMethod: 'get',
		'http-method': 'get',
		queryStringParameters: undefined,
		requestContext: {
			identity: undefined
		}
	});
});

test.serial('[Bragg 1] invoke no params', async t => {
	await m.get('foo', '/bragg1/foo');

	t.is(lambda.invoke.lastCall.args[0], 'foo');
	t.deepEqual(lambda.invoke.lastCall.args[1], {
		path: '/bragg1/foo',
		'resource-path': '/bragg1/foo',
		httpMethod: 'get',
		'http-method': 'get',
		queryStringParameters: undefined,
		requestContext: {
			identity: undefined
		}
	});
});

test.serial('[Bragg 2] invoke with params', async t => {
	await m.post('foo', '/bragg2/foo', {body: {foo: 'bar'}});

	t.is(lambda.invoke.lastCall.args[0], 'foo');
	t.deepEqual(lambda.invoke.lastCall.args[1], {
		path: '/bragg2/foo',
		'resource-path': '/bragg2/foo',
		httpMethod: 'post',
		'http-method': 'post',
		queryStringParameters: undefined,
		body: {
			foo: 'bar'
		},
		requestContext: {
			identity: undefined
		}
	});
});

test.serial('[Bragg 1] invoke with params', async t => {
	await m.post('foo', '/bragg2/foo', {body: {foo: 'bar'}});

	t.is(lambda.invoke.lastCall.args[0], 'foo');
	t.deepEqual(lambda.invoke.lastCall.args[1], {
		path: '/bragg2/foo',
		'resource-path': '/bragg2/foo',
		httpMethod: 'post',
		'http-method': 'post',
		queryStringParameters: undefined,
		body: {
			foo: 'bar'
		},
		requestContext: {
			identity: undefined
		}
	});
});

test.serial('[Bragg 2] invoke async', async t => {
	await m.postAsync('hello', '/bragg2/world', {body: {foo: 'bar'}});

	t.is(lambda.invokeAsync.lastCall.args[0], 'hello');
	t.deepEqual(lambda.invokeAsync.lastCall.args[1], {
		path: '/bragg2/world',
		'resource-path': '/bragg2/world',
		httpMethod: 'post',
		'http-method': 'post',
		queryStringParameters: undefined,
		body: {
			foo: 'bar'
		},
		requestContext: {
			identity: undefined
		}
	});
});

test.serial('[Bragg 1] invoke async', async t => {
	await m.postAsync('hello', '/bragg1/world', {body: {foo: 'bar'}});

	t.is(lambda.invokeAsync.lastCall.args[0], 'hello');
	t.deepEqual(lambda.invokeAsync.lastCall.args[1], {
		path: '/bragg1/world',
		'resource-path': '/bragg1/world',
		httpMethod: 'post',
		'http-method': 'post',
		queryStringParameters: undefined,
		body: {
			foo: 'bar'
		},
		requestContext: {
			identity: undefined
		}
	});
});

test('[Bragg 2] remote error', async t => {
	try {
		await m.post('foo', '/bragg2/bar', {body: {foo: 'bar'}});
		t.fail('Expected to throw an error');
	} catch (error) {
		t.is(error.message, 'Bad Request');
		t.is(error.status, 400);
		t.is(error.httpMethod, 'POST');
		t.is(error.function, 'foo');
		t.is(error.path, '/bragg2/bar');
	}
});

test('[Bragg 1] remote error', async t => {
	try {
		await m.post('foo', '/bragg1/bar', {body: {foo: 'bar'}});
		t.fail('Expected to throw an error');
	} catch (error) {
		t.is(error.message, 'Bad Request');
		t.is(error.status, 400);
		t.is(error.httpMethod, 'POST');
		t.is(error.function, 'foo');
		t.is(error.path, '/bragg1/bar');
	}
});

test('[Bragg 2] remote error without status code', async t => {
	try {
		await m.post('foo', '/bragg2/baz', {body: {foo: 'baz'}});
		t.fail('Expected to throw an error');
	} catch (error) {
		t.is(error.message, 'Something went wrong');
		t.is(error.httpMethod, 'POST');
		t.is(error.function, 'foo');
		t.is(error.path, '/bragg2/baz');
	}
});

test('[Bragg 1] remote error without status code', async t => {
	try {
		await m.post('foo', '/bragg1/baz', {body: {foo: 'baz'}});
		t.fail('Expected to throw an error');
	} catch (error) {
		t.is(error.message, 'Something went wrong');
		t.is(error.httpMethod, 'POST');
		t.is(error.function, 'foo');
		t.is(error.path, '/bragg1/baz');
	}
});
