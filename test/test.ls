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

{head,ul,li,span,h1,body,a,br,img,div,form,h2,p} = livehtml


page0 = body "Hi"

page1 = form {role: "form"},->
					h1 "ok" 

page2 = body ->
			span ->
				h1 "hola"
			span "bye"

page3 = div '#main',{data: 'foo'}, ->
			h1 "Hello, world!"
			h2 '.greeting',"Hi"
			img {src: 'foo.jpg'}
			div '#numbers',->
				span "one"
				span "two"
			p "last"

# page4 = (head '#header',"somestuff") + body ->
# 			h1 "Boats.com has great deals"
# 			a {href: "www.google.com"},"link to google"
# 			img {src: 'foo.jpg'}
# 			body '#lista',->
# 				li '.item',"$49 for a canoe"
# 				li "$39 for a raft"
# 				li '.item',"$29 for a huge boot that floats and can fit 5 people"
# 				body '#lista2', ->
# 					li "another li"
# 					li '.x', "with class"
# 					li '#y', "with id"
			
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

report!