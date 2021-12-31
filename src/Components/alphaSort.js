export const alphaSort = (array, sortParam, sortDir) => {
    const compare = (a, b) => {
        let paramA
        let paramB
        if (sortParam === 'date') {
            paramA = Date.parse(a.fields[sortParam])
            paramB = Date.parse(b.fields[sortParam])

        } else {

            paramA = a.fields[sortParam]
            paramB = b.fields[sortParam]
        }
        if (sortDir) {

            if (paramA < paramB) {
                return -1;
            }
            if (paramA > paramB) {
                return 1;
            }
        } else if (Object.keys(array[0].fields).includes('vendor')) {

            if (paramA > paramB) {
                return -1;
            }
            if (paramA < paramB) {
                return 1;
            }

        }
        return 0;

    }
    array.sort(compare)
    return array

}