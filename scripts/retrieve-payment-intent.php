<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

require '../vendor/autoload.php';
\Stripe\Stripe::setApiKey('sk_test_51Qs3NMPvDvk9jk0fOgyLpjXppqWGh8yrzpdiucRttPIuQUtOEJShFWIblqoZVdMWz8SErCjO41HDy7ESkVFTqm6z00NF8d9ePU');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

error_log("Received in retrieve-payment-intent.php: " . print_r($data, true));

$paymentIntentID = $data['paymentIntentID'] ?? null;
$orderID = $data['orderID'] ?? null;
$items = $data['items'] ?? [];
$customer = $data['customer'] ?? [];

if (!$paymentIntentID || !$orderID || empty($items)) {
    echo json_encode(['error' => 'Missing paymentIntentID, orderID, or items', 'received' => $data]);
    exit;
}

try {
    $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentID);
    error_log("Payment Intent status: " . $paymentIntent->status);

    if ($paymentIntent->status === 'succeeded') {
        saveOrderToDatabase($orderID, $paymentIntentID, $items, $customer);
        echo json_encode(['success' => 'Payment successful, order saved']);
    } else {
        echo json_encode(['error' => 'Payment not successful', 'status' => $paymentIntent->status]);
    }
} catch (\Stripe\Exception\ApiErrorException $e) {
    error_log("Stripe API error: " . $e->getMessage());
    echo json_encode(['error' => 'Stripe API error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}

function saveOrderToDatabase($orderID, $paymentIntentID, $items, $customer) {
    try {
        $db = new PDO('mysql:host=localhost;dbname=my_database', 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        error_log("Customer data to save: " . print_r($customer, true));

        $stmt = $db->prepare('INSERT INTO orders (order_id, payment_intent_id, customer_name, address_line1, city, state, postal_code, country, created_at) 
                              VALUES (:order_id, :payment_intent_id, :customer_name, :address_line1, :city, :state, :postal_code, :country, NOW()) 
                              ON DUPLICATE KEY UPDATE payment_intent_id = :payment_intent_id, 
                              customer_name = :customer_name, address_line1 = :address_line1, city = :city, 
                              state = :state, postal_code = :postal_code, country = :country');
        $stmt->execute([
            'order_id' => $orderID,
            'payment_intent_id' => $paymentIntentID,
            'customer_name' => $customer['customer_name'] ?? null,
            'address_line1' => $customer['address_line1'] ?? null,
            'city' => $customer['city'] ?? null,
            'state' => $customer['state'] ?? null,
            'postal_code' => $customer['postal_code'] ?? null,
            'country' => $customer['country'] ?? null
        ]);

        $itemStmt = $db->prepare('INSERT INTO order_items (order_id, product_id, product_title, product_price, product_make, product_model) 
                                  VALUES (:order_id, :product_id, :product_title, :product_price, :product_make, :product_model)');
        foreach ($items as $item) {
            error_log("Saving item: " . print_r($item, true));
            $itemStmt->execute([
                'order_id' => $orderID,
                'product_id' => $item['product-id'],
                'product_title' => $item['product-title'],
                'product_price' => $item['product-price'],
                'product_make' => $item['product-make'],
                'product_model' => $item['product-model'],
            ]);
        }
    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        throw new Exception('Failed to save order to database');
    }
}
?>