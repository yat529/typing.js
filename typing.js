(function(global){

    var selector,       // id of dom elem
        prevSpans = [], // array of previous span elem
        prevLines = [], // array of previous lines
        waitTime,       // global delay time used for setTimeOut
        typeSpeed,      // time interval for the setTimeOut
        strInput = [];  // all the typed text in a array


    // main object
    var typing = function(id, speed, initialDelay){
        return new fn(id, speed, initialDelay);
    }

    // constructor
    function fn(id, speed, initialDelay) {
        
        // save to global variable
        selector = id;
        typeSpeed = speed || null;
        waitTime = initialDelay || 0;

        // create a new line then append to the selector element
        // create a new span with a current class, then append to the new line element
        // push the new span into the prevSpans array (Note: this IMPORTANT, becuase the type function will retrive the previous span from this array, and create a new sibling span base on it)
        var newLine = createElem("div", "line"),
            newSpan = createElem("span", "current"),
            newLine = document.getElementById(selector).appendChild(newLine),
            newSpan = newLine.appendChild(newSpan);

        strInput.push("");
        prevSpans.push(newSpan);
        return this;
    };


    // add methods to proto
    var library = fn.prototype = {

        // animation speed
        speed: function(speed){
            typeSpeed = speed;
            return this;
        },
        
        // animate typing effect
        // 
        // first, retrive previous span, then create a new sibling span, saved as current span, input string will be included in this span
        // then sanitize, and normalized the style object
        // update string global with input string
        // (SetTimeOut) then, check if previous span has the current class, if it does, remove the class, this will toggle of the blink cursor
        // (SetTimeOut) then add the current class to current span
        // (SetTimeOut) then, loop throung the input string, push then into the current span (at the user defined speed)
        // (SetTimeOut) apply style if available
        // push current span into the prevSpans array
        // 
        // Global variable used: prevSpans, waitTime, typeSpeed, string

        type: function(str, obj){
            var counter = 0,
                style = {},
                currSpan,
                prevSpan,
                newSpan = createElem("span"),
                newLine,
                speed = typeSpeed;
           
            prevSpan = prevSpans[prevSpans.length - 1];
            currSpan = createSibling(prevSpan, newSpan);
            
            if(typeof str !== "string") return this;

            // sanitize the style obj, and create a normalized style obj
            // obj should have the keynames exactly as the css property name in JS
            // Now only support "fontWeight", "color", "fontStyle"
            if(obj && typeof obj === "object"){
                for(let key in obj){
                    switch(key){
                        case "fontWeight":
                            style.fontWeight = obj[key];
                            break;

                        case "color":
                            style.fontColor = obj[key];
                            break;

                        case "fontStyle":
                            style.fontStyle = obj[key];
                            break;
                    }
                }
            }
               
            // add to string
            strInput.push(str);
            
            for(let i = 0; i < str.length; i++){
                setTimeout( (function(){

                    currChar = str.charAt(i);

                    if(i==0){
                        // remove the blinking on previous span
                        if( hasClass(prevSpan, "current") )
                            prevSpan = resetSpanClass(prevSpan, "current", "past");
                        // add .current class to toggle the blinking cursor
                        if( !hasClass(currSpan, "current") )
                            currSpan.classList.add("current");
                         // check if first character is whitespace
                        if( isWhiteSpace(currChar) )
                            currSpan.classList.add("head");
                    }else{
                        // reset .space class on current span
                        if( hasClass(currSpan, "space") )
                            currSpan.classList.remove("space");
                        // check if currChar is whitespace
                        if( isWhiteSpace(currChar) )
                            currSpan.classList.add("space");
                    }
                    
                    // add to string
                    currSpan.innerHTML += currChar;

                    // apply styles
                    if(style.fontWeight)
                        currSpan.style.fontWeight = style.fontWeight;
                    if(style.fontColor)
                        currSpan.style.color = style.fontColor;
                    if(style.fontStyle)
                        currSpan.style.fontStyle = style.fontStyle;

                }), waitTime + (speed * counter) );

                counter++;
            }

            waitTime += speed * counter;
            prevSpans.push(currSpan);  
            return this;
        },

        // backword delete
        delete: function(str){

            var str = str || "",
                currSpan = prevSpans[prevSpans.length - 1],
                currStr = strInput[strInput.length - 1],
                counter = 0,
                endIndex,
                speed = typeSpeed;

            if(!str){
                endIndex = 0;
            }else{
                endIndex =  currStr.includes(str) ? currStr.indexOf(str) : null;

                if(!endIndex){
                    console.log("string not match");
                    return this;
                }
            }

            for(let i = currStr.length - 1; i >= endIndex; i--){
                setTimeout( (function(){

                    var str = currStr.slice(0, i);

                    // remove the .head class if no str left in the span
                    if( i == endIndex && !str.length && hasClass(currSpan, "head") )
                        currSpan.classList.remove("head");
                    // reset .space class
                    if( hasClass(currSpan, "space") )
                        currSpan.classList.remove("space");
                    // check if currChar is whitespace
                    if( hasTailingSpace(str) )
                        currSpan.classList.add("space");

                    currSpan.innerHTML = str;
                    
                }), waitTime + (speed * counter) );

                counter++;
            }

            waitTime += speed * counter;
            strInput[strInput.length - 1] = currStr.slice(0, endIndex);
            return this;
        },

        // wait
        wait: function(time){
            if(typeof time !== "number") return this;
            waitTime += time;
            return this;
        },

        // line break
        lineBreak: function(){
            // create a new span
            var newLine = createElem("div", "line"),
                newSpan = createElem("span"),
                currSpan = prevSpans[prevSpans.length - 1];
                currLine = currSpan.parentNode;

            newLine = document.getElementById(selector).appendChild(newLine);
            newSpan = newLine.appendChild(newSpan);

            // insert linebreak
            strInput.push("\n");
    
            setTimeout( (function(){
                currSpan = resetSpanClass(currSpan, "current", "past");
                newSpan.classList.add("current");
            }), waitTime);

            prevSpans.push(newSpan);
            prevLines.push(currLine);
            
            return this;
        },

        // log
        log: function(){
            console.log(this);
        }
    }





    // helper function
    // check if single whitespace
    function isWhiteSpace(str){      
        return /^\s$/.test(str);
    }
    // check if last character is whitespace
    function hasTailingSpace(str){
        return /\s$/.test(str);
    }

    // check if class name exists
    function hasClass(elem, className) {
        return elem ? elem.classList.contains(className) : false;
    }

    // use to reset a span's class, removes the "current" class, and add "past" class meanwhile
    // used everytime a span or new line is created
    function resetSpanClass(elem, clsToRemove, clsToAdd){
        if(!elem) return;
        elem.classList.add(clsToAdd);
        elem.classList.remove(clsToRemove);
        return elem;
    }

    // shorcut for document.createElement()
    function createElem(elemName, className){
        var elem = document.createElement(elemName),
            cls = className || null;
        if(cls) elem.classList.add(cls);
        return elem;
    }

    // shorcut for create a sibling
    function createSibling(elem, sibling){
        return elem.parentNode.appendChild(sibling);
    }


    



    // assign pointer to proto obj
    typing.prototype = library;

    // export to global
    global._$ = global.typing = typing;

})(window);