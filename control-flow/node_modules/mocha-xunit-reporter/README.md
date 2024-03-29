# mocha-xunit-reporter
A Mocha xunit reporter. Produces XUnit-style XML test results.
Adapted from and Inspired by [mocha-junit-reporter](https://github.com/michaelleeallen/mocha-junit-reporter)

## Installation
```
$ npm install mocha-xunit-reporter --save-dev
```
or as a global module
```
$ npm install -g mocha-xunit-reporter
```

## Usage
Run mocha with `mocha-xunit-reporter`:
```
$ mocha test --reporter mocha-xunit-reporter
```
This will output a results file at `./test-results.xml`.

You may optionally declare an alternate location for rexults XML file by setting the environment variable `MOCHA_FILE` or specifying `mochaFile` in `reporterOptions`:
```
$ MOCHA_FILE=./path_to_your/file.xml mocha test --reporter mocha-xunit-reporter
```
or
```
$ mocha test --reporter mocha-xunit-reporter --reporter-options mochaFile=./path_to_your/file.xml
```
or
```
var mocha = new Mocha({
    reporter: 'mocha-xunit-reporter',
    reporterOptions: {
        mochaFile: './path_to_your/file.xml'
    }
});
```

### `addTags` option
- If set to true, will parse the test title for tags in format `@tagName=tagValue` and will add them as attribute of the test XML element. It will also clean the outputted tags from the test name XML attribute.
- See example below:
```
var mocha = new Mocha({
    reporter: 'mocha-xunit-reporter',
    reporterOptions: {
        mochaFile: './path_to_your/file.xml',
        addTags: true
    }
});
```
Given a test with title 'test should behave like so @aid=EPM-DP-C1234 @sid=EPM-1234 @type=Integration', the outputted test element will look as follows:
```
<test name="test should behave like so" aid="EPM-DP-C1234" sid="EPM-1234" type="Integration" />
```

## XUnit XML format
The generated test results file conforms to [XUnit's XML format](https://xunit.net/docs/format-xml-v2).

### `failure` element
In case of an error or failure during a test run, a `failure` element will be included as a child element with its corresponding `test` element. This element will contain information about the failed test.

```
<failure exception-type="Error">
  <message><![CDATA[This test threw an error]]></message>
  <stack-trace><![CDATA[Error: testing123
at Context.<anonymous> (example.spec.ts-1:1:1)]]></stack-trace>
</failure>
```

### Full configuration options

| Parameter | Effect |
| --------- | ------ |
| mochaFile | configures the file to write reports to |
| includePending | if set to a truthy value pending tests will be included in the report |
| toConsole | if set to a truthy value the produced XML will be logged to the console |
| assemblyName | the name for the assembly element. (defaults to 'Mocha Tests') |
| addTags | if set to a truthy value will parse the test title for tags |
