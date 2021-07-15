function authorizeClientSecret(token) {
    //const expiryInterval = 3600000 // one hour expressed in miliseconds
    const expiryInterval = 60000 // one minute expressed in miliseconds
    const expiry = new Date(Date.now() + expiryInterval);
    let json
	
  var encodedCreds = token.split(' ')[1]
  var plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':')
  var username = plainCreds[0]
  var password = plainCreds[1]
    if (username=='admin' && password=='admin') {
        json = {
            "active": true,
            "principal": "Henk",
            "scope": ["list:hello", "read:hello", "create:hello", "update:hello", "delete:hello", "someScope"],
            "clientId": "clientIdFromHeader",
            "expiresAt": expiry.toISOString(),
            "context": {
                "key": "value", "email": "me@mail.com", "input": token
            }
        }
    }
    else
        // simulate authorization error
        json =
            {
                "active": false,
                "expiresAt": expiry.toISOString(),
                "context": {
                    "email": "jain.doe@example.com"
                },
                "wwwAuthenticate": "Bearer realm=\"lucas.jellema.com\""
            }
    return json
}

module.exports = {
    authorizeClientSecret: authorizeClientSecret
}

// invoke on the command line with :
// node authorizer '{"type":"TOKEN","token":"secret2"}'
run = async function () {
    if (process.argv && process.argv[2]) {
        const input = JSON.parse(process.argv[2])
        let response = authorizeClientSecret(input.type=='TOKEN'?input.token:input.header)
        console.log("response: " + JSON.stringify(response))
    }
}

run()
