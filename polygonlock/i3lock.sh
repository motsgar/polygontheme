MESSAGE=""
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ $# -eq 0 ]] ; then
    MESSAGE="Type password to unlock"
fi

while true; do
	errlog=$(mktemp)

    i3lock -i $SCRIPT_DIR/lockscreen_background.png --color=00000000 \
    --force-clock --time-pos=45:980 --time-align 1 \
    --date-str="%A, %d/%m" --date-pos=45:1006 --date-align 1 \
    --time-color=ffffff --date-color=ffffff \
    --verif-text="" --wrong-text="" --noinput-text="" \
    --bar-indicator --bar-pos=245:1045 --bar-total-width 130 --bar-periodic-step 100 --bar-step 100 \
    --bar-base-width 4 --bar-direction 1 --bar-max-height 100 --bar-count 5 --bar-color=000000 \
    --keyhl-color=780bd4 --bshl-color=9d1717 --ringwrong-color=ff0000 --ringver-color=0000ff \
    --refresh-rate=0.2 --redraw-thread --no-modkey-text --greeter-text="$MESSAGE" \
    --greeter-pos=45:1033 --greeter-color=ffffff --greeter-align 1 --greeter-size 15 \
    2> "$errlog"

    retval=$?

    if [[ -s "$errlog" ]]; then
       	rm "$errlog"
       	echo "[i3lock] something was printed to stderr"
    else
        if [ $retval -eq 0 ]; then
            break
        fi
        echo "[i3lock] i3lock exited unexpectedly"
    fi

    
done
