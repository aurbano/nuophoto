nuophoto
========

> A JavaScript/HTML5 canvas image editor

Nuophoto is basically a web interface that aims to show the capabilities of JavaScript as a photo editing software.
The photo editing part is done with the library [PhotoJShop](https://github.com/aurbano/PhotoJShop).

Nuophoto and PhotoJShop started as the same project, but I realised that they should be developed independently, to provide image editing functions in JS without the need to load all the interface code in Nuophoto.

##Demo:

Still in alpha stage of development. If you want to test the latest build check out:

- http://aurbano.github.com/nuophoto


##Requirements:

- [jQuery](https://github.com/jquery/jquery)
- [requireJS](https://github.com/jrburke/requirejs)
- [Font Awesome 3](https://github.com/FortAwesome/Font-Awesome/releases/tag/v3.2.0) *(Upgrade pending)*
- [PhotoJShop](https://github.com/aurbano/PhotoJShop)
- workspace	(Just some gui functions bundled together)

##How it works
It consists of different parts that are completely independent (modular). First it's the GUI, without any logic. It's all hard coded inside `index.html`.
The interface event listeners are in `main.js`, which is kind of the conductor, it sets up the listeners, starts all the necessary components, but still doesn't know how to do anything by itself really.
Above that sits `workspace.js`, which has all the GUI logic. All the event listeners call methods on this "class" and it handles all the visual requirements.
When the user triggers an event that implies changes in the image, the last piece comes in place: `imgEditor.js`. This is the underlying library that handles the image manipulation, and there is one instance for every open file.
The effects are dynamically loaded when they are required, and they live in the `effects/` folder. All the effects receive a reference to the corresponding imgEditor instance, so that they are able to access and modify the image.

imgEditor should be completely unaware of the existance of the other layers, it's job is to modify the image and nothing else. It should work fine as a standalone library (Although it would probably require some tweaking)

##Contribute
If you want to contribute please feel free to do so, below are some ideas I have for future development:
- Use PhotoJShop where possible for the effects
- Dialog menus for effects
- Combine the two previous tasks and allow effect customization (i.e. blur radius)
- Custom matrix effects (Maybe even store in local memory)
- Upload/load from url
- Allow history traversal (moving back and forth)
- Allow hiding/showing layers
- Layer options, like blending modes and opacity.
- Update to FontAwesome 4

##Meta

* Developed by [Alejandro U. Alvarez](http://urbanoalvarez.es)
* Licensed under the MIT License
* Contributors: -
