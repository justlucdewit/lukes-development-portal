path_to_open="$1"
echo "Attempting to open $path_to_open"

if [[ "$path_to_open" ]]; then
    eval "open \"$HOME/projects/$path_to_open\""
else
    open "$HOME/projects"
fi
