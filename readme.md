# carousel loop animation
----------
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carousel</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .item {
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <div class="carousel">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <div class="item">4</div>
        <div class="item">5</div>
        <div class="item">8</div>
        <div class="item">9</div>
        <div class="item">10</div>
    </div>

    <button id="back">back</button>
    <button id="next">next</button>
    <script src="script.js"></script>
</body>
</html>
```
```javascript
let carousel = Carousel('.carousel', {
  slidePerFrame: 8
})

carousel.loop(5000)
```
----------
