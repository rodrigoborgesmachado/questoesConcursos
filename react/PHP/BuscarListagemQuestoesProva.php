<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

$data = array('usuario'=>$_GET["usuario"]);
$data2 = array('prova'=>$_GET["prova"]);
$url = "http://teste.sunsalesystem.com.br/api/concursando/provas/getQuestoesProva?" . http_build_query($data) . "&" . http_build_query($data2);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$resp = curl_exec($curl);

echo $resp;

?>