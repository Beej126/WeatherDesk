### NodeJs Based Exercise
1. scrape a web page
1. transform the content
1. render to png
1. save to desktop wallpaper

### Install
1. save the js and cmd files to a folder...
1. edit the url on line 32 of the js for your preferred location
1. put [WKHTMLtoImage.exe](http://wkhtmltopdf.org/downloads.html) in same folder (or your global path); note: somehow the setup.exe didn't save files to my program files but simply extracting the bin folder via zip was fine
1. throw [WallpaperChanger.exe](http://sg20.com/techblog/2011/06/23/wallpaper-changer-command-line-utility/) in there as well
1. and lastly perhaps launch the cmd every hour via Windows Task Scheduler

### Thoughts
going about the content this way seems to have a reasonable shot at standing the test of time... which seems to be the general problem with finding something viable like this already out there... i.e. not locked to a particular back end that's since gone dark... vs an overly burdensome customization required to chase the current state... i.e. pulling from whatever nice contemporary source of web weather you currently prefer and then doctoring it up with a relatively light, direct, pattern based approach like jQuery provides.

![image](https://cloud.githubusercontent.com/assets/6301228/23776364/b780a6a6-04e2-11e7-92e2-2f970a9a3595.png)
(imagine that, it's rainy in Seattle ; )
