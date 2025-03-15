project_file="$HOME/projects/projects.json"
repo_code="$1"
goto_branch="$2"
repo_dir="$HOME/projects/$(jq -r ".[] | select( .code == \"$repo_code\" ) | .dir" "$project_file" )"

cd "$repo_dir"
git checkout "$goto_branch"