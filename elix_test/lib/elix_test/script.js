require('!!file-loader?name=[name].[ext]!./web/orders.html');
var Qs = require('qs');
var Cookie = require('cookie');
require('../priv/static/styles.css');
var ReactDOM = require('react-dom');
var React = require("react");
var createReactClass = require('create-react-class');
var XMLHttpRequest = require("xhr2");
var When = require('when');

var orders = [
  {remoteid: "000000189", custom: {customer: {full_name: "TOTO & CIE"}, billing_address: "Some where in the world"}, items: 2}, 
  {remoteid: "000000190", custom: {customer: {full_name: "Looney Toons"}, billing_address: "The Warner Bros Company"}, items: 3}, 
  {remoteid: "000000191", custom: {customer: {full_name: "Asterix & Obelix"}, billing_address: "Armorique"}, items: 29}, 
  {remoteid: "000000192", custom: {customer: {full_name: "Lucky Luke"}, billing_address: "A Cowboy doesn't have an address. Sorry"}, items: 0}, 
]

var i = 0

var remoteProps = {
  /*user: (props) => {
    return {
      url: "/api/me",
      prop: "user"
    }
  },*/
  orders: (props) => {
    if (!props.user)
      return
    var qs = {...props.qs, user_id: props.user.value.id}
    var query = Qs.stringify(qs)
    return {
      url: "/api/orders" + (query == '' ? '' : '?' + query),
      prop: "orders"
    }
  },
  order: (props) => {
    return {
      url: "/api/order/" + props.order_id,
      prop: "order"
    }
  }
}

var Layout = createReactClass({
  render(){
    return <JSXZ in="orders" sel=".layout">
      <Z sel=".layout-container">
        <this.props.Child {...this.props}/>
      </Z>
    </JSXZ>
    }
  })

var Header = createReactClass({
  render(){
    return <JSXZ in="orders" sel=".header">
      <Z sel=".header-container">
        <this.props.Child {...this.props}/>
      </Z>
    </JSXZ>
    }
  })

  var GoTo = (route, params, query) => {
    var qs = Qs.stringify(query)
    var url = routes[route].path(params) + ((qs=='') ? '' : ('?'+qs))
    history.pushState({}, "", url)
    onPathChange()
  }

var Orders = createReactClass({
  statics: {
    remoteProps: [remoteProps.orders]
  },
  render(){
    console.log(this.props);
    function handleClick(id, e) {
      e.preventDefault();
      GoTo("order", id, "");
    }
    return <JSXZ in="orders" sel=".orders-container">
      <Z sel=".orders-column">
			{
				orders.map( order => (<JSXZ in="orders" key={i++} sel=".orders-line">
					<Z sel=".command">{order.remoteid}</Z>
          <Z sel=".customer">{order.custom.customer.full_name}</Z>
          <Z sel=".address">{order.custom.billing_address}</Z>
          <Z sel=".quantity">{order.items}</Z>
          <Z sel=".details" onClick={(e) => handleClick(order.remoteid, e)}>View</Z>
					</JSXZ>))
			}
      </Z>
			</JSXZ>
    }
  })

