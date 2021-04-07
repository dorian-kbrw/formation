require('!!file-loader?name=[name].[ext]!../web/orders.html');
var Qs = require('qs');
var Cookie = require('cookie');
require('../../priv/static/orders.css');
require('../../priv/static/modal.css');
require('../../priv/static/loader.css');
var ReactDOM = require('react-dom');
var React = require("react");
var createReactClass = require('create-react-class');
var XMLHttpRequest = require("xhr2");
var When = require('when');

var i = 0

var GoTo = (route, params, query) => {
  var qs = Qs.stringify(query)
  var url = routes[route].path(params) + ((qs=='') ? '' : ('?'+qs))
  history.pushState({}, "", url)
  onPathChange()
}

function goHome() {
  GoTo("orders", "", "");
}

var remoteProps = {
  user: (props) => {
    return {
      url: "/api/me",
      prop: "user"
    }
  },
  orders: (props) => {
    /*if (!props.user)
      return*/
    var qs = {...props.qs}//, user_id: props.user.value.id}
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

var Loader = createReactClass({
  render(){
    return <JSXZ in="loader" sel=".loader_component">
    </JSXZ>
  }
});

var DeleteModal = createReactClass({
  render(){
    function handleNoButtonClick(id, e) {
      e.preventDefault();
    };
    return <JSXZ in="confirm" sel=".modal_component">
      <Z sel=".title">{this.props.title}</Z>
      <Z sel=".message">{this.props.message}</Z>
      <Z sel=".yes-button" onClick={(e) => this.props.callback(true)}>Yes</Z>
      <Z sel=".no-button" onClick={(e) => handleNoButtonClick(this.props.order, e)}>No</Z>
    </JSXZ>
  }
})

var Layout = createReactClass({
  getInitialState: function() {
    return {
      modal: null,
      loader: false
    };
  },
  modal(spec){
    this.setState({modal: {
      ...spec,
      callback: (res) => {
        this.setState({modal: null}, () => {
          if(spec.callback) {
            spec.callback(res)
          }
        })
      }
    }})
  },
  loader(promise) {
    this.setState({loader: true});
    return promise.then(() => {
      this.setState({loader: false});
    })
  },
  render(){
    var props = {
      ...this.props, modal: this.modal, loader: this.loader, page: {value: 1, writable: true}
    }
    var cn = function(){
      var args = arguments, classes = {}
      for (var i in args) {
        var arg = args[i]
        if(!arg) continue
        if ('string' === typeof arg || 'number' === typeof arg) {
          arg.split(" ").filter((c)=> c!="").map((c)=>{
            classes[c] = true
          })
        } else if ('object' === typeof arg) {
          for (var key in arg) classes[key] = arg[key]
        }
      }
      return Object.keys(classes).map((k)=> classes[k] && k || '').join(' ')
    }
    var modal_component = {
      'delete': (props) => <DeleteModal {...props}/>
    }[this.state.modal && this.state.modal.type];
    modal_component = modal_component && modal_component(this.state.modal)
    var loader_component = this.state.loader && (() => <Loader />)
    loader_component = loader_component && loader_component(this.state.loader)
    return <JSXZ in="orders" sel=".layout">
      <Z sel=".layout-container">
        <this.props.Child {...props}/>
      </Z>
      <Z sel=".modal-wrapper" className={cn(classNameZ, {'hidden': !modal_component})}>
        {modal_component}
      </Z>
      <Z sel=".loader-wrapper" className={cn(classNameZ, {'hidden': !loader_component})}>
        {loader_component}
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

var Orders = createReactClass({
  statics: {
    remoteProps: [remoteProps.orders]
  },
  render(){
    var test = this.props.orders.value.map;
    var page = this.props.page.value;
    localStorage.setItem("max", this.props.orders.value.max_page)
    function handleClick(id, e) {
      e.preventDefault();
      GoTo("order", id, "");
    };
    function handleDelete(id, props) {
      var data = {
        order: "nat_order" + id
      };
      props.modal({
        type: 'delete',
        title: 'Order deletion',
        message: `Are you sure you want to delete this ?`,
        callback: (value) => {
          props.loader(HTTP.post("/api/delete", data).then(res => {
            window.location.reload();
          }));
        }
      });
    }

    function handleFirst(e, props) {
      var actual = parseInt(document.getElementsByClassName("actual")[0].outerText);
      var data = {
        page: 1
      };
      if (actual != 1) {
        HTTP.post("/api/pagination", data).then(res => {
          props.orders.value.map = res.map;
          props.page.value = 1;
          ReactDOM.render(<Orders {...props}/>, document.getElementById('root'))
        })
      } else {
        console.log("Already on first page")
      }
    }

    function handleLast(e, props) {
      var actual = parseInt(document.getElementsByClassName("actual")[0].outerText);
      var max = localStorage.getItem("max");
      var data = {
        page: max
      };
      if (actual != max) {
        HTTP.post("/api/pagination", data).then(res => {
          props.orders.value.map = res.map;
          props.page.value = max;
          ReactDOM.render(<Orders {...props}/>, document.getElementById('root'))
        })
      } else {
        console.log("Already on last page")
      }
    }

    function handleLeft(e, props) {
      var actual = parseInt(document.getElementsByClassName("actual")[0].outerText) - 1;
      var data = {
        page: actual
      };
      var min = 1;
      if (actual >= min) {
        HTTP.post("/api/pagination", data).then(res => {
          //localStorage.setItem("max", res.max_page)
          props.orders.value.map = res.map;
          props.page.value = actual;
          ReactDOM.render(<Orders {...props}/>, document.getElementById('root'))
        })
      } else {
        console.log("Min page");
      }
    }
    function handleRight(e, props) {
      var actual = parseInt(document.getElementsByClassName("actual")[0].outerText) + 1;
      var data = {
        page: actual
      };
      var max = localStorage.getItem("max");
      if (actual <= max) {
        HTTP.post("/api/pagination", data).then(res => {
          //localStorage.setItem("max", res.max_page)
          props.orders.value.map = res.map;
          props.page.value = actual;
          ReactDOM.render(<Orders {...props}/>, document.getElementById('root'))
        })
      } else {
        console.log("Max page");
      }
    }
    return <JSXZ in="orders" sel=".orders-container">
      <Z sel=".orders-column">
			{
				test.map( order => (<JSXZ in="orders" key={i++} sel=".orders-line">
					<Z sel=".command">{order.remoteid}</Z>
          <Z sel=".customer">{order["custom.customer.full_name"]}</Z>
          <Z sel=".address">{order["custom.billing_address.street"]}, {order["custom.billing_address.postcode"]} {order["custom.billing_address.city"]}</Z>
          <Z sel=".quantity">{order["custom.magento.total_item_count"]}</Z>
          <Z sel=".details" onClick={(e) => handleClick(order.remoteid, e)}>View</Z>
          <Z sel=".pay" onClick={(e) => handleDelete(order.remoteid, this.props)}>Delete</Z>
					</JSXZ>))
			}
      </Z>
      <Z sel=".first" onClick={(e) => handleFirst(e, this.props)}>FIRST</Z>
      <Z sel=".left" onClick={(e) => handleLeft(e, this.props)}>-</Z>
      <Z sel=".actual">{page}</Z>
      <Z sel=".right" onClick={(e) => handleRight(e, this.props)}>+</Z>
      <Z sel=".last" onClick={(e) => handleLast(e, this.props)}>LAST</Z>
			</JSXZ>
    }
  })

var Order = createReactClass({
  render(){
    var order = this.props.orders.value.find(v => v.remoteid[0] === window.location.pathname.slice(7));
    var items = [];
    i = 0;
    while (order["custom.items.price"][i]) {
      var item = {
        brand: order["custom.items.brand"][i],
        product_title: order["custom.items.product_title"][i],
        price: order["custom.items.price"][i]
      }
      items.push(item);
      i = i + 1;
    }
    i = 1;
    return <JSXZ in="order" sel=".layout">
      <Z sel=".detail_client">{order["custom.customer.full_name"]}</Z>
      <Z sel=".detail_address">{order["custom.billing_address.street"]}, {order["custom.billing_address.postcode"]} {order["custom.billing_address.city"]}</Z>
      <Z sel=".detail_command">{order.remoteid}</Z>
      <Z sel=".goback" onClick={goHome}>Go Back</Z>
      <Z sel=".item-lines">
        {
          items.map( item => (<JSXZ in="order" key={i++} sel=".item">
					<Z sel=".text-block-32">{item.brand}.</Z>
          <Z sel=".text-block-33">{item.product_title}</Z>
          <Z sel=".text-block-34">{item.price}€</Z>
					</JSXZ>))
        }
      </Z>
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
    var remoteProps = Array.prototype.concat.apply([],
      props.handlerPath
        .map((c)=> c.remoteProps)
        .filter((p)=> p)
    )
    var remoteProps = remoteProps
    .map((spec_fun)=> spec_fun(props) )
    .filter((specs)=> specs)
    .filter((specs)=> !props[specs.prop] ||  props[specs.prop].url != specs.url)
  if(remoteProps.length == 0)
    return resolve(props)
    var promise = When.map(
      remoteProps.map((spec)=>{
        return HTTP.get(spec.url)
          .then((result)=>{spec.value = result; return spec})
      })
    )

    When.reduce(promise, (acc, spec)=>{
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
      return (path == "/") && {handlerPath: [Layout, Header, Orders, DeleteModal]}
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
    }/*, (res) => {
      ReactDOM.render(<ErrorPage message={"Shit happened"} code={res.http_code}/>, document.getElementById('root'))
    }*/)
}

window.addEventListener("popstate", ()=>{ onPathChange() })
onPathChange()