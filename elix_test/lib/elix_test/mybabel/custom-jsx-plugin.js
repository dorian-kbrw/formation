module.exports = function (babel) {
    var t = babel.types;
    return {
      name: "custom-jsx-plugin",
      visitor: {
        JSXElement(path) {
          var openingElement = path.node.openingElement;
          var tagName = openingElement.name.name;
          var my_expression = "";
          if (tagName == "Declaration") {
            my_expression += openingElement.attributes[0].name.name + " ";
            my_expression += openingElement.attributes[0].value.value + " = ";
            my_expression += openingElement.attributes[1].value.value + ";";
          }
          console.log(my_expression);
          //var args = [];
          //args.push(my_expression);
        },
    },
    };
  };