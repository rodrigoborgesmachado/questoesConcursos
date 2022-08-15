<?php
$url = "http://teste.sunsalesystem.com.br/api/concursando/logar?login=" . htmlspecialchars($_GET["login"]) . "&pass=" . htmlspecialchars($_GET["pass"]);

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>