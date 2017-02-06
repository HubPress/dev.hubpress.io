
(function (mod) {
    if (typeof exports == "object" && typeof module == "object") {
        // CommonJS
        mod(require("codemirror"));
    } else if (typeof brackets == "object" && brackets.getModule) {
        // Brackets editor (using this as a client-side module!)
        mod(brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"));
    } else if (typeof define == "function" && define.amd) {
        // AMD
        define(["codemirror"], mod);
    } else {
        // Plain browser env
        mod(CodeMirror);
    }
})(function (CodeMirror) {
  !function(e){e(CodeMirror)}(function(e){"use strict";e.overlayMode=function(o,r,a){return{startState:function(){return{base:e.startState(o),overlay:e.startState(r),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,streamSeen:null}},copyState:function(a){return{base:e.copyState(o,a.base),overlay:e.copyState(r,a.overlay),basePos:a.basePos,baseCur:null,overlayPos:a.overlayPos,overlayCur:null}},token:function(e,n){return(e!=n.streamSeen||Math.min(n.basePos,n.overlayPos)<e.start)&&(n.streamSeen=e,n.basePos=n.overlayPos=e.start),e.start==n.basePos&&(n.baseCur=o.token(e,n.base),n.basePos=e.pos),e.start==n.overlayPos&&(e.pos=e.start,n.overlayCur=r.token(e,n.overlay),n.overlayPos=e.pos),e.pos=Math.min(n.basePos,n.overlayPos),null==n.overlayCur?n.baseCur:null!=n.baseCur&&n.overlay.combineTokens||a&&null==n.overlay.combineTokens?n.baseCur+" "+n.overlayCur:n.overlayCur},indent:o.indent&&function(e,r){return o.indent(e.base,r)},electricChars:o.electricChars,innerMode:function(e){return{state:e.base,mode:o}},blankLine:function(e){o.blankLine&&o.blankLine(e.base),r.blankLine&&r.blankLine(e.overlay)}}}});

});
