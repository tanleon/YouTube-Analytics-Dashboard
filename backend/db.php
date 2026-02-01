<?php
$conn = new mysqli("localhost", "root", "", "youtube_dashboard");
if ($conn->connect_error) {
    die("DB connection failed");
}
