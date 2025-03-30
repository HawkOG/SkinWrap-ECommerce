<?php
require '../vendor/autoload.php';
\Stripe\Stripe::setApiKey('sk_test_51Qs3NMPvDvk9jk0fOgyLpjXppqWGh8yrzpdiucRttPIuQUtOEJShFWIblqoZVdMWz8SErCjO41HDy7ESkVFTqm6z00NF8d9ePU');

header('Content-Type: application/json');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$items = $data['items'];
$orderID = $data['order_id'] ?? null;

if (empty($items)) {
    echo json_encode(['error' => 'Missing items']);
    exit;
}
if (empty($orderID)) {
    echo json_encode(['error' => 'Missing order_id']);
    exit;
}
try {
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => array_sum(array_map(function ($item) {
            return $item['price_data']['unit_amount'];
        }, $items)),
        'currency' => 'eur',
        'payment_method_types' => ['card'],
        'metadata' => ['order_id' => $orderID],
    ]);

    echo json_encode([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentID' => $paymentIntent->id,
    ]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>