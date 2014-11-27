Multiplayer Pong
================

Multiplayer Pong is a multiplayer version of Pong that runs in your browser.

I created it to learn about different networking techniques. It has three different modes.

* lockstep: The game does not proceed until both players have issued an action for the next frame (either move up, move down, or a non-move frame).
* terminal-client: All game logic is handled on the server. Clients send their moves to a server. The position of the paddles are set on the clients only after the server responds with their new positions.
* predictive-client: The client renders the local paddle's move immediately before sending its position to the server. The server issues a correction if the move was impossible.

Latency for each mode can be set in `core/configjs`. Lockstep mode only mimics a peer-to-peer connection, using a server to forward requests to each client.

Usage
------------
``` bash
$ grunt copy
$ node index
pong started: 3000 (development)
```

License
-------
(The MIT License)

Copyright (c) 2014 Drew Blaisdell <drew.blaisdell@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.