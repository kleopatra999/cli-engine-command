// @flow

/* globals
  test
  beforeEach
  expect
  afterEach
  */

import Base from './command'
import nock from 'nock'
import pjson from '../package.json'

class Command extends Base {}

let api
beforeEach(() => {
  api = nock('https://api.heroku.com')
})
afterEach(() => {
  api.done()
})

test('makes an HTTP request', async () => {
  api.get('/')
  .matchHeader('user-agent', `cli-engine-command/${pjson.version} node-${process.version}`)
  .reply(200, {message: 'ok'})

  const cmd = new Command({mock: true, debug: 2})
  let response = await cmd.http.get('https://api.heroku.com')
  expect(response).toEqual({message: 'ok'})
  expect(cmd.stderr.output).toContain('--> GET https://api.heroku.com')
  expect(cmd.stderr.output).toContain('<-- GET https://api.heroku.com')
  expect(cmd.stderr.output).toContain('{ message: \'ok\' }')
})
