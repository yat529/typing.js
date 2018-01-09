# typing.js

A Mini Javascript Library for Creating a Typing Effect.

typing.js is very easy to use, it utilizes a chainable syntax style, which makes it very straight forward, ease to read and type, on-the-fly.


## Dependency

**None**. This is a standalone library, however, this library will be exposed to global as `typing` or its alias `_$`.


## Getting started

### HTML

An empty `<div id="selector">` is requied. It is used to wrap the input text strings. The id selector is passed as the first parameter into the javascript init function `_$(selector, speed, initialDelay)` function.

```html
<div id="selector"></div>
```

### CSS

Some default css rules is required. Copy and paste, or just reference the rules in the **typing.css**. Please note that, in typing.css, `#demo` is used as the id selector. Just replace with your own selector.

```css
#demo .line,
#demo span {
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
}

#demo span {
    display: inline-block;
    position: relative;
}

#demo span.head {
    margin-left: 4px;
}

#demo span.space {
    margin-right: 4px;
}

#demo span.current::after {
    content: "";
    position: absolute;
    display: inline-block;
    height: 0.9rem;
    top: 50%;
    right: -3px;
    transform: translateY(-50%);
    border-left: 2px solid #000;
    animation: blink-caret 0.9s step-end infinite;
}

#demo span.current.space::after {
    right: -6px;
}

/* Optional */
#demo span.past {
    color: gray;
}

@keyframes blink-caret {
    0% { border-color: #000 }
    50% { border-color: transparent }
    100% { border-color: #000 }
}
```

### Javascript

The init function is:
```javascript
_$(selector, speed, initialDelay)
```
- **selector**: the `#ID` of the target element in your html file **without #**.
- **speed**: the global or initial speed, this value can be changed on-the-fly by using the `speed()` method.
- **initialDelay**: the delay before the typing animation (of the first string) starts.


## How to Use Then

There are five methods available, and they can be chained up.

- `type(string, [option])`: it takes two parameters: `string` and `option`. `string` is the string to type, the leading or tailing blankspace will also be typed (Note: for formatting purpose, extra blankspace will be ignored). `option` specifies the css style of the `string`, its an object with css styles in key&value pairs. The keys should be identical to the keys in DOM element `style` property.
```javascript
var string = "Typing Javascript";

.type(string, { 
    fontWeight: "bold", 
    color: "black",
});
```

- `delete([string])`: it will delete the `string` or entire line if not specified. **Note:** `string` should be last couple or part of the strings you typed, whitespace will be included.
```javascript
// if you typed "Typing Javascript" ealier
var stringToRemove = "Javascript";

// output will be "Typing "
.delete(stringToRemove);
```

- `lineBreak()`: start a new line.
```javascript
.lineBreak();
```

- `wait(time)`: pause the typing for a time interval. The `time` parameter is the time interval in **millisecond**.
```javascript
// wait for 300ms
.wait(300);
```

- `speed(time)`: define the typing speed of following `type()` method, The `time` parameter is the speed in **millisecond**.
```javascript
// typing speed is the time interval each string is typed. Less is faster.
.speed(70);
```


## Full Example

This is a simple example including all the features.

In a HTML file which you want to display this typing effect, create a empty div with the `id="demo"`.

```html
<div id="demo"></div>
```

Copy and paste the CSS rules, in the `<style>` tag or in a seperate css file.

Then, in the `<script></script>` tag, or in a seperate javascript file, paste in the following codes

```html
<script src="typing.js"></script>
<script>
    _$("demo", 100, 800)
        .type("Hello! ").wait(1000).speed(100)
        .type("This is ").wait(300).speed(100)
        .lineBreak()
        .type("Typing Javascript", { 
            fontWeight: "bold", 
            color: "black",
        }).speed(40)
        .delete("Javascript").wait(1000).speed(200)
        .type("JS", { 
            fontWeight: "bold", 
            color: "black",
        }).wait(1000)
        .lineBreak();
</script>
```

Run the HTML file and see the magic! :sparkles:

Also, check in the index.html file in this repo, it contains a styling that will give a much better look and feel.

## Author
Yao Tong - [Github](https://github.com/yat529)