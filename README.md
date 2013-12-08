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
