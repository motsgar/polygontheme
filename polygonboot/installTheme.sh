#/bin/bash

THEME_DIR=/usr/share/plymouth/themes
THEME=polygonboot

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cp -r "$THEME" "$THEME_DIR"
plymouth-set-default-theme -R "$THEME"
