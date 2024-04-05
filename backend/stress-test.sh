#!/bin/bash

endpoints=(
    "/sites/"
    "/catalogues/"
    "/cultures/"
    "/materials/"
    "/regions/"
)


test_endpoint() {
    local endpoint=$1
    local method=$2
    echo "Testing $method request for endpoint: $endpoint"
    autocannon -c 100 -d 5 -p 10 -m "$method" "http://localhost:3000$endpoint"
    read_from_stdin
}

# Iterate over each endpoint and test with different HTTP methods
for endpoint in "${endpoints[@]}"; do
    # Test with GET method
    test_endpoint "$endpoint" "GET"
    # Test with POST method
    test_endpoint "$endpoint" "POST"
    # Test with PUT method
    test_endpoint "$endpoint" "PUT"
    # Test with DELETE method
    test_endpoint "$endpoint" "DELETE"
done
