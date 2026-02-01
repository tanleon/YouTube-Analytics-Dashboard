<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";   // your MySQL username
$password = "";       // your MySQL password
$dbname = "youtube_dashboard";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT * FROM youtube_videos ORDER BY created_at DESC";
$result = $conn->query($sql);

$videos = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $videos[] = $row;
    }
}

echo json_encode($videos);

$conn->close();
?>
