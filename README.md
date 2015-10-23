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
One thing to do is to refactor the site into AML to make it easier to update. Notice that this will be bad for server load as it will have many requests for *.js files instead of one request.

The next thing to do is to enhance the mobile version of this site, that is not as user friendly that it should be.

## Contibutors ##
 * [Samir ROUABHI](mailto:rouabhi@gmail.com)
