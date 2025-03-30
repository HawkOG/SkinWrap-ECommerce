<?php
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

if (!isset($_GET['id']) || empty(trim($_GET['id']))) {
    echo json_encode(["error" => "Invalid or missing product ID"]);
    exit();
}

$prodID = trim($_GET['id']);

$sql = "SELECT * FROM products WHERE product_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $prodID);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

if (!empty($products)) {
    echo json_encode($products);
} else {
    echo json_encode(["message" => "No entries found"]);
}

$stmt->close();
$conn->close();
?>
