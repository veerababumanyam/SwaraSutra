#!/bin/bash

# List of project IDs to delete
projects=(
  "apilockr"
  "codegaurd-28b74"
  "desicart-d7339"
  "desiconnect-ff411"
  "lingualens-ivxaw"
  "LayaVani-95e35"
  "polyquery"
  "pulsarchat-4f548"
  "pulsarchat-b3e27"
  "stockpulse-fdf98"
  "verdevibes-a9851"
)

echo "Starting automated deletion of ${#projects[@]} Firebase projects..."

for project in "${projects[@]}"; do
  echo "Deleting project: $project ..."
  firebase projects:delete "$project" --force
  if [ $? -eq 0 ]; then
    echo "Successfully deleted $project"
  else
    echo "Failed to delete $project"
  fi
  echo "-----------------------------------"
done

echo "All deletion attempts completed."
