# LiveHTML

An DSL for generating HTML in LiveScript inspired in Markaby.


## Installation

	  npm install livehtml

## Examples

#### Basic elements

    {h1,img,br,div} = livehtml
    
    div '#main',->
    	h1 'Hello, world!'
        br!
    	img {src: 'foo.jpg'}
        a {href: "www.google.com"},"link to google"

renders to

```html
<div id="main">
	<h1>Hello, world!</h1>
    <br/>
	<img src="foo.jpg"/>
    <a href="www.google.com">link to google</a>
</div>
```
Note that each element is a function. For example in the first element `'#main'` and `->` are arguments to the  `div` function.

####nested elements
	{head,ul,li,h1,body} = livehtml
    
    (head {title: "Boats.com"},'') +
     body ->
        h1 "Boats.com has great deals"			
        ul '#list-top-level',->
            li '.item',"$49 for a canoe"
            li '.item',"$39 for a raft"
            li '.item',"$29 for a huge boot that floats and can fit 5 people"
            ul '#list-second-level', ->
                li "another li"
                li '.x', "with class x"
                li '#y', "with id y"

renders to
```html
<head title="Boats.com"></head>
<body>
	<h1>Boats.com has great deals</h1>
    <ul id="list-top-level">
    	<li class="item">$49 for a canoe</li>
        <li class="item">$39 for a raft</li>
        <li class="item">$29 for a huge boot that floats and can fit 5 people</li>
        <ul id="list-second-level">
        	<li>another li</li>
            <li class="x">with class x</li>
            <li id="y">with id y</li>
        </ul>
    </ul>
</body>
```



#### Using expressjs.

    express = require \express
    livehtml = require \livehtml
    app = express!

    greet_templ = (name)->
        {h1,body,div,p} = livehtml
        body ->
            div '#chat',->
                h1 "Hello #{name}"
                p "How are you?"

    app.get '/Greet/:name', (req, res)->
        res.send greet_templ req.params.name    

    app.listen(5000)
    
## Caveats

LiveHTML at the moment works only for nodejs.

In LiveHTML every element is a function and, consequently, is rendered by a function call. Therefore in self-closing tags like `<br/>` for which usually no arguments are passed to, in order to invoke the `br` function you need to use `!` instead of `()` so `br()` becomes `br!`.

For elements with id or a class you must provide a single-quoted string as first argument. Is important that the string you pass along is single-quoted!, this is because in LiveScript there is string interpolation so `p "#greet", Hi` would end up producing an error because will treat `greet` as a variable instead of just the `#greet` string. 
