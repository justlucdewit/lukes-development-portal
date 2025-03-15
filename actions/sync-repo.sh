#!/bin/bash

project_file="$HOME/projects/projects.json"
repo_code="$1"
repo_dir="$HOME/projects/$(jq -r ".[] | select( .code == \"$repo_code\" ) | .dir" "$project_file" )"

if [[ -d "$repo_dir" ]]; then
    stats_file="./data/repos/$repo_code.json"

    mkdir -p "./data/repos"
    touch "$stats_file"
    echo '{"stats": {}, "branches": []}' > "$stats_file"

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
    
    # Get the current branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    # Get all unique branch names (local & remote), remove "origin/" from remotes, and exclude "HEAD"
    branches=$(git for-each-ref --format='%(refname:short)' refs/heads refs/remotes \
        | sed 's#^origin/##' | sort -u | grep -v '^HEAD$')

    # Construct JSON array for branches
    branches_json="[]"
    while IFS= read -r branch; do
        last_commit_date=$(git log -1 --format="%cd" --date=iso "$branch" 2>/dev/null || echo "unknown")
        is_active=$( [[ "$branch" == "$current_branch" ]] && echo "true" || echo "false" )

        branch_obj=$(jq -n \
            --arg name "$branch" \
            --argjson active "$is_active" \
            --arg last_commit_date "$last_commit_date" \
            '{name: $name, active: $active, last_commit_date: $last_commit_date}')
        
        branches_json=$(jq --argjson branch "$branch_obj" '. + [$branch]' <<< "$branches_json")
    done <<< "$branches"

    cd "$old_dir"

    # Store repo stats
    run_jq_command ".stats.first_commit_date = \"$first_commit_date\""
    run_jq_command ".stats.last_commit_date = \"$latest_commit_date\""
    run_jq_command ".stats.commit_count = $total_commit_count"
    run_jq_command ".stats.branch_count = $(jq '. | length' <<< "$branches_json")"
    run_jq_command ".stats.current_branch = \"$current_branch\""
    
    # Store branches as the root array
    run_jq_command ".branches = $branches_json"
fi
