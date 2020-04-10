function* getIndicesSet(setSize, collectionSize) {
    const indices = Array(setSize).fill(0).map((x, i) => i);

    if (setSize === collectionSize) {
        return indices;
    }

    let currItemIdx = setSize - 1;
    let edge = collectionSize - setSize + currItemIdx;

    while (true) {

        yield [...indices];

        // advance position of current item 
        ++indices[currItemIdx];

        // switch to another item if we reached the edge for current one
        if (indices[currItemIdx] > edge) {
            // shift current item index back to the edge
            --indices[currItemIdx];

            // pick item before current one to start moving it
            --currItemIdx;

            if (currItemIdx < 0) {
                break;
            }

            // move new current item one step ahead to avoid generating a duplicate 
            // of a combination generated previously
            ++indices[currItemIdx];

            // if there is a gap between position of current item and position of the next item,
            // then shift all items starting from (current+1) to eliminate the gap - otherwise we gonna
            // miss some combinations
            const gapSize = indices[currItemIdx + 1] - indices[currItemIdx] - 1;

            if (gapSize > 0) {
                for (let i = currItemIdx + 1; i < indices.length; i++) {
                    indices[i] = indices[i] - gapSize;
                }

                // redefine current item - we need to start moving the last one again
                currItemIdx = setSize - 1;
            }

            // calculate edge for the current index
            edge = collectionSize - setSize + currItemIdx;
        }
    }
}

function generate(input) {
    if (!Array.isArray(input)) {
        // TODO: throw error 
        return [];
    }

    if (Array.isArray(input) && input.length === 0) {
        return [];
    }

    // we generate all combinations of K elements out of N
    // where N is length of the input array and K=1..N
    const n = input.length;
    const result = [];
    for (let k = 1; k <= n; k++) {
        const combinationsIterator = getIndicesSet(k, n);
        let combination = { done: false };

        while (!combination.done) {
            combination = combinationsIterator.next();

            if (Array.isArray(combination.value) && combination.value.length > 0) {
                const subSet = Array(k);

                combination.value.forEach((
                    inputIdx, subSetIdx) => subSet[subSetIdx] = input[inputIdx]);

                result.push(subSet);
            }
        }
    }

    return result;
}

module.exports = generate;