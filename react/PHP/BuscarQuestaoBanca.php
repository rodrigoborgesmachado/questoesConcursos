<?php
$data = array('bancas'=>$_GET["Bancas"]);
$url = "http://teste.sunsalesystem.com.br/api/concursando/questoes/getQuestoesPorBanca?" . http_build_query($data);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>