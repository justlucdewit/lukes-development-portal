project_file="$HOME/projects/projects.json"
repo_code="$1"
repo_dir="$HOME/projects/$(jq -r ".[] | select( .code == \"$repo_code\" ) | .dir" "$project_file" )"

if [[ -d "$repo_dir" ]]; then
    stats_file="./data/repos/$repo_code.json"

    mkdir -p "./data/repos"
    touch "$stats_file"
    echo "{}" > "$stats_file"

    function run_jq_command() {
        local cmd="$1"

        output=$(jq "$cmd" "$stats_file")
        echo "$output" > "$stats_file"
    }

    old_dir=$(pwd)
    cd "$repo_dir"
    first_commit_date=$(git log --reverse --format="%cd" --date=iso | head -n 1)
    latest_commit_date=$(git log -1 --format="%cd" --date=iso)
    total_commit_count=$(git rev-list --all --count)
    branch_count=$(git branch -a | sed 's#^..##' | sort -u | wc -l)

    cd "$old_dir"
    run_jq_command ".stats.first_commit_date = \"$first_commit_date\""
    run_jq_command ".stats.last_commit_date = \"$latest_commit_date\""
    run_jq_command ".stats.commit_count = $total_commit_count"
    run_jq_command ".stats.branch_count = $branch_count"
fi