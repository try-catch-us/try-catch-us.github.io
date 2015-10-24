# try-catch-us #

This is the repository of the [try-catch-us.github.io](http://try-catch-us.github.io/) web site.

## What is it ##
This is a visualisation interface for some data in a *.csv* format given in a **textarea** element. This data represents localization information and description of different startups' garages .

## How to use it? ##
When scrolling to the map (or choosing the option in the side bar menu) you have 3 buttons on the top left of the map:
 - "*Fetch data*" button permits to enter *.csv* data in a modal window. It will then lead you to browse data modal.
 - "*Browse data*" : it represents your data in a **responsive** table. You can sort rows. Each row represants a localisation data for one point. In the first column, you can select data to be represented in the map. You can also select a column to be used as your markers labels and one column to be used as description displayed in infoWindows next to markers.
 - "*Delete data*" : By clicking here, you delete all the entered data and displayed markers on the map.

## Next milestone ##
The next thing to do is to enhance the mobile version of this site, that is not as user friendly that it should be.

## modules ##
This web site is built with ```require.js``` and AMD. The available modules are :
 - **bootable.js** : a Bootstrap table component
 - **csv.js** : a module that handles csv data
 - **map.js** : the module handling Google Maps component
 - **types.js** : a collection of simple and rich content types recognition.
 - **nav.js** : the controler module that handels all HTML events in the page
 - **domReady.js** : a CommonJs version of .onLoad()
 - **modals.js** : a module that offers a non blocking version of confirm (and alert) command

## Contibutors ##
 * [Samir ROUABHI](mailto:rouabhi@gmail.com)
