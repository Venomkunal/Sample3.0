const TestSprite = require('testsprite');

TestSprite.describe('Application Functionality', () => {
    TestSprite.it('should return the correct value', () => {
        TestSprite.expect(1 + 1).toEqual(2);
    });

    TestSprite.it('should handle errors correctly', () => {
        TestSprite.expect(() => { throw new Error('Test Error'); }).toThrow('Test Error');
    });
});