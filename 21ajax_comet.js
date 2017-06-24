/*
21 ajax与comet
21.1 XMLHttpRequest对象
21.1.1 XHR的用法
在请求得到响应后，响应的数据会自动填充到xhr的属性，相关的属性有
responseText: 作为响应主体返回的文本
responseXML: 如果响应的内容是text/xml或application/xml，则这个属性将保存包含着响应数据的xml dom文档
status：响应的http状态
statusText：http状态的说明
xhr还有一个readyState属性，表示请求进行的阶段，有以下取值
0:未初始化，尚未调用open方法
1:启动，已经调用open方法，但是没有调用send方法
2:发送，已经调用send方法，但是没有接收到响应
3:接收，已经接收到部分响应
4:完成，接收到所有数据
21.1.2 HTTP头部信息
默认情况下，在发送xhr请求的同时，还会发送下列头部信息
Accept：浏览器能够处理的内容类型
Accept-Charset:浏览器能够显示的字符集
Accept-Encoding:浏览器能够处理的压缩编码
Accept-Language:浏览器当前设置的语言
Connection:浏览器与服务器间连接的类型
Cookie:当前页面设置的任何cookie
Host:发出请求的页面所在的域
Referer:发出请求的页面的URI
User-Agent: 浏览器的用户代理字符串
利用xhr的setRequestHeader方法可以设置自定义的请求头部信息，且要在open方法和send方法之间调用,例子
建议使用自定义的头部字段，不要用以上默认的字段，因为有些浏览器不允许重写默认的头部信息。
调用xhr的getResponseHeader方法并传入字段名称，可以取得相应的头部信息。
调用xhr的getAllResponseHeaders可以取得包含所有头部信息的长字符串
21.1.3 GET请求
传入xhr的get方法的查询字符串必须经过正确的编码才行，查询字符串中的每个名称和值都必须用encodeURIComponent进行编码，
然后才能放到URL的末尾。例子，向url末尾添加查询字符串参数。
21.1.4 POST请求
我们可以利用xhr来模仿表单提交，用到了14章讲到的serialize方法，例子
21.2 XMLHttpRequest 2级   
并不是所有浏览器都支持 2级，只是部分实现了功能
21.2.1 FormData
21.2.2 超时设定
为xhr添加一个属性timeout，表示请求在等待响应多少毫秒后终止。如果在规定的时间内没有收到响应，那么就会触发timeout事件，
进而调用ontimeout事件处理程序。
IE8+是唯一支持超时设定的浏览器
21.2.3 overrideMimeType方法
重写服务器返回的MIME类型
xhr.overrideMimeType("text/xml")
强迫xhr将响应当作xml而非纯文本来处理。在send方法之前调用。
支持的浏览器有：ff、safarai4+、opera 10.5 、 chrome
21.3 进度事件
有6个进度事件
loadstart：在接收到响应数据的第一个字节时触发
progress：在接收响应期间持续不断的触发
error：在请求发生错误时触发
abort：在因为调用abort方法终止连接时触发
load：在接收到完整的响应数据时触发
loadend：在通信完成或者触发error abort事件后触发
IE8＋只支持load事件
21.3.1 load事件
21.3.2 progress事件
利用此事件，可以创建一个进度指示器
21.4 跨资源共享
ajax受同源策略的影响，不能向异域发送请求。浏览器不会将数据交给js。。。
CORS是W3C的一个工作草案，思想为，使用自定义的http头部让浏览器和服务器沟通。
浏览器需要额外添加一个请求头origin，包含协议、域名、和端口
origin：http://www.nczonline.net
如果服务器认为这个请求可以接受，就在Access-Allow-Origin头部回发相同的源信息。
Access-Allow-Origin: http://www.nczonline.net
如果没有这个头部，或者这个头部与origin不匹配，浏览器就会驳回请求。
21.1.1 IE对CORS的实现
IE8引入了XDR类型，实现跨域通信，XDR的安全机制部分实现了W3C的CORS规范
21.4.2 其他浏览器对CORS的实现
通过XHR实现了对CORS的原生支持，当请求另一个域中的资源时，使用标准的XHR对象并在open方法中传入绝对URL即可。
例如：xhr.open("get","http://www.somewhere-else.com/page/",true)    
21.4.3 Preflighted Requests
CORS通过Preflighted Requests透明服务器验证机制支持开发人员使用自定义的头部、GET或者POST之外的方法。
21.4.4 带凭证的请求
默认情况下，跨源请求不提供凭据（cookie、http认证及客户端SSL等），通过将withCredentials属性设置为true，可以指定
某个请求应该发送凭证。
这个时候服务器响应头会有Access-Control-Allow-Credentials: true，如果没有的话，浏览器就不会把响应交给js。
21.4.5 跨浏览器的CORS、
例子
21.5 其他跨域技术
在CORS出现以前，开发人员利用DOM中能够执行跨域请求的功能，在不依赖xhr对象的情况下也能发送某种请求，虽然CORS技术已经
无处不在，但是，这些技术仍然被广泛应用，毕竟这不需要修改服务端代码。
21.5.1 图像Ping
使用img标签，动态创建图像经常用于图像Ping，图像Ping是与服务器进行简单的、单向的跨域通信的一种，请求的数据是通过
查询字符串发送的，响应可以是任意内容，但通常是像素图或者204，通过图像ping，浏览器得不到任何具体的数据，但通过侦听
load和error事件，它能知道响应是什么时候接收到的。图像Ping经常用于跟踪用户点击页面或者动态广告曝光次数。
它只能发送get请求，并且无法接收服务器的响应文本。
21.5.2 JSONP
json with padding的简写（填充式json或者参数式json），JSONP是被包含在函数调用中的JSON。

*/
//跨浏览器的xhr对象
function createXHR(){
    if(typeof XMLHttpRequest != "undefined"){
        return new XMLHttpRequest();
    }else if(typeof ActiveXObject != "undefined"){
        if(typeof arguments.callee.activeXString != "string"){
            var version = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"],
            i,len;
            for(i=0,len=version.length; i < len; i++){
                try{
                    new ActiveXObject(version[i]);
                    arguments.callee.activeXString = version[i];
                    break;
                }catch(ex){

                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    }else{
        throw new Error("no xhr object available")
    }
}
var xhr = createXHR();
xhr.onreadystatechange = function(){
    //在此函数内部，this取不到xhr的值，this等于多少呢，不知道
    if(xhr.readystate == 4){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ){
            console.log(xhr.responseText);
        }else{
        
        }
    }
};
xhr.openn("get","",true);
xhr.setRequestHeader("MyHeader","myvalue");
xhr.send(null);
//向url末尾添加查询字符串参数。
function addURLParam(url, name, value){
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}
// post方法
xhr.open("post", "test.php", true);
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
var form = document.getElementById("user-info");
xhr.send(serialize(form));
// FormData
xhr.open("post", "test.php", true);
var form = document.getElementById("user-info");
xhr.send(new FormData(form));
// 进度条事件
xhr.onProgress = function(event){
    var divStatus = document.getElementById("status");
    if(event.lengthComputable){
        divStatus.innerHTML = event.position/event.totalSize;
    }
}
// 跨浏览器的CORS、
function createCORSRequest(){
    var xhr = new XMLHttpRequest();
    if("withCredentials" in xhr){
        xhr.open(method,url,true);
    }else if(typeof XDomainRequest != "undefined"){
        xhr  = new XDomainRequest();
        xhr.open(method,url);
    }else{
        xhr = null;
    }
    return xhr;
}
