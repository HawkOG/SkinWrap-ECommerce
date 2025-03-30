<?php
header("Content-Type: application/json"); 

$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $productID = isset($_GET['id']) ? $_GET['id'] : null;  
    error_log("Received Product ID: " . $productID);

    if (!$productID) {
        echo json_encode(["status" => "error", "message" => "Invalid product ID"]);
        exit();
    }

    $sql = "DELETE FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $productID); 

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Product deleted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Product not found or already deleted"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete product"]);
    }

    $stmt->close();
    $conn->close();
    exit();
}

echo json_encode(["status" => "error", "message" => "Invalid request method"]);
?>
