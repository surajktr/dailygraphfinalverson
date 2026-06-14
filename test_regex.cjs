const word = 'test'; const escapedWord = word.replace(/[.*+?^$()|[\]\\]/g, '\\$&'); const regex = new RegExp(\\\\b()\\\\b, 'gi'); console.log(regex.test('this is a test.'));
