const axios = require('axios');

axios.default({
    method: "POST",
    url: "https://withme.heavyrisem.xyz/auth",
    data: {
        action: {
            parameters: {
                number: {
                    value: "968|757"
                }
            }
        },
        profile: {privatePlay:{deviceUniqueId: "IosTestID"}}
    }
}).then(value => {
    console.log(value.data);
})