nuophoto
========

> A JavaScript/HTML5 canvas image editor

Nuophoto is basically a web interface that aims to show the capabilities of JavaScript as a photo editing software.
The photo editing part is done with the library [PhotoJShop](https://github.com/aurbano/PhotoJShop).

Nuophoto and PhotoJShop started as the same project, but I realised that they should be developed independently, to provide image editing functions in JS without the need to load all the interface code in Nuophoto.

PhotoJShop is still under development.


Requirements:
-------

- [jQuery](https://github.com/jquery/jquery)
- [requireJS](https://github.com/jrburke/requirejs)
- [Font Awesome 3](https://github.com/FortAwesome/Font-Awesome)
- [PhotoJShop](https://github.com/aurbano/PhotoJShop)
- workspace	(Just some gui functions bundled together)

Try it out:
------

Still in alpha stage of development. If you want to test the latest build check out:

- http://lab.nuostudio.com/nuophoto/ _(Release)_
- http://aurbano.github.com/nuophoto _(Development)_

*Note: It takes Github 10 min and up to 10 hours to update the code in gh-pages*

Roadmap
------
I think it will be interesting to start tracking features I think the editor must have, so from now on.
*Some of these are simply ideas I have, I might not develop them*

- [ ] Layer visibility (Hide/show layers)
- [ ] Filter options (At least a way of adding options if necessary)
- [ ] Display available filters automatically
- [ ] Selections: Apply filters to only certain parts
- [ ] Blending modes
- [ ] Layer opacity
- [ ] Undo/Go back to any place in history
- [ ] Create snapshots
- [ ] Load from URL
- [ ] Upload photo
- [ ] Share: Twitter, Facebook... etc
- [x] Change background color
- [x] Handle multiple files
- [x] Save photos
