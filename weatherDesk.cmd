cd /d "%~dp0"

::this is compiled from node js app here:
weatherDesk.exe

wkhtmltoimage.exe --disable-smart-width --width 1600 --height 1080 %temp%\weatherDesk.htm %temp%\weatherDesk.png

::from: http://sg20.com/techblog/2011/06/23/wallpaper-changer-command-line-utility/
::there are various stretch formats 1,2,3,4... just try them out
WallpaperChanger.exe "%temp%\weatherDesk.png" 1

erase "%temp%\weatherDesk.*"