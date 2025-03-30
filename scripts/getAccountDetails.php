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
$userID = $_GET['userID'];
$sql = "SELECT * FROM products WHERE user_id=$userID";
$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    error_log(print_r($products, true));
    echo json_encode(array($products));
} else {
    echo json_encode(['message' => 'no entries found']);
}

$conn->close();
?>
