_ = require('prelude-ls');
//GLOBAL variables
livehtml = {};
last_tag = '';
ids = [];
attrs_arr = [];

var non_self_closing_tags = [
						'html','head','title','style','script','$$',
				        'noscript','body','section','nav','article','aside','h1','h2',
				        'h3','h4','h5','h6','hgroup','header','footer','address','main',
				        'p','hr','pre','blockquote','ol','ul','li','dl','dt','dd',
				        'figure','figcaption','div','a','em','strong','small','s','cite',
				        'q','dfn','abbr','data','time','code','samp','kbd','sub',
				        'sup','i','b','u','mark','ruby','rt','rp','bdi','bdo','span',
				        'wbr','ins','del','iframe','embed','object','video',
				        'audio','source','track','canvas','map','svg','math',
				        'table','caption','colgroup','tbody','thead','tfoot','tr',
				        'td','th','form','fieldset','legend','label','button',
				        'select','datalist','optgroup','option','textarea','keygen',
				        'output','progress','meter','details','summary','command','menu','diva'
						];

var self_closing_tags = ['base','meta','link','hr','br','param','img','area','input','col','frame','embed'];


function attrs_expander(attrs){
	var str = '';	
	if(typeof(attrs) != 'object'){ return str; }	
	Object.keys(attrs).forEach(function(key) {
	  var val = attrs[key];
	  str = str + ' ' + key + '=\"' + val + '\"';
	});
	return str;
}

function tag(name,content,id_or_class,attrs){	
	var opentag;
	if(id_or_class){
		if(id_or_class[0] == '#'){ 
			opentag = '<'+name+' id="'+id_or_class.slice(1)+'"'+attrs_expander(attrs)+'>'; 
		} else {
			opentag = '<'+name+' class="'+id_or_class.slice(1)+'"'+attrs_expander(attrs)+'>'; 
		}
	} else{
		opentag = '<'+name+attrs_expander(attrs)+'>'; 
	}	
    var closetag = '</'+name+'>';
    return opentag + content + closetag;
}

function self_closing_tag(name,id_or_class,attrs){	
	var tag;
	if(id_or_class){
		if(id_or_class[0] == '#'){ 
			tag = '<'+name+' id="'+id_or_class.slice(1)+'"'+attrs_expander(attrs)+'/>'; 
		} else {
			tag = '<'+name+' class="'+id_or_class.slice(1)+'"'+attrs_expander(attrs)+'/>'; 
		}
	} else{
		tag = '<'+name+attrs_expander(attrs)+'/>'; 
	}	    
    return tag;
}

function assignment_resolution(v1,v2,v3){
	var id = undefined,fn = undefined, attrs = undefined, num_str = 0;
	if(typeof(v1) == 'string'){ 	
		num_str = 1;
	} else if(typeof(v1) == 'object'){
		return [undefined,v1,v2];
	}
	if(v2 && (typeof(v2) == 'string' || typeof(v2) == 'function') ){		
		if(num_str == 1){
			return [v1,undefined,v2];
		} else {
			fn = v2;
		}
	} else if(v2 == undefined){ 
		return [undefined,undefined,v1];
	} else if(typeof(v2) == 'object'){
		return [v1,v2,v3];
	}
	if(v3){
		if(id && attrs){
			return [id,attrs,v3];	
		} else if (id){
			return [id,undefined,v3];			
		} else {
			return [undefined,attrs,v3];
		}		
		
	} else {
		return [undefined,fn,undefined];
	}	
}

