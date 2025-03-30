<?php
header("Content-Type: application/json"); 

$host = "localhost";
$user = "root";  
$pass = "";  
$dbname = "my_database";  

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $product_id  = $_POST['product_id'] ?? '';
    $title       = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $make    = $_POST['make'] ?? '';
    $model     = $_POST['model'] ?? '';
    $price       = $_POST['price'] ?? '';
    $user_id     = $_POST['user_id'] ?? '';

    if (!$product_id || !$title || !$description || !$make || !$model || !$price || !$user_id) {
        echo json_encode(["status" => "error", "message" => "Missing required fields"]);
        exit;
    }

    $image = $_FILES['image'];

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($image['type'], $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Invalid image file type"]);
        exit;
    }

    $uploadDirectory = "../uploads/";
    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0777, true); 
    }
    $hashedProdID = uniqid($product_id);
    $targetFile = $uploadDirectory . basename($image["name"]);
    if (move_uploaded_file($image["tmp_name"], $targetFile)) {
        $query = "INSERT INTO products (product_id, title, description, make, model, price, image, user_id) 
                  VALUES ('$hashedProdID', '$title', '$description', '$make', '$model', '$price', '" . $image['name'] . "', '$user_id')";

        if ($conn->query($query)) {
            echo json_encode([
                "status" => "success",
                "message" => "Product added successfully",
                "product_id" => $product_id
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database insertion error: " . $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Image upload failed"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}

$conn->close();
?>
