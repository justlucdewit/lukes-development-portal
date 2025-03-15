path_to_open="$1"
echo "Attempting to open $path_to_open"

if [[ "$path_to_open" ]]; then
    eval "code \"$HOME/projects/$path_to_open\""
else
    code "$HOME/projects"
fi
