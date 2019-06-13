/* Parse test/examples/*.ks, 
use test/examples/*-config.json if exist,
compare with test/example/*-expected.json if exist
TODO: WIP
*/

// Abuse Jest, let's generate some test case, we need this ability
for (let index = 0; index < 5; index++) {
    test(index + '', () => {
        expect(index).toBe(index);
    });
}
