project_file="$HOME/projects/projects.json"
repo_code="$1"
repo_dir="$(jq ".[] | select( .code == \"$repo_code\" )" "$project_file" )"

echo "syncing repo $repo_code ($repo_dir)"

