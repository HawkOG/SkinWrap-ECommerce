<?php
header('Content-Type: application/json');

// Enable error reporting (for debugging only, remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connect to the database
$conn = new mysqli("localhost", "root", "", "my_database");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Ensure product_id is set in the URL
if (isset($_GET['product_id'])) {  // Use product_id instead of product-id
    $product_id = $_GET['product_id'];

    // Prepare and execute query
    $stmt = $conn->prepare("SELECT * FROM products WHERE product_id = ?");
    $stmt->bind_param("s", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Product not found"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid product ID"]);
}

$conn->close();
?>
