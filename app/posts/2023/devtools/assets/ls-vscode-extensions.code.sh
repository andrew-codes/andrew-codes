echo "Ensure the latest bash is installed if using OSX (brew install bash)"

markdown_list_output="| Extension Name | Description |
|:--|:--|"
markdown_install_output="\`\`\`bash"
readarray -t extensions < <(code --list-extensions)
echo "Total extensions: ${#extensions[@]}"
for val in "${extensions[@]}"; do

    markdown_install_output="$markdown_install_output
code --install-extension $val"

    echo "Looking up information on $val"
    extension_data=$(
        curl \
            -s \
            --data "{\"assetTypes\":null,\"filters\":[{\"criteria\":[{\"filterType\":7,\"value\":\"$val\"}],\"direction\":2,\"pageSize\":100,\"pageNumber\":1,\"sortBy\":0,\"sortOrder\":0,\"pagingToken\":null}],\"flags\":2151}" \
            --header "accept: application/json;api-version=3.0-preview.1" \
            --header "content-type: application/json" \
            https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery
    )

    extensionName="$(echo "$extension_data" | jq '.results[0].extensions[0].extensionName')"
    if [ extensionName == 'null' ]; then
        continue
    fi
    markdown_list_output="$markdown_list_output
$(
        echo "$extension_data" |
            jq '"|[\(.results[0].extensions[0].displayName)](https://marketplace.visualstudio.com/items?itemName=\(.results[0].extensions[0].publisher.publisherName).\(.results[0].extensions[0].extensionName)) | \(.results[0].extensions[0].shortDescription) |"' |
            sed 's/\"//g'
    )"
done

markdown_install_output="$markdown_install_output
\`\`\`"

output="$markdown_list_output

$markdown_install_output"

echo "$output"
