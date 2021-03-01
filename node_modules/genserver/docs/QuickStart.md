## Preparations

Before using genserver, you need to install it first. The installation process
is simple, only 2 parts:
1. Install Node.js (version 7 at least, for async/await support).
2. Install genserver as global package: `npm i -g genserver`

Now you can use it. In the following example, all commands are supposed to be executed in a Linux/MacOS terminal.


## Example

1. Swith to an empty directory, create a directory named "actions". You can simply run the following commands:

```sh
mkdir /tmp/testgenserver
cd /tmp/testgenserver
mkdir actions
```

2. Create a Javascript file(in this example, it's blah.js) in directory "actions". Then let's write a simple function "blah" and exports it.

```sh
cat > actions/blah.js << EOF
function blah(args) {
  return Object.assign(args, { "info": "Wow, this is so simple!" });
}

module.exports = {
  blah,
}

EOF
```

3. Start the server

```sh
genserver
```

4. Open the link in browser: http://localhost:8000/blah?cmd=blah&a=b


You can change the query argument to see the result.


The function you write can be `async` function, you can see `test/a/actions/playasync.js` for more details.



## Configurations

### TCP Port

If you don't want the default configuration, for example, you want to change the tcp port to be listened, you can create your own configuration file to overwrite the default configuration. The file name has to be `genserver.json`.

Let's just use the example above, you need to create a `genserver.json` in the project directory, in this example, it's "/tmp/testgenserver".

You can use the following script to create a configuration file:

```sh
cat > genserver.json << EOF
{
  "port": 9000
}
EOF
```

Then restart the server, it will listen port 9000 instead of 8000 now. Check it out: http://localhost:9000/blah?cmd=blah&a=b


### Action Path

By default, the action path is "actions", you can change it by editing `genserver.json` to this:

```json
{
  "port": 9000,
  "actionPath": "./myactions"
}
```


### Other Configurations

There are some configurations not mention above, for example, you can configure genserver to use external logger(e.g. log4js). There are some examples in the `test` directory in genserver package.


Have fun !

