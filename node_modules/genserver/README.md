# Generic Purposed JSON API Server


> Before reading details about `genserver`, you may want to give it a try first. You can read the [QuickStart](./docs/QuickStart.md).


`genserver` means *GENeric purposed SERVER framework*. It is a lightweight framework that helps you build JSON based API server. You can also look it as some kind of RPC framework build on top of HTTP.

In the following contents, some of the benefits that `genserver` brings you will be listed and explained.



## The Function Calling Abstraction

Calling a function is simple and straightforward. You pass some arguments to a function, then you get the result returned by the function.

With `genserver`, you can write server program as simple as writing a normal function.

The client send request in a certain format like *http://myserver.com/myfile?cmd=myfunction&arg1=1&arg2=2*, then function `myfunction` in `myfile.js` will get called. (Of course you need to make some configurations to tell genserver where to find the file)

It's just like calling `myfunction({ arg1: 1, arg2: 2 })`. And the result returned by `myfunction` will be returned to client. All you need to do is write the `myfunction`.

So when you want to write a web service, you can just write the core functions and test them. After that, start genserver, it becomes a webservice! You don't need to learn any web framework, you don't even need to know HTTP.



## Error Handling

I've seen many server programs handling errors in a clumsy way: when error occurs, they do some log, set response context, set response code, then call response functions... And when they want to return an error, they do it in the same way, log, set code, set context, ...

With `genserver`, you don't need to do anything when error occurs, it will be caught, formatted, and return to client in JSON format (You can write your own error handler to overwrite the default one). And when you want to response an error, you just need to throw it! Just like what you did in normal programs. `genserver` will do all the necessary things underground.

