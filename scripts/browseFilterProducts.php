<?php
header("Content-Type: application/json");

$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

$make = isset($_GET['make']) ? trim($_GET['make']) : '';
$model = isset($_GET['model']) ? trim($_GET['model']) : '';

$sql = "SELECT * FROM products";
$params = [];
$types = "";

if ($make && $model) {
    $sql .= " WHERE make = ? AND model = ?";
    $params = [$make, $model];
    $types = "ss";
} elseif ($make) {
    $sql .= " WHERE make = ?";
    $params = [$make];
    $types = "s";
} elseif ($model) {
    $sql .= " WHERE model = ?";
    $params = [$model];
    $types = "s";
} elseif(!$make && !$model){
    $sql .= "";
    $params = '';
    $types = "";
}

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);

$stmt->close();
$conn->close();
?>