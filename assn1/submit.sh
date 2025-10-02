#!/bin/sh

# This script is used to create a submission tarball for Software Enginneering
# assignment #1.

temp_files=""
archive_files=""

notice() {
    printf "\\033[33m%s\\033[0m\n" "$@"
}

input() {
    prompt="$1"
    variable="$2"
    printf "\\033[33m%s:\\033[0m " "$prompt"
    read -r "$variable"
}

submit_git() {
    assignment_id="$1"
    input "Enter the path to your git repository" repo_path
    if [ ! -d "$repo_path/.git" ]; then
        notice "Error: $repo_path is not a git repository."
        exit 1
    fi
    tar -czvf "submit_${assignment_id}.tar.gz" -C "$repo_path" .
    temp_files="submit_${assignment_id}.tar.gz $temp_files"
    archive_files="submit_${assignment_id}.tar.gz $archive_files"
    eval "${assignment_id}_archive=submit_${assignment_id}.tar.gz"
}

submit_container() {
    assignment_id="$1"
    input "Enter your Docker Hub username" docker_hub_username
    input "Enter your Docker Hub repository name" docker_hub_repo
    input "Confirm that your image is available as docker.io/${docker_hub_username}/${docker_hub_repo}:latest (y/n)" confirm
    if [ "$confirm" != "y" ]; then
        notice "Aborting submission."
        exit 1
    fi
    eval "${assignment_id}_image=docker.io/${docker_hub_username}/${docker_hub_repo}:latest"
}

input "Enter your student ID" student_id
input "Enter your full name (as on LearnUs)" full_name

notice "---- ex01 ----"
submit_git "ex01"

notice "---- ex02 ----"
submit_git "ex02"

notice "---- ex03 ----"
submit_git "ex03"

notice "---- ex04 ----"
submit_container "ex04"
i=0
ex04_io_json=""
while [ "$i" -ne 3 ]; do
    input "Enter the path to input file #$i" input_file
    if [ ! -f "$input_file" ]; then
        notice "Error: $input_file does not exist."
        exit 1
    fi
    archive_files="$input_file $archive_files"
    input "Enter the path to expected output file #$i" output_file
    if [ ! -f "$output_file" ]; then
        notice "Error: $output_file does not exist."
        exit 1
    fi
    archive_files="$output_file $archive_files"
    ex04_io_json="$ex04_io_json{\"input\": \"$(basename "$input_file")\", \"output\": \"$(basename "$output_file")\"}"
    if [ "$i" -ne 2 ]; then
        ex04_io_json="$ex04_io_json,"
    fi
    i=$((i + 1))
done

notice "---- ex05 ----"
submit_container "ex05"

cat <<EOF > metadata.json
{
  "student_id": "$student_id",
  "full_name": "$full_name",
  "assignments": {
    "ex01": {
      "type": "git",
      "file": "$ex01_archive"
    },
    "ex02": {
      "type": "git",
      "file": "$ex02_archive"
    },
    "ex03": {
      "type": "git",
      "file": "$ex03_archive"
    },
    "ex04": {
      "type": "container",
      "image": "$ex04_image",
      "tests": [$ex04_io_json]
    },
    "ex05": {
      "type": "container",
      "image": "$ex05_image"
    }
  }
}
EOF

notice "Creating final submission tarball..."
tar -czvf "submit_${student_id}.tar.gz" \
    metadata.json $archive_files

notice "Removing intermediate files..."
rm -v metadata.json $temp_files

notice "Submission tarball created: submit_${student_id}.tar.gz"
notice "Please upload this file to LearnUs before the deadline."
