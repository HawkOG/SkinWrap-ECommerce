<?php
header("Content-Type: application/json");

$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";  

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM products";
$result = $conn->query($sql);
$products = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products); 
} else {
    echo json_encode(['message' => 'no entries found']);
}

$conn->close();
?>