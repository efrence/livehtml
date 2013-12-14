_ = require \prelude-ls
clc = require \cli-color
livehtml = require \../lib/livehtml

puts = console.log 
i = 0; ok = 0; failed = 0
assert = (cond,desc)->
	pass = (desc,args)-> ok++; puts clc.greenBright.bold('PASS #'+i+' ') + desc 
	fail = (desc,args)-> failed++; puts clc.red('FAIL #'+i+' ') + desc 
	res = if cond then pass desc else fail desc

report = ->
	summary = if !failed then clc.greenBright('All tests passed:') else clc.red('Some tests failed:')
	puts "#{summary} Total #{i} OK #{ok} and Failed #{failed}"

{head,ul,li,span,h1,body,a,br,img,div,form,h2,p,input,label,$$,button} = livehtml


page0 = body \Hi

page1 = form {role: \form} ->
					h1 \ok 

page2 = body ->
			span ->
				h1 \hola
			span \bye

page3 = div \#main {data: \foo} ->
			h1 "Hello, world!"
			h2 \.greeting,"Hi"
			img {src: \foo.jpg}
			div \#numbers,->
				span \one
				span \two
			p \last

example1 = div \#main ->
				h1 'Hello, world!'
				br!
				img {src: \foo.jpg}
				a {href: \www.google.com} "link to google"

example2 =  head {title: "Boats.com"} '';+
			body ->
				h1 "Boats.com has great deals"
				a {href: \www.google.com} "link to google"
				img {src: \foo.jpg}
				ul \#list-top-level ->
					li \.item,"$49 for a canoe"
					li \.item,"$39 for a raft"
					li \.item,"$29 for a huge boot that floats and can fit 5 people"
					ul \#list-second-level ->
						li "another li"
						li \.x, "with class"
						li \#y, "with id"

page5 = div \.checkbox ->
			label ->
					p ->
						input {type: \checkbox}

bootstrap = form {role: \form} ->
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
				 
				# 		p 'ok'
									
i++; assert page0 == '<body>Hi</body>', "body tag rendering 'Hi'"
i++; assert page1 == '<form role="form"><h1>ok</h1></form>', "form tag with an attribute and an element nested"

i++; assert page2 == '<body>
					  	<span>
					  		<h1>hola</h1>
					  	</span>
					  	<span>bye</span>
					  </body>', "body tag with two span tags inside"

i++; assert page3 == '<div id="main" data="foo">
							<h1>Hello, world!</h1>
							<h2 class="greeting">Hi</h2>
							<img src="foo.jpg"/>
							<div id="numbers">
								<span>one</span>
								<span>two</span>
							</div>
							<p>last</p>
						</div>',"div tag with other div element nested"

i++; assert example2 = '<head title="Boats.com"></head>
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
						</body>','nested elements example'

i++; assert page5 == '<div class="checkbox">
						<label>
							<p>
								<input type="checkbox"/>
							</p>
						</label>
					  </div>',"three levels of nesting"

i++; assert example1 == '<div id="main">
							<h1>Hello, world!</h1>
							<br/>
							<img src="foo.jpg"/>
							<a href="www.google.com">link to google</a>
						</div>',"basic elements";

i++; assert bootstrap == '<form role="form">
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
						</form>','bootstrap form example'



# puts example2
# puts bootstrap
# puts page5
# puts br!
report!