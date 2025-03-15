const action_service = {
    execute_action: (action, args = ["#test"]) => fetch(`/actions/${action}?args=${args.join(" ")}`)
}