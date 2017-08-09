function show_hide(target,src){
	if(target.style.display==""){
		target.style.display="none";
		src.innerHTML="+"+src.innerHTML.substring(1);
	}else{
		target.style.display="";
		src.innerHTML="-"+src.innerHTML.substring(1);
	}
}

function startsWith(src,prefix){
	if(src.length < prefix.length)
		return false;
	else
		return src.substring(0,prefix.length)==prefix;
}

function getErrors(errors){
	var chars=[];
	for(var i=0;i<errors.length;i++){
		var err = errors[i];
		chars.push('<DIV class="exception">');
		chars.push('<DIV class="exception_message"><A href="#" onclick="show_hide(exception_',i,',this);return false;">- ');
		chars.push(err.getElementsByTagName("exception_name")[0].innerText,':',err.getElementsByTagName("exception_message")[0].innerText);
		chars.push('</A></DIV>');
		chars.push('<BLOCKQUOTE class="exception_detail" id="exception_',i,'">');
		var traces = err.getElementsByTagName("blockquote")[0].getElementsByTagName("stack_trace");
		for(var j=0;j<traces.length;j++){
			var tra = traces[j];
			var className = tra.getElementsByTagName("class_name")[0].innerText;
			if(startsWith(className,"jacper."))
				chars.push('<DIV><A class="jacper" href="kess:///',className,'?',tra.getElementsByTagName("line_number")[0].innerText,'">',tra.innerText,'</A></DIV>');
			else if(startsWith(className,"com.susing.") || startsWith(className,"com.kinglib.")|| startsWith(className,"com.kinglibx."))
				chars.push('<DIV><A class="kingle" href="kess:///java.',className,'?',tra.getElementsByTagName("line_number")[0].innerText,'">',tra.innerText,'</A></DIV>');
			else
				chars.push('<DIV>',tra.innerText,'</DIV>');
		}
		chars.push('</BLOCKQUOTE></DIV>');
	}
	return chars.join('');
}
function getCompileErrors(errors){
	if(errors.length ==0)
		return "";
	var err = errors[0];
	var lines = err.innerText.split("\n");

	for(var i=0;i<lines.length;i++){
		var line=lines[i];
		if("jacper::"==line.substring(0,8)){
			lines[i]='<A class="jacper" href="kess:///'+line.substring(8,line.indexOf(':',8))+'">'+line.substring(8)+'</A>';
		}else
			lines[i]=line.replace(/ /ig,"&nbsp;");
	}
	var chars=['<BLOCKQUOTE class="compile_error">',
	lines.join("<BR/>"),
	'</BLOCKQUOTE>'];

	return chars.join('');
}

var body=document.body;
var chars=[
	'<P class="info_title">',body.getElementsByTagName("info_title")[0].innerHTML ,'</P>',
	'<P>Status:<CODE class="info_code">',body.getElementsByTagName("info_code")[0].innerHTML,'</CODE></P>',
	'<DIV class="more_info"><A href="#" onclick="show_hide(more_info,this);return false;">- More information</A></DIV>',
	'<P/><DIV id="more_info">',
	getErrors(body.getElementsByTagName("exception")),
	getCompileErrors(body.getElementsByTagName("compile_error")),
	'</DIV><P/>',
	'<DIV class="system_info">Powered by Kingle Framework(js2 and JCPs)</DIV>'];

document.body.innerHTML=chars.join('');