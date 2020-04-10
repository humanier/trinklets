const generate = require('../combinations-generator.js');

describe('combinations generator', () => {
    test('returns empty array when input empty array', () => {
        // ACT
        const output = generate([]);

        // ASSERT
        expect(output).toStrictEqual([]);
    });

    test('returns single item array when input has only one item', () => {
        // ACT
        const output = generate([3]);

        // ASSERT
        expect(output).toStrictEqual([[3]]);
    });

    test('returns combinations when input is multiple items array', () => {
        // ARRANGE
        const input = [1, 'a', 'v', 5, 'z'];

        const expected = [
            [1],
            ['a'],
            ['v'],
            [5],
            ['z'],

            [1, 'a'],
            [1, 'v'],
            [1, 5],
            [1, 'z'],

            ['a', 'v'],
            ['a', 5],
            ['a', 'z'],

            ['v', 5],
            ['v', 'z'],

            [5, 'z'],

            [1, 'a', 'v'],
            [1, 'a', 5],
            [1, 'a', 'z'],

            [1, 'v', 5],
            [1, 'v', 'z'],

            [1, 5, 'z'],

            ['a', 'v', 5],
            ['a', 'v', 'z'],
            ['a', 5, 'z'],

            ['v', 5, 'z'],

            [1, 'a', 'v', 5],
            [1, 'a', 'v', 'z'],

            [1, 'a', 5, 'z'],

            [1, 'v', 5, 'z'],

            ['a', 'v', 5, 'z'],

            [1, 'a', 'v', 5, 'z']
        ];

        // ACT
        const output = generate(input);

        // ASSERT
        expect(output).toStrictEqual(expected);
    });
})