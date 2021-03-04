import React from 'react'

function my_alert() {

const my_div = document.getElementById("root")
const my_content = React.createElement(
    'div',
    {},
    'Hey I was created from React!'
)
ReactDOM.render(my_content, my_div)
}