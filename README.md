# DISCLAIMER

## This project is very incomplete and unstable, for serious stuff check out [Coffeecup](https://github.com/gradus/coffeecup) and [teacup](https://github.com/goodeggs/teacup)
# 


LiveHTML is a tiny DSL for generating HTML in [LiveScript](https://github.com/gkz/LiveScript) inspired in [Markaby](https://github.com/markaby/markaby).


## Installation

      npm install livehtml

## Examples

#### Basic elements

```livescript
{h1,img,br,div} = livehtml

div \#main ->
    h1 'Hello, world!'
    br!
    img {src: \foo.jpg}
    a {href: \www.google.com} "link to google"
```

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

#### bootstrap form

```livescript
{$$,form,div,label,input,button,p} = livehtml

form {role: \form} ->
    div \.form-group ->
        label {for: \exampleInputEmail1} 'Email address'
        input {type: \email, class: \form-control, id: \exampleInputEmail1, placeholder: 'Enter email'}
    div \.form-group ->
        label {for: \exampleInputPassword1} \Password
        input {type: \password, class: \form-control, id: \exampleInputPassword1, placeholder: \Password}
    div \.form-group ->
        label {for: \exampleInputFile} 'File input'
        input {type: \file, id: \exampleInputFile}
        p \.help-block 'Example block-level help text here.'
    div \.checkbox ->
        label ->
            input {type: \checkbox}; $$ 'Check me out'
    button {type: \submit, class: 'btn btn-default'} \Submit
```

renders to:

```html
<form role="form">
    <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email"/>
    </div>
    <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
    </div>
    <div class="form-group">
        <label for="exampleInputFile">File input</label>
        <input type="file" id="exampleInputFile"/>
        <p class="help-block">Example block-level help text here.</p>
    </div>
    <div class="checkbox">
        <label>
            <input type="checkbox"/>Check me out
        </label>
    </div>
    <button type="submit" class="btn btn-default">Submit</button>
</form>
```

####nested elements

```livescript
{head,ul,li,h1,body} = livehtml

 head {title: "Boats.com"},'';+
 body ->
    h1 "Boats.com has great deals"          
    ul \#list-top-level ->
        li \.item "$49 for a canoe"
        li \.item "$39 for a raft"
        li \.item "$29 for a huge boot that floats and can fit 5 people"
        ul \#list-second-level ->
            li "another li"
            li \.x "with class x"
            li \#y "with id y"
```

renders to:
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

```livescript
express = require \express
livehtml = require \livehtml
app = express!

greet_templ = (name)->
    {h1,body,div,p} = livehtml
    body ->
        div \#chat ->
            h1 "Hello #{name}"
            p "How are you?"

app.get '/Greet/:name', (req, res)->
    res.send greet_templ req.params.name    

app.listen(5000)
```

## Conventions and caveats

LiveHTML at the moment works only for nodejs.

In LiveHTML every element is a function that renders when is called. Therefore, in order to render self-closing tags like `<br/>` (for which usually no arguments are passed to) you need to invoke it as `br!` alias of `br()`.

Another implication of the inner works of livehtml is that we can't just type text anywhere. When we need to write anything outside a holder tag we need to use the $$ helper (which is also a tag) but allow us to write anything anywhere. A common use of this is for example in a checkbox input, where we would do something like:

```livescript
input {type: \checkbox}; $$ 'Check me out'
```

resulting in:

```html
<input type="checkbox"/> Check me out
```

For elements with id or a class you must provide a single-quoted string as first argument. Is important that the string you pass along is single-quoted, this is because in LiveScript there is string interpolation so `p "#greet", \Hi` would end up producing an error because will treat `greet` as a variable instead of just the `#greet` string. As a convention, always use LiveScript `\` notation for refering to id or class strings. Ex: `p \#greet "hey there"`.

Lastly, when you need to set both id and class to an element, you will have to pass them in the attributes object `{id: 'unique', class: 'category'}` . 

## License

[MIT](https://github.com/efrence/livehtml/blob/master/LICENSE)
