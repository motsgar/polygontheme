if [ "$1" = "install" ]; then
   sudo ./installTheme.sh
   if [ "$2" = "flicker" ]; then
   for ((n=0;n<5;n++))
      do
      sudo plymouthd ; sudo plymouth --show-splash ; sleep 2; sudo plymouth ask-for-password; sleep 1 ; sudo killall plymouthd
      sleep 3;
   done
   else
      sudo plymouthd ; sudo plymouth --show-splash ; sleep 5; sudo killall plymouthd
   fi
else
   if [ "$1" = "flicker" ]; then
   for ((n=0;n<5;n++))
      do
      sudo plymouthd ; sudo plymouth --show-splash ; sleep 2; sudo plymouth ask-for-password; sleep 1 ; sudo killall plymouthd
      sleep 3;
   done
   else
      sudo plymouthd ; sudo plymouth --show-splash ; sleep 5; sudo killall plymouthd
   fi
fi
