const delay = (ms, returnValue) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(returnValue);
        }, ms);
    });
}

const values = [1, 2, 3];
const resultPromise = values.map(async (value) => {
    const result = await delay(1000, value);
    return result;
});

resultPromise.forEach((result) => {
    console.log(result);
});

console.log("end");
