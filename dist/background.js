(function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var r={};return e.m=t,e.c=r,e.i=function(t){return t},e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=19)})({1:function(t,e,r){"use strict";function n(t){t.preventDefault(),t.target.href&&chrome.tabs.create({url:t.target.href})}function o(t){return JSON.parse(JSON.stringify(t))}function a(){return new Promise(function(t,e){chrome.tabs.query({url:"http://omnibear.com/auth/success*"},function(r){r.length?t(r[0]):e("Auth tab not found")})})}function i(){var t=["token","domain","authEndpoint","tokenEndpoint","micropubEndpoint"];t.map(function(t){return localStorage.removeItem(t)})}Object.defineProperty(e,"__esModule",{value:!0}),e.openLink=n,e.clone=o,e.getAuthTab=a,e.logout=i},18:function(t,e,r){"use strict";t.exports=function(t,e){e=e||{};for(var r={key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},n=r.parser[e.strictMode?"strict":"loose"].exec(t),o={},a=14;a--;)o[r.key[a]]=n[a]||"";return o[r.q.name]={},o[r.key[12]].replace(r.q.parser,function(t,e,n){e&&(o[r.q.name][e]=n)}),o}},19:function(t,e,r){"use strict";function n(t,e,r){switch(t.action){case"begin-auth":o(t.payload);break;case"focus-window":a(e.url,t.payload.selectedEntry);break;case"select-entry":i(t.payload.url);break;case"clear-entry":u()}}function o(t){localStorage.setItem("domain",t.domain),localStorage.setItem("authEndpoint",t.metadata.authEndpoint),localStorage.setItem("tokenEndpoint",t.metadata.tokenEndpoint),localStorage.setItem("micropubEndpoint",t.metadata.micropub),chrome.tabs.create({url:t.authUrl},function(t){m=t.id})}function a(t,e){localStorage.setItem("pageUrl",(0,d.cleanUrl)(t)),e?i(e):u()}function i(t){localStorage.setItem("selectedEntry",t)}function u(){localStorage.removeItem("selectedEntry")}function c(t,e,r){if(t===m&&s(e)){var n=(0,d.getParamFromUrl)("code",e.url);l(n).then(function(t){var e=t.access_token;if(!e)throw new Error("Token not found in token endpoint response. Missing expected field 'access_token'");localStorage.setItem("token",e),chrome.tabs.remove(r.id),m=null}).catch(function(t){(0,p.getAuthTab)().then(function(e){chrome.tabs.sendMessage(e.id,{action:"fetch-token-error",payload:{error:t.message}}),(0,p.logout)()})})}}function s(t){var e="http://omnibear.com/auth/success";return"loading"===t.status&&t.url&&t.url.startsWith(e)}function l(t){var e={code:t,redirect_uri:"http://omnibear.com/auth/success/",client_id:"http://omnibear.com",me:localStorage.getItem("domain")},r=localStorage.getItem("tokenEndpoint");return(0,f.post)(r,e).then(function(t){var e=(0,f.formEncodedToObject)(t);if(e.error)throw new Error(e.error_description||e.error);return e})}var f=r(3),d=r(7),p=r(1),m=null,h=void 0;chrome.runtime.onMessage.addListener(n),chrome.tabs.onUpdated.addListener(c),h=chrome.contextMenus.create({title:"Reply to entry",contexts:["page","selection"],onclick:function(){window.open("index.html?reply=true","extension_popup","width=450,height=510,status=no,scrollbars=yes,resizable=no,top=80,left=2000")}})},3:function(t,e,r){"use strict";function n(t,e){var r;return r="string"==typeof e?e:o(e),fetch(t+"?"+r,{method:"POST"}).then(function(t){return t.text()})}function o(t){var e=[];for(var r in t){var n=t[r];if(Array.isArray(n)){var o=!0,a=!1,i=void 0;try{for(var u,c=n[Symbol.iterator]();!(o=(u=c.next()).done);o=!0){var s=u.value;e.push(r+"[]="+s)}}catch(t){a=!0,i=t}finally{try{!o&&c.return&&c.return()}finally{if(a)throw i}}}else e.push(r+"="+n)}return e.join("&")}function a(t){var e={},r=t.split("&");return r.forEach(function(t,r){var n=t.split("="),o=s(n,2),a=o[0],u=o[1],c=i(u);if(a.endsWith("[]")){var l=a.substr(0,a.length-2);e[l]=e[l]||[],e[l].push(c)}else e[a]=c}),e}function i(t){var e=t.replace(/\+/g," ");return decodeURIComponent(e)}function u(t,e,r){return new Promise(function(n,o){fetch(t,{method:"POST",headers:{Authorization:"Bearer "+r},body:c(e)}).then(function(t){return t.status<200||t.status>=400?o(t.status):void n(t.text())})})}function c(t){var e=new FormData;for(var r in t)Array.isArray(t[r])?t[r].forEach(function(t,n){e.append(r,t)}):e.append(r,t[r]);return e}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){var r=[],n=!0,o=!1,a=void 0;try{for(var i,u=t[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!e||r.length!==e);n=!0);}catch(t){o=!0,a=t}finally{try{!n&&u.return&&u.return()}finally{if(o)throw a}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();e.post=n,e.getParamString=o,e.formEncodedToObject=a,e.postFormData=u,e.formDataFromObject=c},7:function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function o(t,e){var r=e.split("?")[1];return a(t,r)}function a(t,e){var r=e.split("&").filter(function(e){return e.startsWith(t+"=")});if(r&&r.length){var n=r[0].substr(t.length+1);return decodeURIComponent(n)}return null}function i(t){var e={};for(var r in t)r.startsWith("utm_")||(e[r]=t[r]);return e}function u(t){var e=[];for(var r in t)e.push(r+"="+t[r]);return e.length?"?"+e.join("&"):""}function c(t){var e=(0,l.default)(t),r=[e.protocol,"://",e.host,e.port?":"+e.port:"",e.path,u(i(e.queryKey))].join("");return r}Object.defineProperty(e,"__esModule",{value:!0}),e.getParamFromUrl=o,e.getParamFromUrlString=a,e.cleanParams=i,e.paramsToQueryString=u,e.cleanUrl=c;var s=r(18),l=n(s)}});
//# sourceMappingURL=background.js.map