var Order = createReactClass({
  render(){
    function goHome() {
      GoTo("orders", "", "");
    }
    var order = orders.find(v => v.remoteid === window.location.pathname.slice(7));
    return <JSXZ in="order" sel=".layout">
      <Z sel=".detail_client">{order.custom.customer.full_name}</Z>
      <Z sel=".detail_address">{order.custom.billing_address}</Z>
      <Z sel=".detail_command">{order.remoteid}</Z>
      <Z sel=".goback" onClick={goHome}>Go Back</Z>
      </JSXZ>
    }
  })

  var HTTP = new (function(){
    this.get = (url) => this.req('GET', url)
    this.delete = (url) => this.req('DELETE', url)
    this.post = (url, data) => this.req('POST', url, data)
    this.put = (url, data) => this.req('PUT', url, data)
  
    this.req = (method, url, data) => new Promise((resolve, reject) => {
      var req = new XMLHttpRequest()
      req.open(method, url)
      req.responseType = "text"
      req.setRequestHeader("accept","application/json,*/*;0.8")
      req.setRequestHeader("content-type","application/json")
      req.onload = ()=>{
        if(req.status >= 200 && req.status < 300){
        resolve(req.responseText && JSON.parse(req.responseText))
        }else{
        reject({http_code: req.status})
        }
      }
    req.onerror = (err) => {
      reject({http_code: req.status})
    }
    req.send(data && JSON.stringify(data))
    })
  })()


  function addRemoteProps(props){
    return new Promise((resolve, reject)=>{
      //Here we could call `[].concat.apply` instead of `Array.prototype.concat.apply`
    //apply first parameter define the `this` of the concat function called
    //Ex [0,1,2].concat([3,4],[5,6])-> [0,1,2,3,4,5,6]
    // <=> Array.prototype.concat.apply([0,1,2],[[3,4],[5,6]])
    //Also `var list = [1,2,3]` <=> `var list = new Array(1,2,3)`
    var remoteProps = Array.prototype.concat.apply([],
      props.handlerPath
        .map((c)=> c.remoteProps) // -> [[remoteProps.user], [remoteProps.orders], null]
        .filter((p)=> p) // -> [[remoteProps.user], [remoteProps.orders]]
    )
    var remoteProps = remoteProps
    .map((spec_fun)=> spec_fun(props) ) // -> 1st call [{url: '/api/me', prop: 'user'}, undefined]
                              // -> 2nd call [{url: '/api/me', prop: 'user'}, {url: '/api/orders?user_id=123', prop: 'orders'}]
    .filter((specs)=> specs) // get rid of undefined from remoteProps that don't match their dependencies
    .filter((specs)=> !props[specs.prop] ||  props[specs.prop].url != specs.url) // get rid of remoteProps already resolved with the url
  if(remoteProps.length == 0)
    return resolve(props)
    // check out https://github.com/cujojs/when/blob/master/docs/api.md#whenmap and https://github.com/cujojs/when/blob/master/docs/api.md#whenreduce
    var promise = When.map( // Returns a Promise that either on a list of resolved remoteProps, or on the rejected value by the first fetch who failed 
      remoteProps.map((spec)=>{ // Returns a list of Promises that resolve on list of resolved remoteProps ([{url: '/api/me', value: {name: 'Guillaume'}, prop: 'user'}])
        return HTTP.get(spec.url)
          .then((result)=>{spec.value = result; return spec}) // we want to keep the url in the value resolved by the promise here. spec = {url: '/api/me', value: {name: 'Guillaume'}, prop: 'user'} 
      })
    )

    When.reduce(promise, (acc, spec)=>{ // {url: '/api/me', value: {name: 'Guillaume'}, prop: 'user'}
      acc[spec.prop] = {url: spec.url, value: spec.value}
      return acc
    }, props).then((newProps)=>{
      addRemoteProps(newProps).then(resolve, reject)
    }, reject)
  })
}

var routes = {
  "orders": {
    path: (params) => {
      return "/";
    },
    match: (path, qs) => {
      return (path == "/") && {handlerPath: [Layout, Header, Orders]}
    }
  },
  "order": {
    path: (params) => {
      return "/order/" + params;
    },
    match: (path, qs) => {
      var r = new RegExp("/order/([^/]*)$").exec(path)
      return r && {handlerPath: [Order],  order_id: r[1]}
    }
  }
}

var Child = createReactClass({
  render(){
    var [ChildHandler,...rest] = this.props.handlerPath
    return <ChildHandler {...this.props} handlerPath={rest} />
  }
})

var browserState = {Child: Child}

function onPathChange() {
  
  var path = location.pathname
  var qs = Qs.parse(location.search.slice(1))
  var cookies = Cookie.parse(document.cookie)

  var route, routeProps

  for(var key in routes) {
    routeProps = routes[key].match(path, qs)
    if(routeProps){
        route = key
          break;
    }
  }

  browserState = {
    ...browserState,
    ...routeProps,
    route: route
  }

  addRemoteProps(browserState).then(
    (props) => {
      browserState = props
      ReactDOM.render(<Child {...browserState}/>, document.getElementById('root'))
    }, (res) => {
      ReactDOM.render(<ErrorPage message={"Shit happened"} code={res.http_code}/>, document.getElementById('root'))
    })
}

window.addEventListener("popstate", ()=>{ onPathChange() })
onPathChange()