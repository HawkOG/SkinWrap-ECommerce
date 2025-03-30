<?php
header("Content-Type: application/json");

$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";  

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["error" => "Missing email or password"]);
    exit;
}

$email = $data['email'];
$password = $data['password'];

$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email = ?"); 
$stmt->bind_param("s", $email); 
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($storedUserId, $storedUsername, $storedHashedPassword);
    $stmt->fetch();

    error_log("Username: " . $storedUsername);
    error_log("Hashed Password: " . $storedHashedPassword);

    // Verify password
    if (password_verify($password, $storedHashedPassword)) {
        echo json_encode(["user" => $email, "username" => $storedUsername, "user_id" => $storedUserId]);
    } else {
        echo json_encode(["error" => "Invalid credentials"]);
    }
} else {
    echo json_encode(["error" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
