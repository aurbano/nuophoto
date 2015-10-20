![nuophoto](https://raw.github.com/aurbano/nuophoto/master/img/logo/logo_bw.PNG)
===

> A JavaScript/HTML5 canvas image editor

**Currently working on version 2 - With Angular, bootstrap, and much better practices**

Nuophoto is basically a web interface that aims to show the capabilities of JavaScript as a photo editing software.
The photo editing part is done with the library [PhotoJShop](https://github.com/aurbano/PhotoJShop).

Nuophoto and PhotoJShop started as the same project, but I realised that they should be developed independently, to provide image editing functions in JS without the need to load all the interface code in Nuophoto.

##Demo:

Still in alpha stage of development. If you want to test the latest build check out:

- http://aurbano.github.com/nuophoto


##Compatibility:
nuophoto is using some CSS3 and HTML5 things that only updated browsers support. I haven't run very specific tests (if you do please let me know) but so far I have detected the following:

- Blending modes: [Chrome and Firefox](http://blogs.adobe.com/webplatform/2013/05/20/canvas-blending-is-now-in-chrome-canary-safari-and-firefox/), iOS Safari

##How it works
It consists of different parts that are completely independent (modular). First it's the GUI, without any logic. It's all hard coded inside `index.html`.
The interface event listeners are in `main.js`, which is kind of the conductor, it sets up the listeners, starts all the necessary components, but still doesn't know how to do anything by itself really.
Above that sits `workspace.js`, which has all the GUI logic. All the event listeners call methods on this "class" and it handles all the visual requirements.
When the user triggers an event that implies changes in the image, the last piece comes in place: `imgEditor.js`. This is the underlying library that handles the image manipulation, and there is one instance for every open file.
The effects are dynamically loaded when they are required, and they live in the `effects/` folder. All the effects receive a reference to the corresponding imgEditor instance, so that they are able to access and modify the image.

imgEditor should be completely unaware of the existance of the other layers, it's job is to modify the image and nothing else. It should work fine as a standalone library (Although it would probably require some tweaking)

##Contribute
If you want to contribute please feel free to do so, below are some ideas I have for future development:

- Responsive design
- Touch controls
- Custom matrix effects (Maybe even store in local memory)
- Upload/load from url
- Allow history traversal (moving back and forth)

##Meta

* Developed by [Alejandro U. Alvarez](http://urbanoalvarez.es)
* Licensed under the MIT License
* Contributors: -

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/nuophoto/readme)](https://github.com/aurbano)
