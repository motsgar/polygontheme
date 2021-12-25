#/bin/bash

THEME_DIR=/usr/share/web-greeter/themes
THEME_NAME=polygongreeter

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

rm -rf "$THEME_DIR/$THEME_NAME"
cp -rT "$THEME_NAME" "$THEME_DIR/$THEME_NAME"