var tag_behaviour = function(arguments,id,attrs,fn){
	var parameters = assignment_resolution(id,attrs,fn);
 	var id = parameters[0], attrs = parameters[1], fn = parameters[2];
	if( typeof(fn) == 'string'){
		fakename = arguments.callee.caller.fakename;
		var level = arguments.callee.caller.level;
		var caller_id = arguments.callee.caller.id;
		var caller_attrs = arguments.callee.caller.attrs;
		var innertag = tag(arguments.callee.name,fn,id,attrs);
		if(fakename == undefined){
			if(arguments.callee.content){
 				arguments.callee.content[level] = innertag;
 			} else {
 				arguments.callee.content = innertag;
 			}
 		} else {
 			parent = GLOBAL['livehtml'][fakename]['content'][level];
 			content = GLOBAL['livehtml'][fakename]['content'];
 			if(level > glevel){
 				glevel = glevel + 1;
 				content[level + 1] = (content[level + 1]) ? content[level + 1] + innertag : innertag;
 			} else {
 				if(GLOBAL['livehtml'][fakename]['content']){
					GLOBAL['livehtml'][fakename]['content'] +=  innertag;
 				}
 				parent = parent + innertag;
 			}
		}
	} else {
		pseudo = arguments.callee.name;
		if(arguments.callee.caller.fakename == pseudo){
 			fn.level = arguments.callee.caller.level + 1;
 		} else {
 			if(last_tag == pseudo){
				arguments.callee.content = '';
			} else {
				last_tag = pseudo;
			}
 			fn.level = 0;
 		}
		temp = arguments.callee.content;
 		GLOBAL['livehtml'][pseudo]['content'] =  [];
 		GLOBAL['livehtml'][pseudo]['content'][fn.level] = temp || '';
 		fn.fakename = pseudo;
 		fn.content = [];
 		fn.id = id;
 		fn.attrs = attrs;
 		fn.call(arguments.callee,fn.level,fn.id, fn.attrs);
		parentname = arguments.callee.caller.fakename;
		if(parentname == undefined){
			innertag = tag(arguments.callee.name,arguments.callee.content,id,attrs);
			arguments.callee.content = innertag;
		} else{
			if(fn.level == 0){
				innertag = tag(arguments.callee.name,arguments.callee.content,id,attrs);
				parent = GLOBAL['livehtml'][parentname];
				parent.content = parent.content + innertag;
			} else {
				if(fn.level == 1 && deepest){
					ids[fn.level] = id;
					attrs_arr[fn.level] = attrs;
					ids = _.reverse(ids);
					arr = GLOBAL['livehtml'][parentname]['content'][fn.level +1];
					thistag = tag(pseudo,arr[1][0],'#{'+fn.level+'}','.a{'+fn.level+'}');
					innertag = arr[0].replace('%'+(fn.level+1),thistag.slice(0,(thistag.length - (pseudo.length + 3))))+arr[2]+thistag.slice(thistag.length - (pseudo.length + 3));
					for (var i = ids.length - 1; i >= 0; i--) {
						if(ids[i]){
							innertag = innertag.replace('{'+i+'}',ids[i]);
						} else {
							innertag = innertag.replace(' id=\"{'+i+'}\"','');
						}
						if(attrs_arr[i]){
							innertag = innertag.replace('a{'+i+'}',attrs_expander(attrs_arr[i]));
						} else {
							innertag = innertag.replace(' class=\"a{'+i+'}\"','');
						}
					}
					GLOBAL['livehtml'][parentname]['content'] = innertag;
				} else  {
					if(GLOBAL['livehtml'][parentname]['content'][fn.level]){
						deepest = fn.level;
						rawthislevel = GLOBAL['livehtml'][parentname]['content'][fn.level];
						if(fn.level == 1){
							GLOBAL['livehtml'][parentname]['content'] = rawthislevel +tag(pseudo,GLOBAL['livehtml'][parentname]['content'][fn.level + 1],id,attrs);
						} else {
							thislevel = _.flatten(rawthislevel);
							thislevel = _.filter(function(n){ if(n != undefined){return true;}},thislevel);
							var arr = thislevel;
							ids[fn.level] = id;
							attrs_arr[fn.level] = attrs;
							innertag = arr[0] +'%'+fn.level+tag(pseudo,GLOBAL['livehtml'][parentname]['content'][fn.level + 1],'#{0}','.a{0}');
							GLOBAL['livehtml'][parentname]['content'][fn.level] = [innertag.slice(0,(innertag.length - (pseudo.length + 3))), arr.slice(1),innertag.slice(innertag.length - (pseudo.length + 3))];
						}
					} else {
						ids[fn.level] = id;
						attrs_arr[fn.level] = attrs;
						arr = GLOBAL['livehtml'][parentname]['content'][fn.level +1];
						thistag = tag(pseudo,arr[1][0]+'%'+fn.level,'#{'+fn.level+'}','.a{'+fn.level+'}');
						arr2 = arr[0].split('%'+(fn.level+1));
						innertag = arr2[0] + thistag.slice(0,(thistag.length - (pseudo.length + 3))) + arr2[1];
						GLOBAL['livehtml'][parentname]['content'][fn.level] = [innertag,arr[1].slice(1),thistag.slice(thistag.length - (pseudo.length + 3)) + arr[2]];
					}
				}
			}
		}
	};
}

var self_closing_tag_behaviour = function(args,id,attrs){
		if(id && typeof(id) == 'object' && attrs == undefined){ attrs = id; id = undefined; } 
		fakename = args.callee.caller.fakename; 
		var innertag = self_closing_tag(args.callee.name,id,attrs); 
		if(fakename == undefined){ 
			args.callee.content = innertag; 
		} else { 
			parent = GLOBAL['livehtml'][fakename]; 
			parent.content = parent.content + innertag; 
		}
	}

var reset = function(key,all){
	if(all){
		Object.keys(livehtml).forEach(function(key){
			if(Object.keys(livehtml[key])[0]){			
				livehtml[key]['content'] = [];
			}
		});
	} else {	
		if(Object.keys(livehtml[key])[0]){			
			livehtml[key]['content'] = [];
		}
	}
}


var opentag = function(arguments,id,attrs,fn){
	glevel = 0; deepest = 0; 
	tag_behaviour(arguments,id,attrs,fn);
	var res = String(arguments.callee.content);
	if(arguments.callee.caller.fakename == undefined) {
		reset(null,true);
	} 
	return res.replace(/<\$\$>|<\/\$\$>/g,""); 
}

var closedtag = function(arguments,id,attrs){
	self_closing_tag_behaviour(arguments,id,attrs);
	return arguments.callee.content;
}

non_self_closing_tags.forEach(function(key) {	
	livehtml[key] = new Function("tagFn",
		'return function '+key+'(id,attrs,fn){ \
			return tagFn(arguments,id,attrs,fn); \
		}'
	)(opentag);
	exports[key] = livehtml[key];
});

self_closing_tags.forEach(function(key) {	
	livehtml[key] = new Function( "tagFn",
		'return function '+key+'(id,attrs){ \
			return tagFn(arguments,id,attrs); \
		}'
	)(closedtag);
	exports[key] = livehtml[key];
});

