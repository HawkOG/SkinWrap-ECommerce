<?php
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$email = $data['email'];
$password = $data['password'];
$username = $data['username'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Invalid email format"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["error" => "Email or Username already exists"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $username, $hashedPassword);

if ($stmt->execute()) {
    $res = array("success" => true, "message" => "User $username registered successfully.");
} else {
    $res = array("error" => "Failed to register user.");
}

echo json_encode($res);

// Close th statement and connection
$stmt->close();
$conn->close();
?>
